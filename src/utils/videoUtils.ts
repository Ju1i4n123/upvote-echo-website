import html2canvas from 'html2canvas';

class VideoExporter {
  private async loadVideoFile(videoType: 'minecraft' | 'subway-surfers'): Promise<HTMLVideoElement> {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    
    const videoMap = {
      'minecraft': '/videos/minecraft-background.mp4',
      'subway-surfers': '/videos/subway-surfers-background.mp4'
    };
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Video loading timeout: ${videoType}. Make sure ${videoMap[videoType]} exists in your public folder.`));
      }, 10000);

      video.oncanplaythrough = () => {
        clearTimeout(timeoutId);
        video.currentTime = 0;
        resolve(video);
      };
      
      video.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load video: ${videoType}. Make sure ${videoMap[videoType]} exists in your public folder.`));
      };
      
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
    const previewElement = document.getElementById(elementId);
    if (!previewElement) throw new Error('Preview element not found');

    try {
      // Load the background video
      const backgroundVideo = await this.loadVideoFile(options.backgroundVideo);
      
      // Create recording canvas
      const canvas = document.createElement('canvas');
      canvas.width = 540;
      canvas.height = 960;
      const ctx = canvas.getContext('2d', { 
        alpha: false,
        desynchronized: false,
        willReadFrequently: false 
      })!;
      
      // Capture the Reddit overlay state
      let overlayData: { image: HTMLImageElement; position: { x: number; y: number; scale: number } } | null = null;
      
      if (options.showRedditOverlay) {
        const wrapper = previewElement.querySelector('.reddit-template-wrapper') as HTMLElement;
        const template = previewElement.querySelector('.reddit-template') as HTMLElement;
        
        if (wrapper && template) {
          // Get current position and scale
          const wrapperTransform = window.getComputedStyle(wrapper).transform;
          const templateTransform = window.getComputedStyle(template).transform;
          
          let translateX = 0, translateY = 0, scale = 1;
          
          if (wrapperTransform !== 'none') {
            const values = wrapperTransform.match(/matrix\(([^)]+)\)/)?.[1].split(', ');
            if (values) {
              translateX = parseFloat(values[4]);
              translateY = parseFloat(values[5]);
            }
          }
          
          if (templateTransform !== 'none') {
            const values = templateTransform.match(/matrix\(([^)]+)\)/)?.[1].split(', ');
            if (values) {
              scale = parseFloat(values[0]);
            }
          }
          
          // Create a clean capture of the overlay
          const captureContainer = document.createElement('div');
          captureContainer.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 540px;
            height: 960px;
            overflow: hidden;
          `;
          
          const overlayClone = template.cloneNode(true) as HTMLElement;
          overlayClone.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale});
          `;
          
          captureContainer.appendChild(overlayClone);
          document.body.appendChild(captureContainer);
          
          // Wait for styles to apply
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Capture to canvas
          const overlayCanvas = await html2canvas(captureContainer, {
            width: 540,
            height: 960,
            backgroundColor: null,
            scale: 1,
            logging: false
          });
          
          // Convert to image
          const img = new Image();
          img.src = overlayCanvas.toDataURL('image/png');
          await new Promise(resolve => img.onload = resolve);
          
          overlayData = {
            image: img,
            position: { x: translateX, y: translateY, scale }
          };
          
          document.body.removeChild(captureContainer);
        }
      }
      
      // Setup MediaRecorder
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 10000000
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      // Create progress UI
      const progressUI = document.createElement('div');
      progressUI.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        padding: 20px;
        z-index: 999999;
        min-width: 320px;
      `;
      progressUI.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; background: #3B82F6; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
            </svg>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 16px; color: #1F2937; margin-bottom: 4px;">Exporting Video</div>
            <div style="height: 8px; background: #E5E7EB; border-radius: 4px; overflow: hidden; margin-bottom: 4px;">
              <div id="progress-bar" style="height: 100%; background: #3B82F6; width: 0%; transition: width 0.3s;"></div>
            </div>
            <div style="font-size: 14px; color: #6B7280;">
              <span id="progress-text">0%</span> • <span id="time-estimate">Calculating...</span>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(progressUI);

      // Start recording
      mediaRecorder.start();

      const fps = 30;
      const totalFrames = options.totalDuration * fps;
      let frameIndex = 0;
      const startTime = performance.now();

      // Frame rendering function
      const renderFrame = async () => {
        if (frameIndex >= totalFrames) {
          mediaRecorder.stop();
          document.body.removeChild(progressUI);
          return;
        }

        const currentTime = frameIndex / fps;
        const progress = (frameIndex / totalFrames) * 100;
        
        // Update progress UI
        document.getElementById('progress-bar')!.style.width = `${progress}%`;
        document.getElementById('progress-text')!.textContent = `${Math.round(progress)}%`;
        
        // Estimate time remaining
        if (frameIndex > 10) {
          const elapsed = performance.now() - startTime;
          const avgTimePerFrame = elapsed / frameIndex;
          const remainingFrames = totalFrames - frameIndex;
          const remainingMs = remainingFrames * avgTimePerFrame;
          const remainingSeconds = Math.ceil(remainingMs / 1000);
          document.getElementById('time-estimate')!.textContent = `${remainingSeconds}s remaining`;
        }
        
        // Draw video frame
        backgroundVideo.currentTime = currentTime % backgroundVideo.duration;
        
        // Wait for video frame to be ready
        await new Promise(resolve => {
          if ('requestVideoFrameCallback' in backgroundVideo) {
            (backgroundVideo as any).requestVideoFrameCallback(resolve);
          } else {
            setTimeout(resolve, 16);
          }
        });
        
        // Draw to canvas
        ctx.drawImage(backgroundVideo, 0, 0, canvas.width, canvas.height);
        
        // Draw overlay if needed
        if (overlayData && options.showRedditOverlay) {
          const shouldShow = currentTime >= options.overlayStartTime && 
            (!options.disappearAfterTime || currentTime <= options.overlayStartTime + options.overlayDuration);
          
          if (shouldShow) {
            ctx.save();
            
            // Calculate animations
            let alpha = 1;
            let offsetX = 0;
            
            // Fade in animation
            if (currentTime < options.overlayStartTime + 0.3) {
              alpha = Math.min(1, (currentTime - options.overlayStartTime) / 0.3);
            }
            
            // Exit animations
            if (options.disappearAfterTime && options.exitAnimation !== 'none') {
              const exitStart = options.overlayStartTime + options.overlayDuration - 0.5;
              if (currentTime >= exitStart) {
                const exitProgress = Math.min(1, (currentTime - exitStart) / 0.5);
                
                if (options.exitAnimation === 'fade') {
                  alpha *= (1 - exitProgress);
                } else if (options.exitAnimation === 'slide') {
                  offsetX = -540 * exitProgress;
                }
              }
            }
            
            // Apply transformations and draw
            ctx.globalAlpha = alpha;
            ctx.translate(offsetX, 0);
            ctx.drawImage(overlayData.image, 0, 0);
            ctx.restore();
          }
        }
        
        frameIndex++;
        
        // Schedule next frame
        requestAnimationFrame(renderFrame);
      };

      // Start rendering
      requestAnimationFrame(renderFrame);

      // Wait for export to complete
      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reddit-story-${Date.now()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        };
      });

    } catch (error) {
      // Clean up on error
      const progressUI = document.querySelector('[style*="Exporting Video"]');
      if (progressUI) progressUI.remove();
      throw error;
    }
  }
}

export const videoExporter = new VideoExporter();