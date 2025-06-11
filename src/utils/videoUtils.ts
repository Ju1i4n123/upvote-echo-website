import html2canvas from 'html2canvas';

class VideoExporter {
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
      // Request screen capture permission
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false
      });

      // Get the video track
      const videoTrack = displayStream.getVideoTracks()[0];
      const { width, height } = videoTrack.getSettings();

      // Create a canvas for recording
      const canvas = document.createElement('canvas');
      canvas.width = 540;
      canvas.height = 960;
      const ctx = canvas.getContext('2d')!;

      // Create a video element to draw the screen capture
      const video = document.createElement('video');
      video.srcObject = displayStream;
      video.autoplay = true;

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      // Calculate the area to capture (assuming the preview is centered)
      const previewElement = element;
      const rect = previewElement.getBoundingClientRect();
      
      // Scale factors
      const scaleX = width! / window.innerWidth;
      const scaleY = height! / window.innerHeight;

      // Capture Reddit overlay if needed
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

      // Set up MediaRecorder
      const canvasStream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const fps = 30;
      const totalFrames = options.totalDuration * fps;
      let frameCount = 0;
      const startTime = Date.now();

      mediaRecorder.start();

      // Show alert to user
      const alertDiv = document.createElement('div');
      alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
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
      alertDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">Recording in progress...</div>
        <div style="font-size: 14px;">Please keep the preview area visible</div>
        <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">Duration: <span id="recording-time">0</span>s / ${options.totalDuration}s</div>
      `;
      document.body.appendChild(alertDiv);

      const renderFrame = () => {
        if (frameCount >= totalFrames) {
          mediaRecorder.stop();
          displayStream.getTracks().forEach(track => track.stop());
          document.body.removeChild(alertDiv);
          return;
        }

        const currentTime = frameCount / fps;
        
        // Update recording time
        const timeElement = document.getElementById('recording-time');
        if (timeElement) {
          timeElement.textContent = currentTime.toFixed(1);
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the captured video area
        ctx.drawImage(
          video,
          rect.left * scaleX,
          rect.top * scaleY,
          rect.width * scaleX,
          rect.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Draw Reddit overlay if needed
        if (overlayCanvas && options.showRedditOverlay) {
          const overlayVisible = currentTime >= options.overlayStartTime && 
            (!options.disappearAfterTime || currentTime <= options.overlayStartTime + options.overlayDuration);
          
          if (overlayVisible) {
            ctx.save();
            
            let alpha = 1;
            
            // Calculate animation progress
            const fadeInDuration = 0.5;
            const fadeOutDuration = 1;
            
            if (currentTime < options.overlayStartTime + fadeInDuration) {
              // Fade in
              const progress = (currentTime - options.overlayStartTime) / fadeInDuration;
              alpha = progress;
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.scale(0.8 + 0.2 * progress, 0.8 + 0.2 * progress);
              ctx.translate(-canvas.width / 2, -canvas.height / 2);
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
            ctx.drawImage(overlayCanvas, 0, 0);
            ctx.restore();
          }
        }
        
        frameCount++;
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
          
          resolve();
        };
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Screen recording permission denied. Please allow screen recording and try again.');
      }
      throw error;
    }
  }
}

export const videoExporter = new VideoExporter();