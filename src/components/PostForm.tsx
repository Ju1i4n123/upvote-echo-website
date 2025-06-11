
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PostData } from "@/pages/Index";
import { ChevronDown, Settings, Camera, Edit } from "lucide-react";
import { useState } from "react";

interface PostFormProps {
  postData: PostData;
  setPostData: (data: PostData) => void;
}

export const PostForm = ({ postData, setPostData }: PostFormProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const updateField = (field: keyof PostData, value: string | boolean) => {
    setPostData({ ...postData, [field]: value });
  };

  return (
    <div className="shadow-xs flex rounded-2xl border border-gray-200 bg-white p-2 max-lg:flex-col-reverse">
      <div className="flex-1 space-y-4 overflow-hidden p-3 lg:pr-5">
        
        {/* Avatar Field */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-y-1">
            <Label className="font-semibold text-gray-900 text-sm">Avatar</Label>
            <div className="flex items-center gap-4">
              <button className="group/image-input relative cursor-pointer overflow-hidden h-9 min-w-9 rounded-md bg-background shadow-xs p-px ring ring-inset ring-gray-200 hover:bg-gray-50">
                <div className="flex size-full items-center justify-center text-gray-400">
                  <Camera className="size-[55%]" />
                </div>
                <div className="invisible absolute inset-0 z-0 flex items-center justify-center group-hover/image-input:visible group-hover/image-input:bg-black/40">
                  <Edit className="size-[45%] text-white" />
                </div>
              </button>
              <Button variant="outline" size="sm" className="h-6 text-xs rounded-sm px-2 text-gray-500 border-gray-200">
                Upload
              </Button>
            </div>
          </div>
        </div>

        {/* Type Field */}
        <div className="flex flex-col gap-y-1">
          <Label className="font-semibold text-gray-900 text-sm">Type</Label>
          <Select value={postData.type} onValueChange={(value) => updateField("type", value)}>
            <SelectTrigger className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Story">Story</SelectItem>
              <SelectItem value="Question">Question</SelectItem>
              <SelectItem value="Discussion">Discussion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subreddit Field */}
        <div className="flex flex-col gap-y-1">
          <Label className="font-semibold text-gray-900 text-sm">Subreddit / Username</Label>
          <Input
            value={postData.subreddit}
            onChange={(e) => updateField("subreddit", e.target.value)}
            placeholder="VirAI"
            maxLength={23}
            className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0"
          />
          <span className="text-gray-400 text-sm">{postData.subreddit.length} / 23 characters</span>
        </div>

        {/* Text Field */}
        <div className="flex flex-col gap-y-1">
          <Label className="font-semibold text-gray-900 text-sm">Text</Label>
          <Textarea
            value={postData.text}
            onChange={(e) => updateField("text", e.target.value)}
            placeholder="TIL that my cat has been secretly hoarding bottle caps under my bed for the past year. Found over 100 of them while cleaning!"
            className="shadow-xs bg-background ring ring-gray-200 border-0 resize-none field-sizing-content min-h-[80px]"
          />
        </div>

        {/* Badge Field */}
        <div className="flex flex-col gap-y-1">
          <Label className="font-semibold text-gray-900 text-sm">Badge</Label>
          <Select value={postData.badge} onValueChange={(value) => updateField("badge", value)}>
            <SelectTrigger className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No badge">No badge</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Moderator">Moderator</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upvotes and Comments */}
        <div className="flex w-full gap-4">
          <div className="flex flex-col gap-y-1 flex-1">
            <Label className="font-semibold text-gray-900 text-sm">Upvotes</Label>
            <Input
              type="number"
              value={postData.upvotes}
              onChange={(e) => updateField("upvotes", e.target.value)}
              placeholder="249"
              className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0"
            />
          </div>
          <div className="flex flex-col gap-y-1 flex-1">
            <Label className="font-semibold text-gray-900 text-sm">Comments</Label>
            <Input
              type="number"
              value={postData.comments}
              onChange={(e) => updateField("comments", e.target.value)}
              placeholder="57"
              className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0"
            />
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mt-5 flex flex-col items-center">
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-7.5 gap-2 px-3 text-sm bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full flex items-center"
          >
            <Settings className="size-4" />
            Show Advanced Options
            <ChevronDown className={`size-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
          
          {showAdvanced && (
            <div className="w-full mt-4 flex flex-col gap-3">
              {/* Dark Mode */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4">
                <div className="flex flex-col">
                  <Label className="font-semibold text-gray-900 text-sm">Dark mode</Label>
                  <span className="text-gray-400 text-sm">Display the story in dark mode</span>
                </div>
                <Switch
                  checked={postData.darkMode}
                  onCheckedChange={(checked) => updateField("darkMode", checked)}
                  className="w-7.5 h-5"
                />
              </div>

              {/* Wide Layout */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4">
                <div className="flex flex-col">
                  <Label className="font-semibold text-gray-900 text-sm">Wide layout</Label>
                  <span className="text-gray-400 text-sm">Display the story in a wider layout</span>
                </div>
                <Switch
                  checked={postData.wideLayout}
                  onCheckedChange={(checked) => updateField("wideLayout", checked)}
                  className="w-7.5 h-5"
                />
              </div>

              {/* Approximate Counts */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4">
                <div className="flex flex-col">
                  <Label className="font-semibold text-gray-900 text-sm">Approximate counts</Label>
                  <span className="text-gray-400 text-sm">Show upvotes/comments with '+' symbol (e.g. 99+)</span>
                </div>
                <Switch
                  checked={postData.approximateCounts}
                  onCheckedChange={(checked) => updateField("approximateCounts", checked)}
                  className="w-7.5 h-5"
                />
              </div>

              {/* Hide Trophies */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4">
                <div className="flex flex-col">
                  <Label className="font-semibold text-gray-900 text-sm">Hide trophies</Label>
                  <span className="text-gray-400 text-sm">Don't show the trophies row</span>
                </div>
                <Switch
                  checked={postData.hideTrophies}
                  onCheckedChange={(checked) => updateField("hideTrophies", checked)}
                  className="w-7.5 h-5"
                />
              </div>

              {/* Hide Upvotes */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4">
                <div className="flex flex-col">
                  <Label className="font-semibold text-gray-900 text-sm">Hide upvotes</Label>
                  <span className="text-gray-400 text-sm">Don't show the upvote count</span>
                </div>
                <Switch
                  checked={postData.hideUpvotes}
                  onCheckedChange={(checked) => updateField("hideUpvotes", checked)}
                  className="w-7.5 h-5"
                />
              </div>

              {/* Hide Comments */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4">
                <div className="flex flex-col">
                  <Label className="font-semibold text-gray-900 text-sm">Hide comments</Label>
                  <span className="text-gray-400 text-sm">Don't show the comment count</span>
                </div>
                <Switch
                  checked={postData.hideComments}
                  onCheckedChange={(checked) => updateField("hideComments", checked)}
                  className="w-7.5 h-5"
                />
              </div>

              {/* Hide Share */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4">
                <div className="flex flex-col">
                  <Label className="font-semibold text-gray-900 text-sm">Hide share</Label>
                  <span className="text-gray-400 text-sm">Don't show the share button</span>
                </div>
                <Switch
                  checked={postData.hideShare}
                  onCheckedChange={(checked) => updateField("hideShare", checked)}
                  className="w-7.5 h-5"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
