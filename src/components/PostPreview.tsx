
import { Button } from "@/components/ui/button";
import { PostData } from "@/pages/Index";
import { UpvoteIcon } from "@/components/icons/UpvoteIcon";
import { CommentIcon } from "@/components/icons/CommentIcon";
import { VerifiedIcon } from "@/components/icons/VerifiedIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { Lightbulb } from "lucide-react";
import { downloadRedditPost } from "@/utils/imageUtils";

interface PostPreviewProps {
  postData: PostData;
}

export const PostPreview = ({ postData }: PostPreviewProps) => {
  const formatCount = (count: string) => {
    if (postData.approximateCounts && count) {
      return count + "+";
    }
    return count;
  };

  const handleDownload = () => {
    downloadRedditPost('reddit-post-preview', 'reddit-post.png');
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

      {/* Reddit Post Preview */}
      <div className="grid flex-1 place-items-center py-12">
        <div 
          id="reddit-post-preview"
          className={`flex max-w-[calc(260px*var(--scaling))] flex-col gap-[calc(7px*var(--scaling))] rounded-[calc(11px*var(--scaling))] p-[calc(12px*var(--scaling))] font-[Inter,_sans-serif] [--scaling:1] shadow-lg max-sm:[--scaling:0.8] ${
            postData.darkMode ? 'bg-[#0e1113] text-white' : 'bg-white'
          } ${postData.wideLayout ? 'max-w-[calc(400px*var(--scaling))]' : ''}`}
          style={{ fontFeatureSettings: 'normal' }}
        >
          {/* User Info */}
          <div className="flex items-center gap-[calc(7px*var(--scaling))]">
            <div className="relative size-[calc(36px*var(--scaling))] shrink-0 overflow-hidden rounded-full">
              <img 
                alt="Default Reddit avatar" 
                className="absolute size-full object-cover" 
                src="/lovable-uploads/36c19aa4-e4d2-4e24-bb53-2a8eb94e5a5e.png"
              />
            </div>
            <div className="flex flex-col items-start gap-[calc(2px*var(--scaling))]">
              <div className="flex items-center gap-1">
                <span className={`text-[calc(13px*var(--scaling))] font-bold leading-[calc(16px*var(--scaling))] antialiased ${
                  postData.darkMode ? 'text-white' : 'text-[#11151A]'
                }`} style={{ 
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale'
                }}>
                  {postData.subreddit || "VirAI"}
                </span>
                {postData.badge === "Verified" && (
                  <VerifiedIcon className="mb-[calc(1px*var(--scaling))] inline size-[calc(12px*var(--scaling))]" />
                )}
              </div>
              {!postData.hideTrophies && (
                <img 
                  alt="Reddit trophies" 
                  src="/lovable-uploads/7d0adf6f-a83d-42da-9453-9d8ba8d018c9.png" 
                  className="h-[calc(11px*var(--scaling))] w-[calc(137px*var(--scaling))]"
                />
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="flex flex-col gap-[calc(10px*var(--scaling))]">
            <span className={`whitespace-pre-wrap break-words text-[calc(16px*var(--scaling))] font-bold leading-[calc(20px*var(--scaling))] antialiased ${
              postData.darkMode ? 'text-white' : 'text-[#11151A]'
            }`} style={{ 
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}>
              {postData.text || "Create your custom Reddit story"}
            </span>
            
            {/* Actions */}
            <div className="flex justify-between gap-[calc(14px*var(--scaling))]">
              <div className="flex items-center gap-[inherit]">
                {!postData.hideUpvotes && (
                  <div className="flex items-center gap-[calc(4px*var(--scaling))] text-[#5C6C74]">
                    <UpvoteIcon className="size-[calc(16px*var(--scaling))]" />
                    <span className="text-[calc(12px*var(--scaling))] font-semibold antialiased" style={{ 
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>
                      {formatCount(postData.upvotes) || "249"}
                    </span>
                  </div>
                )}
                
                {!postData.hideComments && (
                  <div className="flex items-center gap-[calc(4px*var(--scaling))] text-[#5C6C74]">
                    <CommentIcon className="size-[calc(16px*var(--scaling))]" />
                    <span className="text-[calc(12px*var(--scaling))] font-semibold antialiased" style={{ 
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>
                      {formatCount(postData.comments) || "57"}
                    </span>
                  </div>
                )}
              </div>
              
              {!postData.hideShare && (
                <div className="flex items-center gap-[calc(4px*var(--scaling))] text-[#5C6C74]">
                  <ShareIcon className="size-[calc(16px*var(--scaling))]" />
                  <span className="text-[calc(12px*var(--scaling))] font-semibold antialiased" style={{ 
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale'
                  }}>Share</span>
                </div>
              )}
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
