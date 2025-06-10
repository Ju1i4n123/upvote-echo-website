
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostData } from "@/pages/Index";
import { UpvoteIcon } from "@/components/icons/UpvoteIcon";
import { CommentIcon } from "@/components/icons/CommentIcon";
import { VerifiedIcon } from "@/components/icons/VerifiedIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Preview</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Reset</Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Download</Button>
        </div>
      </div>
      
      <Card className={`p-4 ${postData.darkMode ? 'bg-gray-900 text-white' : 'bg-white'} ${postData.wideLayout ? 'max-w-2xl' : 'max-w-md'} mx-auto`}>
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/lovable-uploads/36c19aa4-e4d2-4e24-bb53-2a8eb94e5a5e.png" 
              alt="Reddit Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-orange-500">r/{postData.subreddit}</span>
              {postData.badge === "Verified" && (
                <VerifiedIcon className="w-3 h-3" />
              )}
              {!postData.hideTrophies && (
                <div className="flex items-center">
                  <img 
                    src="/lovable-uploads/7d0adf6f-a83d-42da-9453-9d8ba8d018c9.png" 
                    alt="Trophies" 
                    className="h-4"
                  />
                </div>
              )}
            </div>
            
            <h3 className="font-medium mb-2">{postData.text}</h3>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {!postData.hideUpvotes && (
                <div className="flex items-center space-x-1">
                  <UpvoteIcon className="w-4 h-4" />
                  <span>{formatCount(postData.upvotes)}</span>
                </div>
              )}
              
              {!postData.hideComments && (
                <div className="flex items-center space-x-1">
                  <CommentIcon className="w-4 h-4" />
                  <span>{formatCount(postData.comments)}</span>
                </div>
              )}
              
              {!postData.hideShare && (
                <div className="flex items-center space-x-1">
                  <ShareIcon className="w-4 h-4" />
                  <span>Share</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
