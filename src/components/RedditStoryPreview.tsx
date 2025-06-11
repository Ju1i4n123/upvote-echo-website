
import { Button } from "@/components/ui/button";
import { PostData } from "@/pages/Index";
import { UpvoteIcon } from "@/components/icons/UpvoteIcon";
import { CommentIcon } from "@/components/icons/CommentIcon";
import { VerifiedIcon } from "@/components/icons/VerifiedIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { Lightbulb, Move, RotateCcw } from "lucide-react";
import { downloadRedditPost } from "@/utils/imageUtils";
import { useEffect, useRef, useState } from "react";

interface RedditStoryPreviewProps {
  postData: PostData;
  onPlayAudio?: () => void;
  isPlayingAudio?: boolean;
  selectedVideo?: 'minecraft' | 'subway-surfers';
}

export const RedditStoryPreview = ({ postData, onPlayAudio, isPlayingAudio, selectedVideo = 'minecraft' }: RedditStoryPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const [templatePosition, setTemplatePosition] = useState({ x: 0, y: 0 });
  const [templateScale, setTemplateScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const videoOptions = {
    minecraft: {
      embedUrl: "https://player.vimeo.com/video/1092266536?h=7a17cf4cf9&autoplay=1&loop=1&muted=1&background=1"
    },
    'subway-surfers': {
      embedUrl: "https://player.vimeo.com/video/1092266136?h=db7b597083&autoplay=1&loop=1&muted=1&background=1"
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = 540;
    canvas.height = 960;

    // Create animated background as fallback
    const animate = () => {
      const time = Date.now() * 0.001;
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 540, 960);
      gradient.addColorStop(0, `hsl(${time * 20 % 360}, 70%, 60%)`);
      gradient.addColorStop(1, `hsl(${(time * 20 + 180) % 360}, 70%, 40%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 540, 960);
      
      // Add moving shapes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 5; i++) {
        const x = 270 + Math.sin(time + i) * 150;
        const y = 480 + Math.cos(time * 0.5 + i) * 200;
        ctx.beginPath();
        ctx.arc(x, y, 30 + Math.sin(time * 2 + i) * 10, 0, Math.PI * 2);
        ctx.fill();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === templateRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - templatePosition.x,
        y: e.clientY - templatePosition.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTemplatePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setTemplateScale(prev => Math.max(0.3, Math.min(2, prev + delta)));
  };

  const resetPosition = () => {
    setTemplatePosition({ x: 0, y: 0 });
    setTemplateScale(1);
  };

  const formatCount = (count: string) => {
    if (postData.approximateCounts && count) {
      return count + "+";
    }
    return count;
  };

  const handleDownload = () => {
    downloadRedditPost('reddit-story-preview', 'reddit-story.png');
  };

  const handleReset = () => {
    console.log('Reset clicked');
  };

  return (
    <div className="flex flex-1 flex-col rounded-xl bg-gray-50 ring ring-gray-100">
      {/* Header with Reset and Download */}
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Move className="size-4" />
          <span>Drag to move • Scroll to resize</span>
        </div>
        <div className="flex space-x-1.5">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7.5 text-sm rounded-full border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-500"
            onClick={resetPosition}
          >
            <RotateCcw className="size-3 mr-1" />
            Reset Position
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7.5 text-sm rounded-full border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-500"
            onClick={handleReset}
          >
            Reset
          </Button>
          {onPlayAudio && (
            <Button 
              variant="outline"
              size="sm" 
              className="h-7.5 text-sm rounded-full border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-500"
              onClick={onPlayAudio}
              disabled={isPlayingAudio}
            >
              {isPlayingAudio ? "Playing..." : "Play Audio"}
            </Button>
          )}
          <Button 
            size="sm" 
            className="h-7.5 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>

      {/* 9:16 Video Container with Reddit Overlay */}
      <div className="grid flex-1 place-items-center py-12">
        <div 
          id="reddit-story-preview"
          className="relative w-[540px] h-[960px] max-w-[calc(540px*var(--scaling))] max-h-[calc(960px*var(--scaling))] [--scaling:0.7] max-sm:[--scaling:0.4] bg-black rounded-lg overflow-hidden shadow-lg"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Vimeo Video Background - 9:16 format */}
          <iframe
            src={videoOptions[selectedVideo].embedUrl}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={`${selectedVideo} background video`}
          />

          {/* Animated Canvas Fallback - only shows if iframe fails */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover -z-10"
          />

          {/* Reddit Post Overlay - Draggable and Resizable */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${templatePosition.x}px, ${templatePosition.y}px)`
            }}
          >
            <div 
              ref={templateRef}
              className={`reddit-template flex max-w-[calc(480px*var(--scaling))] flex-col gap-[calc(15px*var(--scaling))] rounded-[calc(15px*var(--scaling))] p-[calc(25px*var(--scaling))] font-[Inter,_sans-serif] shadow-2xl border-2 border-white/20 cursor-move select-none ${
                postData.darkMode ? 'bg-[#0e1113] text-white' : 'bg-white'
              } ${postData.wideLayout ? 'max-w-[calc(520px*var(--scaling))]' : ''} ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ 
                fontFeatureSettings: 'normal',
                transform: `scale(${templateScale})`,
                transformOrigin: 'center center'
              }}
              onMouseDown={handleMouseDown}
              onWheel={handleWheel}
            >
              {/* User Info */}
              <div className="flex items-center gap-[calc(12px*var(--scaling))]">
                <div className="relative size-[calc(54px*var(--scaling))] shrink-0 overflow-hidden rounded-full">
                  <img 
                    alt="Default Reddit avatar" 
                    className="absolute size-full object-cover" 
                    src="/lovable-uploads/36c19aa4-e4d2-4e24-bb53-2a8eb94e5a5e.png"
                  />
                </div>
                <div className="flex flex-col items-start gap-[calc(4px*var(--scaling))]">
                  <div className="flex items-center gap-1">
                    <span className={`text-[calc(18px*var(--scaling))] font-bold leading-[calc(22px*var(--scaling))] antialiased ${
                      postData.darkMode ? 'text-white' : 'text-[#11151A]'
                    }`} style={{ 
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>
                      {postData.subreddit || "postfully.app"}
                    </span>
                    {postData.badge === "Verified" && (
                      <VerifiedIcon className="mb-[calc(1px*var(--scaling))] inline size-[calc(18px*var(--scaling))]" />
                    )}
                  </div>
                  {!postData.hideTrophies && (
                    <img 
                      alt="Reddit trophies" 
                      src="/lovable-uploads/7d0adf6f-a83d-42da-9453-9d8ba8d018c9.png" 
                      className="h-[calc(16px*var(--scaling))] w-[calc(190px*var(--scaling))]"
                    />
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="flex flex-col gap-[calc(18px*var(--scaling))]">
                <span className={`whitespace-pre-wrap break-words text-[calc(22px*var(--scaling))] font-bold leading-[calc(28px*var(--scaling))] antialiased ${
                  postData.darkMode ? 'text-white' : 'text-[#11151A]'
                }`} style={{ 
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}>
                  {postData.text || "Create your custom Reddit story"}
                </span>
                
                {/* Actions */}
                <div className="flex justify-between gap-[calc(25px*var(--scaling))]">
                  <div className="flex items-center gap-[inherit]">
                    {!postData.hideUpvotes && (
                      <div className="flex items-center gap-[calc(8px*var(--scaling))] text-[#5C6C74]">
                        <UpvoteIcon className="size-[calc(22px*var(--scaling))]" />
                        <span className="text-[calc(18px*var(--scaling))] font-semibold antialiased" style={{ 
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}>
                          {formatCount(postData.upvotes) || "249"}
                        </span>
                      </div>
                    )}
                    
                    {!postData.hideComments && (
                      <div className="flex items-center gap-[calc(8px*var(--scaling))] text-[#5C6C74]">
                        <CommentIcon className="size-[calc(22px*var(--scaling))]" />
                        <span className="text-[calc(18px*var(--scaling))] font-semibold antialiased" style={{ 
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}>
                          {formatCount(postData.comments) || "57"}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {!postData.hideShare && (
                    <div className="flex items-center gap-[calc(8px*var(--scaling))] text-[#5C6C74]">
                      <ShareIcon className="size-[calc(22px*var(--scaling))]" />
                      <span className="text-[calc(18px*var(--scaling))] font-semibold antialiased" style={{ 
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}>Share</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggest Feature Button */}
      <div className="flex justify-center p-3">
        <Button variant="outline" className="h-7.5 text-sm rounded-full border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-500">
          <Lightbulb className="size-4" />
          Suggest a feature
        </Button>
      </div>
    </div>
  );
};
