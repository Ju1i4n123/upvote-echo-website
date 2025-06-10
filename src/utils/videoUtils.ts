
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
    
    try {
      // Use the official jsdelivr CDN which is more reliable
      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd';
      
      this.ffmpeg.on('log', ({ message }) => {
        console.log('FFmpeg:', message);
      });
      
      this.ffmpeg.on('progress', ({ progress }) => {
        console.log('FFmpeg progress:', Math.round(progress * 100) + '%');
      });
      
      console.log('Loading FFmpeg core...');
      
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });
      
      this.loaded = true;
      console.log('FFmpeg loaded successfully');
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      // Try alternative CDN
      try {
        console.log('Trying alternative CDN...');
        const altBaseURL = 'https://unpkg.com/@ffmpeg/core-st@0.12.6/dist/umd';
        
        await this.ffmpeg.load({
          coreURL: await toBlobURL(`${altBaseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${altBaseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        
        this.loaded = true;
        console.log('FFmpeg loaded from alternative CDN');
      } catch (altError) {
        console.error('Failed to load FFmpeg from alternative CDN:', altError);
        throw new Error('Could not load FFmpeg. Please check your internet connection and try again.');
      }
    }
  }

  private getVimeoVideoUrl(videoType: 'minecraft' | 'subway-surfers'): string {
    const videoUrls = {
      minecraft: 'https://vimeo.com/1092266536/7a17cf4cf9',
      'subway-surfers': 'https://vimeo.com/1092266136/db7b597083'
    };
    return videoUrls[videoType];
  }

  private async downloadVimeoVideo(videoType: 'minecraft' | 'subway-surfers'): Promise<string> {
    // Extract video ID from Vimeo URL
    const vimeoUrl = this.getVimeoVideoUrl(videoType);
    const videoId = vimeoUrl.split('/')[3];
    
    try {
      // Get Vimeo video info
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoUrl)}`);
      const videoInfo = await response.json();
      
      // For now, we'll use a proxy approach or create a placeholder
      // In a real implementation, you'd need a backend service to handle Vimeo downloads
      // due to CORS restrictions
      
      console.log('Vimeo video info:', videoInfo);
      
      // Return the direct Vimeo player URL for now
      return `https://player.vimeo.com/video/${videoId}`;
    } catch (error) {
      console.error('Error getting Vimeo video:', error);
      throw error;
    }
  }

  async createBackgroundVideo(videoType: 'minecraft' | 'subway-surfers', duration: number): Promise<Uint8Array> {
    try {
      console.log(`Creating background video: ${videoType} for ${duration} seconds`);
      
      await this.load();
      
      const canvas = document.createElement('canvas');
      canvas.width = 540;
      canvas.height = 960;
      const ctx = canvas.getContext('2d')!;
      
      const frames: string[] = [];
      const fps = 30;
      const totalFrames = duration * fps;
      
      // Theme colors based on video type
      const themes = {
        minecraft: {
          colors: ['#8B4513', '#228B22', '#4169E1', '#32CD32'],
          name: 'Minecraft'
        },
        'subway-surfers': {
          colors: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5'],
          name: 'Subway Surfers'
        }
      };
      
      const theme = themes[videoType];
      
      for (let i = 0; i < totalFrames; i++) {
        const time = i / fps;
        
        // Create themed gradient
        const gradient = ctx.createLinearGradient(
          0, 
          Math.sin(time * 0.5) * 200 + 480, 
          540, 
          Math.cos(time * 0.3) * 200 + 480
        );
        
        const colorIndex = Math.floor(time * 2) % theme.colors.length;
        const nextColorIndex = (colorIndex + 1) % theme.colors.length;
        
        gradient.addColorStop(0, theme.colors[colorIndex]);
        gradient.addColorStop(0.5, theme.colors[nextColorIndex]);
        gradient.addColorStop(1, theme.colors[(colorIndex + 2) % theme.colors.length]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 540, 960);
        
        // Add themed elements
        if (videoType === 'minecraft') {
          // Add block-like shapes
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          for (let j = 0; j < 6; j++) {
            const x = (j % 3) * 180 + Math.sin(time + j) * 50;
            const y = Math.floor(j / 3) * 400 + 200 + Math.cos(time * 0.5 + j) * 100;
            const size = 60 + Math.sin(time * 2 + j) * 20;
            ctx.fillRect(x - size/2, y - size/2, size, size);
          }
        } else {
          // Add rail-like lines and moving elements for subway surfers
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 8;
          for (let j = 0; j < 3; j++) {
            const x = 135 + j * 135;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 960);
            ctx.stroke();
          }
          
          // Add moving circles
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          for (let j = 0; j < 5; j++) {
            const x = 270 + Math.sin(time * 3 + j * 1.2) * 200;
            const y = ((time * 200 + j * 200) % 1200) - 120;
            const size = 30 + Math.sin(time * 4 + j) * 10;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        frames.push(canvas.toDataURL('image/png'));
      }
      
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
        console.log('No existing files to clean up');
      }
      
      console.log(`Writing ${frames.length} frames...`);
      
      // Write frames
      for (let i = 0; i < frames.length; i++) {
        const response = await fetch(frames[i]);
        const blob = await response.blob();
        await this.ffmpeg.writeFile(`frame${i.toString().padStart(6, '0')}.png`, await fetchFile(blob));
        
        if (i % 30 === 0) {
          console.log(`Written frame ${i}/${frames.length}`);
        }
      }
      
      console.log('Creating video from frames...');
      
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
      console.log('Background video created successfully');
      return data as Uint8Array;
    } catch (error) {
      console.error('Error creating background video:', error);
      throw error;
    }
  }

  async captureRedditOverlay(elementId: string): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');
    
    const html2canvas = (await import('html2canvas')).default;
    
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
      showRedditOverlay: boolean;
      disappearAfterTime: boolean;
    }
  ): Promise<Uint8Array> {
    await this.load();
    
    await this.ffmpeg.writeFile('background.mp4', backgroundVideo);
    
    // If no Reddit overlay is needed, just return the background video
    if (!options.showRedditOverlay) {
      return backgroundVideo;
    }
    
    const overlayResponse = await fetch(overlayImage);
    const overlayBlob = await overlayResponse.blob();
    await this.ffmpeg.writeFile('overlay.png', await fetchFile(overlayBlob));
    
    let filterComplex = '';
    const overlayEnd = options.overlayStartTime + options.overlayDuration;
    
    if (options.disappearAfterTime) {
      if (options.exitAnimation === 'fade') {
        const fadeStart = overlayEnd - 1;
        filterComplex = `[1:v]fade=in:st=${options.overlayStartTime}:d=0.5:alpha=1,fade=out:st=${fadeStart}:d=1:alpha=1[overlay]; [0:v][overlay]overlay=(W-w)/2:(H-h)/2:enable='between(t,${options.overlayStartTime},${overlayEnd})'`;
      } else if (options.exitAnimation === 'slide') {
        const slideStart = overlayEnd - 1;
        filterComplex = `[1:v]fade=in:st=${options.overlayStartTime}:d=0.5:alpha=1[overlay]; [0:v][overlay]overlay='if(between(t,${options.overlayStartTime},${slideStart}),(W-w)/2,if(between(t,${slideStart},${overlayEnd}),(W-w)/2-W*(t-${slideStart}),-W))':(H-h)/2:enable='between(t,${options.overlayStartTime},${overlayEnd})'`;
      } else {
        filterComplex = `[0:v][1:v]overlay=(W-w)/2:(H-h)/2:enable='between(t,${options.overlayStartTime},${overlayEnd})'`;
      }
    } else {
      // Show overlay for the entire duration after start time
      filterComplex = `[1:v]fade=in:st=${options.overlayStartTime}:d=0.5:alpha=1[overlay]; [0:v][overlay]overlay=(W-w)/2:(H-h)/2:enable='gte(t,${options.overlayStartTime})'`;
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
      backgroundVideo: 'minecraft' | 'subway-surfers';
      showRedditOverlay: boolean;
      disappearAfterTime: boolean;
    }
  ): Promise<void> {
    try {
      console.log('Starting video export...');
      
      const backgroundVideo = await this.createBackgroundVideo(options.backgroundVideo, options.totalDuration);
      console.log('Background video created');
      
      let finalVideo: Uint8Array;
      
      if (options.showRedditOverlay) {
        const overlayImage = await this.captureRedditOverlay(elementId);
        console.log('Reddit overlay captured');
        
        finalVideo = await this.createVideoWithOverlay(backgroundVideo, overlayImage, options);
        console.log('Final video created with overlay');
      } else {
        finalVideo = backgroundVideo;
        console.log('Using background video only');
      }
      
      const blob = new Blob([finalVideo], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reddit-story-${options.backgroundVideo}${options.showRedditOverlay ? '-with-overlay' : ''}.mp4`;
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
