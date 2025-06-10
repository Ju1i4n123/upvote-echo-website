
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Square, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioStoryFormProps {
  onAudioGenerated?: (audioUrl: string) => void;
}

export const AudioStoryForm = ({ onAudioGenerated }: AudioStoryFormProps) => {
  const [story, setStory] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const generateAudio = async () => {
    if (!story.trim()) {
      toast({
        title: "Error",
        description: "Please enter a story text",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "Error", 
        description: "Please enter your ElevenLabs API key",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x", {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: story,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioObjectUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioObjectUrl);
      onAudioGenerated?.(audioObjectUrl);

      toast({
        title: "Success",
        description: "Audio generated successfully!",
      });
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Error",
        description: "Failed to generate audio. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = () => {
    if (!audioUrl) return;

    if (audio) {
      audio.pause();
      setAudio(null);
    }

    const newAudio = new Audio(audioUrl);
    newAudio.onended = () => {
      setIsPlaying(false);
      setAudio(null);
    };
    
    newAudio.play();
    setAudio(newAudio);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="apiKey">ElevenLabs API Key</Label>
        <Input
          id="apiKey"
          type="password"
          placeholder="Enter your ElevenLabs API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">Story Text</Label>
        <Textarea
          id="story"
          placeholder="Enter your story text here..."
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={generateAudio}
          disabled={isGenerating}
          className="flex-1"
        >
          <Volume2 className="size-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Audio"}
        </Button>

        {audioUrl && (
          <Button
            variant="outline"
            onClick={isPlaying ? stopAudio : playAudio}
          >
            {isPlaying ? <Square className="size-4" /> : <Play className="size-4" />}
          </Button>
        )}
      </div>
    </div>
  );
};
