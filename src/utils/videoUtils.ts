import html2canvas from 'html2canvas';

class VideoExporter {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  async captureScreenRecording(
    elementId: string,
    duration: number,
    options: {
      overlayStartTime: number;
      overlayDuration: number;
      exitAnimation: 'none' | 'fade' | 'slide';
      showRedditOverlay: boolean;
      disappearAfterTime: boolean;
    }
  ): Promise<Blob> {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    try {
      // Try to use screen capture API
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1920,
          height: 1080,
          frameRate: 30,
        },
        audio: false
      });

      return new Promise((resolve, reject) => {
        this.recordedChunks = [];
        
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp8,opus'
        });

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          stream.getTracks().forEach(track => track.stop());
          resolve(blob);
        };

        this.mediaRecorder.onerror = (error) => {
          stream.getTracks().forEach(track => track.stop());
          reject(error);
        };

        // Handle overlay visibility
        const redditOverlay = element.querySelector('.absolute.inset-0.flex.items-center.justify-center > div') as HTMLElement;
        
        if (redditOverlay && options.showRedditOverlay) {
          // Initially hide the overlay
          redditOverlay.style.opacity = '0';
          redditOverlay.style.transform = 'scale(0.9)';
          redditOverlay.style.transition = 'all 0.5s ease-in-out';

          // Show overlay at the specified time
          setTimeout(() => {
            redditOverlay.style.opacity = '1';
            redditOverlay.style.transform = 'scale(1)';
            
            if (options.disappearAfterTime) {
              // Hide overlay after duration
              setTimeout(() => {
                if (options.exitAnimation === 'fade') {
                  redditOverlay.style.transition = 'opacity 1s ease-out';
                  redditOverlay.style.opacity = '0';
                } else if (options.exitAnimation === 'slide') {
                  redditOverlay.style.transition = 'transform 1s ease-out';
                  redditOverlay.style.transform = 'translateX(-100%)';
                } else {
                  redditOverlay.style.display = 'none';
                }
              }, options.overlayDuration * 1000);
            }
          }, options.overlayStartTime * 1000);
        } else if (!options.showRedditOverlay && redditOverlay) {
          redditOverlay.style.display = 'none';
        }

        // Start recording
        this.mediaRecorder.start();

        // Stop after duration
        setTimeout(() => {
          if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
          }
        }, duration * 1000);
      });
    } catch (error) {
      console.error('Screen capture failed:', error);
      throw new Error('Screen recording failed. Please ensure you allow screen sharing when prompted.');
    }
  }

  async captureWithCanvas(
    elementId: string,
    videoType: 'minecraft' | 'subway-surfers',
    duration: number,
    options: {
      overlayStartTime: number;
      overlayDuration: number;
      exitAnimation: 'none' | 'fade' | 'slide';
      showRedditOverlay: boolean;
      disappearAfterTime: boolean;
    }
  ): Promise<Blob> {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 960;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    
    const frames: string[] = [];
    const fps = 30;
    const totalFrames = duration * fps;

    // Capture the Reddit overlay if needed
    let overlayCanvas: HTMLCanvasElement | null = null;
    if (options.showRedditOverlay) {
      const redditOverlay = element.querySelector('.absolute.inset-0.flex.items-center.justify-center > div') as HTMLElement;
      if (redditOverlay) {
        overlayCanvas = await html2canvas(redditOverlay, {
          width: 540,
          height: 960,
          backgroundColor: null,
          scale: 1,
        });
      }
    }

    // Create frames
    for (let i = 0; i < totalFrames; i++) {
      const time = i / fps;
      
      // Clear canvas
      ctx.clearRect(0, 0, 540, 960);

      // Try to capture the actual iframe content
      const iframe = element.querySelector('iframe') as HTMLIFrameElement;
      if (iframe) {
        // Create a message to indicate we're simulating the video
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 540, 960);
        
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${videoType === 'minecraft' ? 'Minecraft' : 'Subway Surfers'} Background`, 270, 480);
        ctx.font = '16px Arial';
        ctx.fillText('(Actual video cannot be captured due to browser restrictions)', 270, 520);
        ctx.fillText('Use screen recording for best results', 270, 550);
      }

      // Add overlay if needed
      if (overlayCanvas && options.showRedditOverlay) {
        const overlayVisible = time >= options.overlayStartTime && 
          (!options.disappearAfterTime || time <= options.overlayStartTime + options.overlayDuration);
        
        if (overlayVisible) {
          let alpha = 1;
          
          // Handle fade animations
          if (time < options.overlayStartTime + 0.5) {
            // Fade in
            alpha = (time - options.overlayStartTime) / 0.5;
          } else if (options.disappearAfterTime && options.exitAnimation === 'fade' && 
                     time > options.overlayStartTime + options.overlayDuration - 1) {
            // Fade out
            alpha = 1 - (time - (options.overlayStartTime + options.overlayDuration - 1));
          }
          
          ctx.globalAlpha = alpha;
          
          // Handle slide animation
          let xOffset = 0;
          if (options.disappearAfterTime && options.exitAnimation === 'slide' && 
              time > options.overlayStartTime + options.overlayDuration - 1) {
            const slideProgress = time - (options.overlayStartTime + options.overlayDuration - 1);
            xOffset = -540 * slideProgress;
          }
          
          ctx.drawImage(overlayCanvas, xOffset, 0);
          ctx.globalAlpha = 1;
        }
      }

      frames.push(canvas.toDataURL('image/jpeg', 0.9));
    }

    // Convert frames to video blob
    return this.framesToVideo(frames, fps);
  }

  private async framesToVideo(frames: string[], fps: number): Promise<Blob> {
    // Create a canvas for the video
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 960;
    const ctx = canvas.getContext('2d')!;

    // Create a MediaRecorder for the canvas
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8',
      videoBitsPerSecond: 2500000
    });

    const chunks: Blob[] = [];
    
    return new Promise((resolve, reject) => {
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };

      mediaRecorder.onerror = reject;

      mediaRecorder.start();

      // Play frames
      let frameIndex = 0;
      const playFrame = () => {
        if (frameIndex < frames.length) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            frameIndex++;
            setTimeout(playFrame, 1000 / fps);
          };
          img.src = frames[frameIndex];
        } else {
          mediaRecorder.stop();
        }
      };

      playFrame();
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
    try {
      console.log('Starting video export...');
      
      let videoBlob: Blob;
      
      // First, try screen recording
      try {
        // Show a notification to the user
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #333;
          color: white;
          padding: 20px;
          border-radius: 8px;
          z-index: 10000;
          text-align: center;
          font-family: Arial, sans-serif;
        `;
        notification.innerHTML = `
          <h3 style="margin: 0 0 10px 0;">Screen Recording Required</h3>
          <p style="margin: 0 0 15px 0;">To capture the Vimeo video, please select the browser tab showing this page when prompted.</p>
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">The recording will start automatically after you share your screen.</p>
        `;
        document.body.appendChild(notification);

        // Wait a moment for user to read
        await new Promise(resolve => setTimeout(resolve, 2000));
        notification.remove();

        videoBlob = await this.captureScreenRecording(elementId, options.totalDuration, options);
        console.log('Screen recording captured successfully');
      } catch (screenError) {
        console.error('Screen recording failed, falling back to canvas capture:', screenError);
        
        // Show fallback notification
        const fallbackNotification = document.createElement('div');
        fallbackNotification.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #ff6b6b;
          color: white;
          padding: 20px;
          border-radius: 8px;
          z-index: 10000;
          text-align: center;
          font-family: Arial, sans-serif;
        `;
        fallbackNotification.innerHTML = `
          <h3 style="margin: 0 0 10px 0;">Screen Recording Failed</h3>
          <p style="margin: 0;">Due to browser restrictions, the actual Vimeo video cannot be captured.</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Creating a preview video with placeholder background...</p>
        `;
        document.body.appendChild(fallbackNotification);
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        fallbackNotification.remove();

        videoBlob = await this.captureWithCanvas(elementId, options.backgroundVideo, options.totalDuration, options);
      }

      // Download the video
      const url = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reddit-story-${options.backgroundVideo}-${new Date().getTime()}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Video exported successfully');
    } catch (error) {
      console.error('Error exporting video:', error);
      
      // Show error notification
      const errorNotification = document.createElement('div');
      errorNotification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff4444;
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 10000;
        text-align: center;
        font-family: Arial, sans-serif;
      `;
      errorNotification.innerHTML = `
        <h3 style="margin: 0 0 10px 0;">Export Failed</h3>
        <p style="margin: 0;">${error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        <button onclick="this.parentElement.remove()" style="
          margin-top: 15px;
          padding: 8px 16px;
          background: white;
          color: #ff4444;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        ">Close</button>
      `;
      document.body.appendChild(errorNotification);
      
      throw error;
    }
  }
}

export const videoExporter = new VideoExporter();
