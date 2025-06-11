import html2canvas from 'html2canvas';

class VideoExporter {
  private async loadVideoFile(videoType: 'minecraft' | 'subway-surfers'): Promise<HTMLVideoElement> {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    
    // Use local video files from public folder
    const videoMap = {
      'minecraft': '/videos/minecraft-background.mp4',
      'subway-surfers': '/videos/subway-surfers-background.mp4'
    };
    
    return new Promise((resolve, reject) => {
      video.onloadeddata = () => resolve(video);
      video.onerror = () => reject(new Error(`Failed to load video: ${videoType}`));
      video.src = videoMap[videoType];
      video.load();
    });
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

    try {
      // Load the background video
      const backgroundVideo = await this.loadVideoFile(options.backgroundVideo);
      
      // Create canvas for compositing
      const canvas = document.createElement('canvas');
      canvas.width = 540;
      canvas.height = 960;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      
      // Capture Reddit overlay
      let overlayCanvas: HTMLCanvasElement | null = null;
      if (options.showRedditOverlay) {
        const redditOverlay = element.querySelector('.absolute.inset-0.flex.items-center.justify-center > div') as HTMLElement;
        if (redditOverlay) {
          // Temporarily make visible for capture
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
      
      // Set up MediaRecorder
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000 // Higher bitrate for better quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      // Start recording
      mediaRecorder.start();

      // Show progress
      const progressDiv = document.createElement('div');
      progressDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #3B82F6;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 999999;
        font-family: system-ui, -apple-system, sans-serif;
      `;
      progressDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">Exporting video...</div>
        <div style="font-size: 14px;">Processing: <span id="export-progress">0</span>%</div>
      `;
      document.body.appendChild(progressDiv);

      const fps = 30;
      const totalFrames = options.totalDuration * fps;
      let frameCount = 0;

      // Process video frame by frame
      const processFrame = () => {
        return new Promise<void>((resolve) => {
          if (frameCount >= totalFrames) {
            mediaRecorder.stop();
            document.body.removeChild(progressDiv);
            resolve();
            return;
          }

          const currentTime = frameCount / fps;
          
          // Update progress
          const progress = Math.round((frameCount / totalFrames) * 100);
          const progressElement = document.getElementById('export-progress');
          if (progressElement) {
            progressElement.textContent = progress.toString();
          }

          // Set video time
          backgroundVideo.currentTime = currentTime % backgroundVideo.duration;

          // Wait for video frame to be ready
          requestAnimationFrame(() => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background video frame
            ctx.drawImage(backgroundVideo, 0, 0, canvas.width, canvas.height);
            
            // Draw Reddit overlay if needed
            if (overlayCanvas && options.showRedditOverlay) {
              const overlayVisible = currentTime >= options.overlayStartTime && 
                (!options.disappearAfterTime || currentTime <= options.overlayStartTime + options.overlayDuration);
              
              if (overlayVisible) {
                ctx.save();
                
                let alpha = 1;
                let translateX = 0;
                let scale = 1;
                
                // Calculate animation progress
                const fadeInDuration = 0.5;
                const fadeOutDuration = 1;
                
                if (currentTime < options.overlayStartTime + fadeInDuration) {
                  // Fade in animation
                  const progress = (currentTime - options.overlayStartTime) / fadeInDuration;
                  alpha = progress;
                  scale = 0.8 + 0.2 * progress;
                } else if (options.disappearAfterTime && options.exitAnimation !== 'none') {
                  const timeUntilEnd = (options.overlayStartTime + options.overlayDuration) - currentTime;
                  
                  if (timeUntilEnd < fadeOutDuration) {
                    const progress = 1 - (timeUntilEnd / fadeOutDuration);
                    
                    if (options.exitAnimation === 'fade') {
                      alpha = 1 - progress;
                    } else if (options.exitAnimation === 'slide') {
                      translateX = -canvas.width * progress;
                    }
                  }
                }
                
                // Apply transformations
                ctx.globalAlpha = alpha;
                ctx.translate(canvas.width / 2 + translateX, canvas.height / 2);
                ctx.scale(scale, scale);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
                
                // Draw overlay
                ctx.drawImage(overlayCanvas, 0, 0);
                ctx.restore();
              }
            }
            
            frameCount++;
            
            // Process next frame
            setTimeout(() => {
              processFrame().then(resolve);
            }, 1000 / fps); // Maintain frame rate
          });
        });
      };

      // Start processing
      await processFrame();

      // Wait for recording to complete and download
      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `reddit-story-${options.backgroundVideo}-${Date.now()}.webm`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Cleanup
          URL.revokeObjectURL(url);
          resolve();
        };
      });

    } catch (error) {
      // Remove progress if there's an error
      const progressDiv = document.querySelector('[style*="Exporting video"]');
      if (progressDiv) {
        document.body.removeChild(progressDiv);
      }
      
      if (error instanceof Error) {
        throw new Error(`Export failed: ${error.message}`);
      }
      throw error;
    }
  }
}

export const videoExporter = new VideoExporter();