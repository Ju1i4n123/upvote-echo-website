
import { Button } from "@/components/ui/button";
import { PostData } from "@/pages/Index";
import { UpvoteIcon } from "@/components/icons/UpvoteIcon";
import { CommentIcon } from "@/components/icons/CommentIcon";
import { VerifiedIcon } from "@/components/icons/VerifiedIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { Lightbulb } from "lucide-react";
import { downloadRedditPost } from "@/utils/imageUtils";

interface RedditStoryPreviewProps {
  postData: PostData;
}

export const RedditStoryPreview = ({ postData }: RedditStoryPreviewProps) => {
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
      <div className="flex justify-end space-x-1.5 p-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7.5 text-sm rounded-full border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-500"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button 
          size="sm" 
          className="h-7.5 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>

      {/* TikTok-style Video with Reddit Overlay */}
      <div className="grid flex-1 place-items-center py-12">
        <div 
          id="reddit-story-preview"
          className="relative w-[360px] h-[640px] max-w-[calc(360px*var(--scaling))] max-h-[calc(640px*var(--scaling))] [--scaling:0.8] max-sm:[--scaling:0.6] bg-black rounded-lg overflow-hidden shadow-lg"
        >
          {/* YouTube Video Background - 16:9 cropped to show top portion */}
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/xKRNDalWE-E?autoplay=1&mute=1&loop=1&playlist=xKRNDalWE-E&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
              title="YouTube video background"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(640px*1.2)] h-[calc(360px*1.2)]"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Reddit Post Overlay - Centered and larger */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`flex max-w-[calc(400px*var(--scaling))] flex-col gap-[calc(10px*var(--scaling))] rounded-[calc(15px*var(--scaling))] p-[calc(20px*var(--scaling))] font-[Inter,_sans-serif] shadow-2xl border-2 border-white/20 ${
                postData.darkMode ? 'bg-[#0e1113] text-white' : 'bg-white'
              } ${postData.wideLayout ? 'max-w-[calc(480px*var(--scaling))]' : ''}`}
              style={{ fontFeatureSettings: 'normal' }}
            >
              {/* User Info */}
              <div className="flex items-center gap-[calc(10px*var(--scaling))]">
                <div className="relative size-[calc(48px*var(--scaling))] shrink-0 overflow-hidden rounded-full">
                  <img 
                    alt="Default Reddit avatar" 
                    className="absolute size-full object-cover" 
                    src="/lovable-uploads/36c19aa4-e4d2-4e24-bb53-2a8eb94e5a5e.png"
                  />
                </div>
                <div className="flex flex-col items-start gap-[calc(3px*var(--scaling))]">
                  <div className="flex items-center gap-1">
                    <span className={`text-[calc(16px*var(--scaling))] font-bold leading-[calc(20px*var(--scaling))] antialiased ${
                      postData.darkMode ? 'text-white' : 'text-[#11151A]'
                    }`} style={{ 
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>
                      {postData.subreddit || "postfully.app"}
                    </span>
                    {postData.badge === "Verified" && (
                      <VerifiedIcon className="mb-[calc(1px*var(--scaling))] inline size-[calc(16px*var(--scaling))]" />
                    )}
                  </div>
                  {!postData.hideTrophies && (
                    <img 
                      alt="Reddit trophies" 
                      src="/lovable-uploads/7d0adf6f-a83d-42da-9453-9d8ba8d018c9.png" 
                      className="h-[calc(14px*var(--scaling))] w-[calc(174px*var(--scaling))]"
                    />
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="flex flex-col gap-[calc(15px*var(--scaling))]">
                <span className={`whitespace-pre-wrap break-words text-[calc(20px*var(--scaling))] font-bold leading-[calc(26px*var(--scaling))] antialiased ${
                  postData.darkMode ? 'text-white' : 'text-[#11151A]'
                }`} style={{ 
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}>
                  {postData.text || "Create your custom Reddit story"}
                </span>
                
                {/* Actions */}
                <div className="flex justify-between gap-[calc(20px*var(--scaling))]">
                  <div className="flex items-center gap-[inherit]">
                    {!postData.hideUpvotes && (
                      <div className="flex items-center gap-[calc(6px*var(--scaling))] text-[#5C6C74]">
                        <UpvoteIcon className="size-[calc(20px*var(--scaling))]" />
                        <span className="text-[calc(16px*var(--scaling))] font-semibold antialiased" style={{ 
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}>
                          {formatCount(postData.upvotes) || "249"}
                        </span>
                      </div>
                    )}
                    
                    {!postData.hideComments && (
                      <div className="flex items-center gap-[calc(6px*var(--scaling))] text-[#5C6C74]">
                        <CommentIcon className="size-[calc(20px*var(--scaling))]" />
                        <span className="text-[calc(16px*var(--scaling))] font-semibold antialiased" style={{ 
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}>
                          {formatCount(postData.comments) || "57"}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {!postData.hideShare && (
                    <div className="flex items-center gap-[calc(6px*var(--scaling))] text-[#5C6C74]">
                      <ShareIcon className="size-[calc(20px*var(--scaling))]" />
                      <span className="text-[calc(16px*var(--scaling))] font-semibold antialiased" style={{ 
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
