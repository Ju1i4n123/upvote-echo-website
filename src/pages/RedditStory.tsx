
import { useState } from "react";
import { Header } from "@/components/Header";
import { PostForm } from "@/components/PostForm";
import { RedditStoryPreview } from "@/components/RedditStoryPreview";
import { PostData } from "@/pages/Index";

const RedditStory = () => {
  const [postData, setPostData] = useState<PostData>({
    avatar: "",
    type: "Story",
    subreddit: "",
    text: "",
    badge: "No badge",
    upvotes: "",
    comments: "",
    darkMode: false,
    wideLayout: false,
    approximateCounts: false,
    hideTrophies: false,
    hideUpvotes: false,
    hideComments: false,
    hideShare: false,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Reddit Story Template</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create custom Reddit stories overlaid on YouTube video backgrounds for your content creation needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <PostForm postData={postData} setPostData={setPostData} />
          <RedditStoryPreview postData={postData} />
        </div>
      </div>
    </div>
  );
};

export default RedditStory;
