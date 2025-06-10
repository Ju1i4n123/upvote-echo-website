
import { useState } from "react";
import { Header } from "@/components/Header";
import { PostForm } from "@/components/PostForm";
import { RedditStoryPreview } from "@/components/RedditStoryPreview";
import { AudioStoryForm } from "@/components/AudioStoryForm";
import { VideoExportControls } from "@/components/VideoExportControls";
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

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<'minecraft' | 'subway-surfers'>('minecraft');

  const handleAudioGenerated = (url: string) => {
    setAudioUrl(url);
  };

  const handlePlayAudio = () => {
    if (!audioUrl) return;

    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }

    const audio = new Audio(audioUrl);
    audio.onended = () => {
      setIsPlayingAudio(false);
      setCurrentAudio(null);
    };
    
    audio.play();
    setCurrentAudio(audio);
    setIsPlayingAudio(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Reddit Story Template</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create custom Reddit stories overlaid on video backgrounds and export them as MP4 files.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <PostForm postData={postData} setPostData={setPostData} />
            <AudioStoryForm onAudioGenerated={handleAudioGenerated} />
            <VideoExportControls 
              elementId="reddit-story-preview" 
              selectedVideo={selectedVideo}
              onVideoChange={setSelectedVideo}
            />
          </div>
          <RedditStoryPreview 
            postData={postData} 
            onPlayAudio={audioUrl ? handlePlayAudio : undefined}
            isPlayingAudio={isPlayingAudio}
            selectedVideo={selectedVideo}
          />
        </div>
      </div>
    </div>
  );
};

export default RedditStory;
