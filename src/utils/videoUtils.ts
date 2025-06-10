
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

class VideoExporter {
  private ffmpeg: FFmpeg;
  private loaded = false;

  constructor() {
    this.ffmpeg = new FFmpeg();
  }

  async load() {
    if (this.loaded) return;
    
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    this.ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });
    
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    this.loaded = true;
  }

  async downloadYouTubeVideo(videoId: string, duration: number): Promise<Uint8Array> {
    // For demo purposes, we'll create a colored background video
    // In production, you'd need a proper YouTube downloader service
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 960;
    const ctx = canvas.getContext('2d')!;
    
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 540, 960);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(1, '#4ECDC4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 540, 960);
    
    // Add some animated elements
    const frames: string[] = [];
    for (let i = 0; i < duration * 30; i++) {
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 540, 960);
      
      // Add moving circles
      const time = i / 30;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(270 + Math.sin(time) * 100, 480 + Math.cos(time * 0.5) * 200, 50, 0, Math.PI * 2);
      ctx.fill();
      
      frames.push(canvas.toDataURL('image/png'));
    }
    
    // Convert frames to video using FFmpeg
    await this.load();
    
    for (let i = 0; i < frames.length; i++) {
      const response = await fetch(frames[i]);
      const blob = await response.blob();
      await this.ffmpeg.writeFile(`frame${i.toString().padStart(4, '0')}.png`, await fetchFile(blob));
    }
    
    await this.ffmpeg.exec([
      '-framerate', '30',
      '-i', 'frame%04d.png',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-t', duration.toString(),
      'background.mp4'
    ]);
    
    const data = await this.ffmpeg.readFile('background.mp4');
    return data as Uint8Array;
  }

  async captureRedditOverlay(elementId: string): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');
    
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 960;
    const ctx = canvas.getContext('2d')!;
    
    // Create transparent background
    ctx.clearRect(0, 0, 540, 960);
    
    // Render the Reddit overlay
    const redditOverlay = element.querySelector('.absolute.inset-0.flex.items-center.justify-center') as HTMLElement;
    if (redditOverlay) {
      await this.renderHTMLToCanvas(redditOverlay, ctx, 540, 960);
    }
    
    return canvas.toDataURL('image/png');
  }

  private async renderHTMLToCanvas(element: HTMLElement, ctx: CanvasRenderingContext2D, width: number, height: number) {
    const data = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Inter, sans-serif;">
            ${element.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `;
    
    const img = new Image();
    return new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        resolve();
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
    });
  }

  async createVideoWithOverlay(
    backgroundVideo: Uint8Array,
    overlayImage: string,
    options: {
      totalDuration: number;
      overlayStartTime: number;
      overlayDuration: number;
      exitAnimation: 'none' | 'fade' | 'slide';
    }
  ): Promise<Uint8Array> {
    await this.load();
    
    // Write background video
    await this.ffmpeg.writeFile('background.mp4', backgroundVideo);
    
    // Write overlay image
    const overlayResponse = await fetch(overlayImage);
    const overlayBlob = await overlayResponse.blob();
    await this.ffmpeg.writeFile('overlay.png', await fetchFile(overlayBlob));
    
    let filterComplex = '';
    
    if (options.exitAnimation === 'fade') {
      const fadeStart = options.overlayStartTime + options.overlayDuration - 1;
      filterComplex = `[1:v]fade=in:st=${options.overlayStartTime}:d=0.5:alpha=1,fade=out:st=${fadeStart}:d=1:alpha=1[overlay]; [0:v][overlay]overlay=0:0:enable='between(t,${options.overlayStartTime},${options.overlayStartTime + options.overlayDuration})'`;
    } else if (options.exitAnimation === 'slide') {
      filterComplex = `[1:v]fade=in:st=${options.overlayStartTime}:d=0.5:alpha=1[overlay]; [0:v][overlay]overlay='if(between(t,${options.overlayStartTime},${options.overlayStartTime + options.overlayDuration - 1}),0,if(between(t,${options.overlayStartTime + options.overlayDuration - 1},${options.overlayStartTime + options.overlayDuration}),-W*(t-${options.overlayStartTime + options.overlayDuration - 1}),-W))':0:enable='between(t,${options.overlayStartTime},${options.overlayStartTime + options.overlayDuration})'`;
    } else {
      filterComplex = `[0:v][1:v]overlay=0:0:enable='between(t,${options.overlayStartTime},${options.overlayStartTime + options.overlayDuration})'`;
    }
    
    await this.ffmpeg.exec([
      '-i', 'background.mp4',
      '-i', 'overlay.png',
      '-filter_complex', filterComplex,
      '-t', options.totalDuration.toString(),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      'output.mp4'
    ]);
    
    const data = await this.ffmpeg.readFile('output.mp4');
    return data as Uint8Array;
  }

  async exportVideo(
    elementId: string,
    options: {
      totalDuration: number;
      overlayStartTime: number;
      overlayDuration: number;
      exitAnimation: 'none' | 'fade' | 'slide';
    }
  ): Promise<void> {
    try {
      // Download background video
      const backgroundVideo = await this.downloadYouTubeVideo('xKRNDalWE-E', options.totalDuration);
      
      // Capture Reddit overlay
      const overlayImage = await this.captureRedditOverlay(elementId);
      
      // Create final video
      const finalVideo = await this.createVideoWithOverlay(backgroundVideo, overlayImage, options);
      
      // Download the result
      const blob = new Blob([finalVideo], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reddit-story.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting video:', error);
      throw error;
    }
  }
}

export const videoExporter = new VideoExporter();
