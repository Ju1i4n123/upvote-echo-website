
import html2canvas from 'html2canvas';

class VideoExporter {
  private async loadVideoFile(videoType: 'minecraft' | 'subway-surfers'): Promise<HTMLVideoElement> {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'metadata';
    
    const videoMap = {
      'minecraft': '/videos/minecraft-background.mp4',
      'subway-surfers': '/videos/subway-surfers-background.mp4'
    };
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        console.log('Video loading timeout for:', videoType);
        reject(new Error(`Video loading timeout: ${videoType}. Make sure ${videoMap[videoType]} exists in your public folder and is a valid video file.`));
      }, 10000);

      video.onloadeddata = () => {
        clearTimeout(timeoutId);
        console.log('Video loaded successfully:', videoType, 'Duration:', video.duration);
        resolve(video);
      };
      
      video.onerror = (e) => {
        clearTimeout(timeoutId);
        console.log('Video error for:', videoType, e);
        
        if (video.error) {
          console.log('Video error details:', video.error);
          
          if (video.error.code === 4) {
            reject(new Error(`Video format not supported or file is a Git LFS pointer: ${videoType}. The file might be stored in Git LFS. Please download the actual video file or use 'git lfs pull' to get the real video content.`));
          } else {
            reject(new Error(`Failed to load video: ${videoType}. Error code: ${video.error.code}. Make sure ${videoMap[videoType]} exists in your public folder and is a valid video file.`));
          }
        } else {
          reject(new Error(`Failed to load video: ${videoType}. Make sure ${videoMap[videoType]} exists in your public folder.`));
        }
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
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    try {
      // Get the current template position and scale from the preview
      const templateContainer = element.querySelector('.reddit-template') as HTMLElement;
      const previewContainer = element.querySelector('[style*="translate"]') as HTMLElement;
      
      let templatePosition = { x: 0, y: 0 };
      let templateScale = 1;
      
      if (previewContainer) {
        const transform = previewContainer.style.transform;
        const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (translateMatch) {
          templatePosition.x = parseFloat(translateMatch[1]);
          templatePosition.y = parseFloat(translateMatch[2]);
        }
      }
      
      if (templateContainer) {
        const transform = templateContainer.style.transform;
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        if (scaleMatch) {
          templateScale = parseFloat(scaleMatch[1]);
        }
      }

      console.log('Template position:', templatePosition, 'Scale:', templateScale);

      // Load the background video
      const backgroundVideo = await this.loadVideoFile(options.backgroundVideo);
      
      // Create canvas for compositing
      const canvas = document.createElement('canvas');
      canvas.width = 540;
      canvas.height = 960;
      const ctx = canvas.getContext('2d', { 
        willReadFrequently: false,
        alpha: false,
        desynchronized: true
      })!;
      
      // Capture Reddit overlay once with proper positioning
      let overlayCanvas: HTMLCanvasElement | null = null;
      if (options.showRedditOverlay && templateContainer) {
        // Temporarily reset position for clean capture
        const originalTransform = templateContainer.style.transform;
        templateContainer.style.transform = 'scale(1)';
        
        overlayCanvas = await html2canvas(templateContainer, {
          width: 480,
          height: 600,
          backgroundColor: null,
          scale: 1,
          useCORS: true,
          allowTaint: true,
        });
        
        // Restore original transform
        templateContainer.style.transform = originalTransform;
      }
      
      // Use H.264/MP4 codec for better compatibility
      const stream = canvas.captureStream(30);
      let mediaRecorder: MediaRecorder;
      
      // Try different codecs for MP4 support
      const codecOptions = [
        'video/mp4;codecs=avc1.42E01E',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ];
      
      let selectedCodec = '';
      for (const codec of codecOptions) {
        if (MediaRecorder.isTypeSupported(codec)) {
          selectedCodec = codec;
          break;
        }
      }
      
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedCodec,
        videoBitsPerSecond: 8000000
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.start(100); // Smaller chunks for smoother recording

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
        <div style="font-weight: bold; margin-bottom: 4px;">Exporting ${selectedCodec.includes('mp4') ? 'MP4' : 'WebM'} video...</div>
        <div style="font-size: 14px;">Processing: <span id="export-progress">0</span>%</div>
        <div style="font-size: 12px; margin-top: 4px;">Frame: <span id="frame-counter">0</span> / <span id="total-frames">0</span></div>
      `;
      document.body.appendChild(progressDiv);

      const fps = 30;
      const totalFrames = options.totalDuration * fps;
      let frameCount = 0;

      const totalFramesElement = document.getElementById('total-frames');
      if (totalFramesElement) {
        totalFramesElement.textContent = totalFrames.toString();
      }

      // Optimized frame processing
      const processFrame = (): Promise<void> => {
        return new Promise((resolve) => {
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
          const frameCounterElement = document.getElementById('frame-counter');
          if (progressElement) progressElement.textContent = progress.toString();
          if (frameCounterElement) frameCounterElement.textContent = frameCount.toString();

          // Set video time
          backgroundVideo.currentTime = currentTime % backgroundVideo.duration;
          
          // Use requestAnimationFrame for smoother rendering
          requestAnimationFrame(() => {
            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw background video frame
            try {
              ctx.drawImage(backgroundVideo, 0, 0, canvas.width, canvas.height);
            } catch (error) {
              console.warn('Error drawing video frame:', error);
            }
            
            // Draw Reddit overlay with correct positioning
            if (overlayCanvas && options.showRedditOverlay) {
              const overlayVisible = currentTime >= options.overlayStartTime && 
                (!options.disappearAfterTime || currentTime <= options.overlayStartTime + options.overlayDuration);
              
              if (overlayVisible) {
                ctx.save();
                
                let alpha = 1;
                let slideOffset = 0;
                
                // Calculate animation progress
                const fadeInDuration = 0.5;
                const fadeOutDuration = 1;
                
                if (currentTime < options.overlayStartTime + fadeInDuration) {
                  const progress = (currentTime - options.overlayStartTime) / fadeInDuration;
                  alpha = Math.max(0, Math.min(1, progress));
                } else if (options.disappearAfterTime && options.exitAnimation !== 'none') {
                  const timeUntilEnd = (options.overlayStartTime + options.overlayDuration) - currentTime;
                  
                  if (timeUntilEnd < fadeOutDuration) {
                    const progress = 1 - (timeUntilEnd / fadeOutDuration);
                    
                    if (options.exitAnimation === 'fade') {
                      alpha = Math.max(0, 1 - progress);
                    } else if (options.exitAnimation === 'slide') {
                      slideOffset = -canvas.width * progress;
                    }
                  }
                }
                
                // Apply the exact same positioning as in the preview
                ctx.globalAlpha = alpha;
                
                // Calculate center position with user adjustments
                const centerX = canvas.width / 2 + templatePosition.x + slideOffset;
                const centerY = canvas.height / 2 + templatePosition.y;
                
                // Draw overlay with exact positioning and scaling
                const scaledWidth = overlayCanvas.width * templateScale;
                const scaledHeight = overlayCanvas.height * templateScale;
                
                ctx.drawImage(
                  overlayCanvas,
                  centerX - scaledWidth / 2,
                  centerY - scaledHeight / 2,
                  scaledWidth,
                  scaledHeight
                );
                
                ctx.restore();
              }
            }
            
            frameCount++;
            
            // Continue processing with proper timing
            setTimeout(() => {
              processFrame().then(resolve);
            }, 1000 / fps);
          });
        });
      };

      // Start processing
      await processFrame();

      // Wait for recording to complete and download
      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: selectedCodec });
          
          // Create download link with proper extension
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const extension = selectedCodec.includes('mp4') ? 'mp4' : 'webm';
          link.download = `reddit-story-${options.backgroundVideo}-${Date.now()}.${extension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          URL.revokeObjectURL(url);
          resolve();
        };
      });

    } catch (error) {
      const progressDiv = document.querySelector('[style*="Exporting"]');
      if (progressDiv && progressDiv.parentNode) {
        progressDiv.parentNode.removeChild(progressDiv);
      }
      
      if (error instanceof Error) {
        throw new Error(`Export failed: ${error.message}`);
      }
      throw error;
    }
  }
}

export const videoExporter = new VideoExporter();
