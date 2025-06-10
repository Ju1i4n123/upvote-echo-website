
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
    // Use a public API to get YouTube video URL
    try {
      const response = await fetch(`https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all`);
      
      // For now, we'll create a more realistic background video
      // In production, you'd integrate with a YouTube downloader API
      const canvas = document.createElement('canvas');
      canvas.width = 540;
      canvas.height = 960;
      const ctx = canvas.getContext('2d')!;
      
      // Create a more video-like background with moving elements
      const frames: string[] = [];
      const fps = 30;
      const totalFrames = duration * fps;
      
      for (let i = 0; i < totalFrames; i++) {
        const time = i / fps;
        
        // Create a gradient that moves and changes
        const gradient = ctx.createLinearGradient(
          0, 
          Math.sin(time * 0.5) * 200 + 480, 
          540, 
          Math.cos(time * 0.3) * 200 + 480
        );
        
        // Dynamic colors based on time
        const hue1 = (time * 30) % 360;
        const hue2 = (time * 30 + 180) % 360;
        gradient.addColorStop(0, `hsl(${hue1}, 70%, 50%)`);
        gradient.addColorStop(0.5, `hsl(${(hue1 + 60) % 360}, 60%, 40%)`);
        gradient.addColorStop(1, `hsl(${hue2}, 70%, 60%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 540, 960);
        
        // Add floating particles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let j = 0; j < 8; j++) {
          const x = 270 + Math.sin(time * 0.8 + j * 0.8) * 200;
          const y = 480 + Math.cos(time * 0.6 + j * 1.2) * 300;
          const size = 20 + Math.sin(time * 2 + j) * 15;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add some geometric shapes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.save();
        ctx.translate(270, 480);
        ctx.rotate(time * 0.5);
        ctx.fillRect(-50, -50, 100, 100);
        ctx.restore();
        
        frames.push(canvas.toDataURL('image/png'));
      }
      
      // Convert frames to video using FFmpeg
      await this.load();
      
      // Clear any existing files
      try {
        const files = await this.ffmpeg.listDir('/');
        for (const file of files) {
          if (file.name.endsWith('.png') || file.name.endsWith('.mp4')) {
            await this.ffmpeg.deleteFile(file.name);
          }
        }
      } catch (e) {
        // Files might not exist, continue
      }
      
      // Write frames
      for (let i = 0; i < frames.length; i++) {
        const response = await fetch(frames[i]);
        const blob = await response.blob();
        await this.ffmpeg.writeFile(`frame${i.toString().padStart(6, '0')}.png`, await fetchFile(blob));
      }
      
      await this.ffmpeg.exec([
        '-framerate', fps.toString(),
        '-i', 'frame%06d.png',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-t', duration.toString(),
        '-y',
        'background.mp4'
      ]);
      
      const data = await this.ffmpeg.readFile('background.mp4');
      return data as Uint8Array;
    } catch (error) {
      console.error('Error creating background video:', error);
      throw error;
    }
  }

  async captureRedditOverlay(elementId: string): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');
    
    // Use html2canvas to capture the Reddit overlay
    const html2canvas = (await import('html2canvas')).default;
    
    // Find the Reddit overlay specifically
    const redditOverlay = element.querySelector('.absolute.inset-0.flex.items-center.justify-center > div') as HTMLElement;
    if (!redditOverlay) throw new Error('Reddit overlay not found');
    
    const canvas = await html2canvas(redditOverlay, {
      width: 540,
      height: 960,
      backgroundColor: null,
      scale: 1,
      useCORS: true,
      allowTaint: true,
    });
    
    return canvas.toDataURL('image/png');
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
    const overlayEnd = options.overlayStartTime + options.overlayDuration;
    
    if (options.exitAnimation === 'fade') {
      const fadeStart = overlayEnd - 1;
      filterComplex = `[1:v]fade=in:st=${options.overlayStartTime}:d=0.5:alpha=1,fade=out:st=${fadeStart}:d=1:alpha=1[overlay]; [0:v][overlay]overlay=(W-w)/2:(H-h)/2:enable='between(t,${options.overlayStartTime},${overlayEnd})'`;
    } else if (options.exitAnimation === 'slide') {
      const slideStart = overlayEnd - 1;
      filterComplex = `[1:v]fade=in:st=${options.overlayStartTime}:d=0.5:alpha=1[overlay]; [0:v][overlay]overlay='if(between(t,${options.overlayStartTime},${slideStart}),(W-w)/2,if(between(t,${slideStart},${overlayEnd}),(W-w)/2-W*(t-${slideStart}),-W))':(H-h)/2:enable='between(t,${options.overlayStartTime},${overlayEnd})'`;
    } else {
      filterComplex = `[0:v][1:v]overlay=(W-w)/2:(H-h)/2:enable='between(t,${options.overlayStartTime},${overlayEnd})'`;
    }
    
    await this.ffmpeg.exec([
      '-i', 'background.mp4',
      '-i', 'overlay.png',
      '-filter_complex', filterComplex,
      '-t', options.totalDuration.toString(),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-y',
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
      console.log('Starting video export...');
      
      // Create background video
      const backgroundVideo = await this.downloadYouTubeVideo('default', options.totalDuration);
      console.log('Background video created');
      
      // Capture Reddit overlay
      const overlayImage = await this.captureRedditOverlay(elementId);
      console.log('Reddit overlay captured');
      
      // Create final video
      const finalVideo = await this.createVideoWithOverlay(backgroundVideo, overlayImage, options);
      console.log('Final video created');
      
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
      
      console.log('Video exported successfully');
    } catch (error) {
      console.error('Error exporting video:', error);
      throw error;
    }
  }
}

export const videoExporter = new VideoExporter();
