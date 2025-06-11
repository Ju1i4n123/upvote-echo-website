import html2canvas from 'html2canvas';

class VideoExporter {
  private videoCache: Map<string, HTMLVideoElement> = new Map();

  // Direct video URLs (you would need to host these or find publicly accessible ones)
  private videoSources = {
    'minecraft': '/videos/minecraft-background.mp4', // You'd need to add this to your public folder
    'subway-surfers': '/videos/subway-surfers-background.mp4', // You'd need to add this to your public folder
    // Alternative: Use public CDN URLs if available
    // 'minecraft': 'https://example-cdn.com/minecraft-gameplay.mp4',
  };

  private async loadVideo(videoType: 'minecraft' | 'subway-surfers'): Promise<HTMLVideoElement> {
    if (this.videoCache.has(videoType)) {
      return this.videoCache.get(videoType)!;
    }

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous'; // Important for canvas access
    video.muted = true;
    video.loop = true;
    
    return new Promise((resolve, reject) => {
      video.onloadeddata = () => {
        this.videoCache.set(videoType, video);
        resolve(video);
      };
      
      video.onerror = () => {
        console.error(`Failed to load video: ${videoType}`);
        reject(new Error(`Failed to load video: ${videoType}`));
      };
      
      // Try to load from video source
      if (this.videoSources[videoType]) {
        video.src = this.videoSources[videoType];
      } else {
        reject(new Error(`No video source for: ${videoType}`));
      }
    });
  }

  private async createAnimatedBackground(
    ctx: CanvasRenderingContext2D,
    videoType: 'minecraft' | 'subway-surfers',
    frame: number,
    width: number,
    height: number
  ) {
    // Create animated backgrounds as fallback
    if (videoType === 'minecraft') {
      // Minecraft-style background
      const blockSize = 40;
      const time = frame / 30;
      
      // Sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#98D8E8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Animated grass blocks
      ctx.fillStyle = '#7CFC00';
      for (let x = 0; x < width; x += blockSize) {
        const yOffset = Math.sin((x + time * 50) / 100) * 20;
        ctx.fillRect(x, height - 200 + yOffset, blockSize - 2, blockSize - 2);
      }
      
      // Dirt blocks
      ctx.fillStyle = '#8B4513';
      for (let y = height - 160; y < height; y += blockSize) {
        for (let x = 0; x < width; x += blockSize) {
          ctx.fillRect(x, y, blockSize - 2, blockSize - 2);
        }
      }
      
      // Moving clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 3; i++) {
        const cloudX = ((time * 20 + i * 200) % (width + 100)) - 50;
        const cloudY = 50 + i * 60;
        // Simple cloud shape
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 30, 0, Math.PI * 2);
        ctx.arc(cloudX + 25, cloudY, 35, 0, Math.PI * 2);
        ctx.arc(cloudX + 50, cloudY, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      
    } else if (videoType === 'subway-surfers') {
      // Subway Surfers-style background
      const time = frame / 30;
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#FF6B6B');
      gradient.addColorStop(0.5, '#4ECDC4');
      gradient.addColorStop(1, '#45B7D1');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Moving subway tracks
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 4;
      
      // Three lanes
      const laneWidth = width / 3;
      for (let lane = 0; lane < 3; lane++) {
        const x = laneWidth * lane + laneWidth / 2;
        
        // Track lines
        ctx.beginPath();
        ctx.moveTo(x - 20, 0);
        ctx.lineTo(x - 10, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + 20, 0);
        ctx.lineTo(x + 10, height);
        ctx.stroke();
        
        // Moving dashes
        ctx.setLineDash([20, 30]);
        ctx.beginPath();
        ctx.moveTo(x, -time * 100 % 50);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Animated obstacles
      const obstacleY = ((time * 200) % (height + 100)) - 50;
      ctx.fillStyle = '#FFD93D';
      ctx.fillRect(width / 2 - 30, obstacleY, 60, 80);
      
      // Score effect
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SCORE: ' + Math.floor(time * 1000), width / 2, 40);
    }
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
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 960;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    
    const fps = 30;
    const totalFrames = options.totalDuration * fps;
    
    // Try to load actual video
    let backgroundVideo: HTMLVideoElement | null = null;
    let useAnimatedBackground = false;
    
    try {
      backgroundVideo = await this.loadVideo(options.backgroundVideo);
      backgroundVideo.currentTime = 0;
      await backgroundVideo.play();
    } catch (error) {
      console.log('Using animated background as fallback');
      useAnimatedBackground = true;
    }

    // Capture Reddit overlay
    let overlayCanvas: HTMLCanvasElement | null = null;
    if (options.showRedditOverlay) {
      const redditOverlay = element.querySelector('.absolute.inset-0.flex.items-center.justify-center > div') as HTMLElement;
      if (redditOverlay) {
        // Make sure overlay is visible for capture
        const originalDisplay = redditOverlay.style.display;
        const originalOpacity = redditOverlay.style.opacity;
        redditOverlay.style.display = 'block';
        redditOverlay.style.opacity = '1';
        
        overlayCanvas = await html2canvas(redditOverlay, {
          width: 540,
          height: 960,
          backgroundColor: null,
          scale: 1,
        });
        
        // Restore original state
        redditOverlay.style.display = originalDisplay;
        redditOverlay.style.opacity = originalOpacity;
      }
    }

    // Create video using MediaRecorder
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000 // 5 Mbps for better quality
    });

    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.start();

    // Render frames
    let frameCount = 0;
    const renderFrame = async () => {
      if (frameCount >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      const currentTime = frameCount / fps;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      if (backgroundVideo && !useAnimatedBackground) {
        // Set video time for smooth playback
        backgroundVideo.currentTime = currentTime % backgroundVideo.duration;
        
        // Draw video frame
        ctx.drawImage(backgroundVideo, 0, 0, canvas.width, canvas.height);
      } else {
        // Use animated background
        await this.createAnimatedBackground(ctx, options.backgroundVideo, frameCount, canvas.width, canvas.height);
      }
      
      // Draw Reddit overlay if needed
      if (overlayCanvas && options.showRedditOverlay) {
        const overlayVisible = currentTime >= options.overlayStartTime && 
          (!options.disappearAfterTime || currentTime <= options.overlayStartTime + options.overlayDuration);
        
        if (overlayVisible) {
          ctx.save();
          
          let alpha = 1;
          let transform = '';
          
          // Calculate animation progress
          const fadeInDuration = 0.5;
          const fadeOutDuration = 1;
          
          if (currentTime < options.overlayStartTime + fadeInDuration) {
            // Fade in
            const progress = (currentTime - options.overlayStartTime) / fadeInDuration;
            alpha = progress;
            transform = `scale(${0.8 + 0.2 * progress})`;
          } else if (options.disappearAfterTime && options.exitAnimation !== 'none') {
            const timeUntilEnd = (options.overlayStartTime + options.overlayDuration) - currentTime;
            
            if (timeUntilEnd < fadeOutDuration) {
              const progress = 1 - (timeUntilEnd / fadeOutDuration);
              
              if (options.exitAnimation === 'fade') {
                alpha = 1 - progress;
              } else if (options.exitAnimation === 'slide') {
                ctx.translate(-canvas.width * progress, 0);
              }
            }
          }
          
          ctx.globalAlpha = alpha;
          
          // Apply transform
          if (transform) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            if (transform.includes('scale')) {
              const scaleMatch = transform.match(/scale\(([\d.]+)\)/);
              if (scaleMatch) {
                const scale = parseFloat(scaleMatch[1]);
                ctx.scale(scale, scale);
              }
            }
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          }
          
          ctx.drawImage(overlayCanvas, 0, 0);
          ctx.restore();
        }
      }
      
      frameCount++;
      
      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(renderFrame);
    };

    // Start rendering
    renderFrame();

    // Wait for recording to complete
    await new Promise<void>((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        
        // Download the video
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reddit-story-${options.backgroundVideo}-${new Date().getTime()}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Cleanup
        if (backgroundVideo) {
          backgroundVideo.pause();
        }
        
        resolve();
      };
    });
  }
}

export const videoExporter = new VideoExporter();