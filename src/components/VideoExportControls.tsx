import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Video, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { videoExporter } from "@/utils/videoUtils";

interface VideoExportControlsProps {
  elementId: string;
  selectedVideo: 'minecraft' | 'subway-surfers';
  onVideoChange: (video: 'minecraft' | 'subway-surfers') => void;
}

export const VideoExportControls = ({ elementId, selectedVideo, onVideoChange }: VideoExportControlsProps) => {
  const [totalDuration, setTotalDuration] = useState([10]);
  const [overlayStartTime, setOverlayStartTime] = useState([2]);
  const [overlayDuration, setOverlayDuration] = useState([6]);
  const [exitAnimation, setExitAnimation] = useState<'none' | 'fade' | 'slide'>('fade');
  const [showRedditOverlay, setShowRedditOverlay] = useState(true);
  const [disappearAfterTime, setDisappearAfterTime] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const videoOptions = {
    minecraft: {
      label: "Minecraft",
      url: "https://vimeo.com/1092266536/7a17cf4cf9"
    },
    'subway-surfers': {
      label: "Subway Surfers", 
      url: "https://vimeo.com/1092266136/db7b597083"
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Scroll the preview into view
      const previewElement = document.getElementById(elementId);
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Wait for scroll to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      await videoExporter.exportVideo(elementId, {
        totalDuration: totalDuration[0],
        overlayStartTime: overlayStartTime[0],
        overlayDuration: disappearAfterTime ? overlayDuration[0] : totalDuration[0] - overlayStartTime[0],
        exitAnimation: disappearAfterTime ? exitAnimation : 'none',
        backgroundVideo: selectedVideo,
        showRedditOverlay,
        disappearAfterTime,
      });
      
      toast({
        title: "Success",
        description: "Video exported successfully!",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to export video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const maxOverlayStart = Math.max(0, totalDuration[0] - 1);
  const maxOverlayDuration = totalDuration[0] - overlayStartTime[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="size-5" />
          Video Export Settings
        </CardTitle>
        <CardDescription>
          Configure how your Reddit story video will be exported
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>How to export:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Click "Export as WebM Video" below</li>
              <li>When prompted, allow screen recording permission</li>
              <li>Select "This Tab" or the browser tab showing this page</li>
              <li>Keep the video preview visible during recording</li>
              <li>The export will complete automatically after the set duration</li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label>Background Video</Label>
          <Select value={selectedVideo} onValueChange={onVideoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select background video" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minecraft">Minecraft</SelectItem>
              <SelectItem value="subway-surfers">Subway Surfers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-reddit-overlay" 
              checked={showRedditOverlay}
              onCheckedChange={(checked) => setShowRedditOverlay(checked as boolean)}
            />
            <Label htmlFor="show-reddit-overlay">Show Reddit overlay</Label>
          </div>
          
          {showRedditOverlay && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="disappear-after-time" 
                checked={disappearAfterTime}
                onCheckedChange={(checked) => setDisappearAfterTime(checked as boolean)}
              />
              <Label htmlFor="disappear-after-time">Make overlay disappear after time</Label>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Total Video Duration: {totalDuration[0]}s</Label>
          <Slider
            value={totalDuration}
            onValueChange={setTotalDuration}
            max={60}
            min={5}
            step={1}
            className="w-full"
          />
        </div>

        {showRedditOverlay && (
          <>
            <div className="space-y-2">
              <Label>Reddit Overlay Start Time: {overlayStartTime[0]}s</Label>
              <Slider
                value={overlayStartTime}
                onValueChange={setOverlayStartTime}
                max={maxOverlayStart}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {disappearAfterTime && (
              <>
                <div className="space-y-2">
                  <Label>Reddit Overlay Duration: {overlayDuration[0]}s</Label>
                  <Slider
                    value={overlayDuration}
                    onValueChange={setOverlayDuration}
                    max={maxOverlayDuration}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Exit Animation</Label>
                  <Select value={exitAnimation} onValueChange={(value: 'none' | 'fade' | 'slide') => setExitAnimation(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exit animation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Instant)</SelectItem>
                      <SelectItem value="fade">Fade Out</SelectItem>
                      <SelectItem value="slide">Slide Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        )}

        <div className="pt-4 border-t">
          {showRedditOverlay && (
            <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
              <p>Preview Timeline:</p>
              <div className="relative h-8 bg-muted rounded">
                <div 
                  className="absolute h-full bg-primary/20 rounded"
                  style={{ 
                    left: `${(overlayStartTime[0] / totalDuration[0]) * 100}%`,
                    width: `${((disappearAfterTime ? overlayDuration[0] : totalDuration[0] - overlayStartTime[0]) / totalDuration[0]) * 100}%`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs">
                  Reddit Overlay Active
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Background: {videoOptions[selectedVideo].label}
                {!disappearAfterTime && " • Overlay stays for full duration"}
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
            size="lg"
          >
            <Download className="size-4 mr-2" />
            {isExporting ? "Exporting Video..." : "Export as WebM Video"}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            A progress indicator will appear during recording. Exports as WebM format - use a converter for MP4.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};