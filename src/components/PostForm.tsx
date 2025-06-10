
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostData } from "@/pages/Index";

interface PostFormProps {
  postData: PostData;
  setPostData: (data: PostData) => void;
}

export const PostForm = ({ postData, setPostData }: PostFormProps) => {
  const updateField = (field: keyof PostData, value: string | boolean) => {
    setPostData({ ...postData, [field]: value });
  };

  return (
    <Card className="h-fit">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="avatar">Avatar</Label>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-xs">📷</span>
            </div>
            <Button variant="outline" size="sm">Upload</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={postData.type} onValueChange={(value) => updateField("type", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Story">Story</SelectItem>
              <SelectItem value="Question">Question</SelectItem>
              <SelectItem value="Discussion">Discussion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subreddit">Subreddit / Username</Label>
          <Input
            id="subreddit"
            value={postData.subreddit}
            onChange={(e) => updateField("subreddit", e.target.value)}
            placeholder="example1"
          />
          <p className="text-sm text-gray-500">{postData.subreddit.length} / 23 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text">Text</Label>
          <Textarea
            id="text"
            value={postData.text}
            onChange={(e) => updateField("text", e.target.value)}
            placeholder="example2"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="badge">Badge</Label>
          <Select value={postData.badge} onValueChange={(value) => updateField("badge", value)}>
            <SelectTrigger>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="upvotes">Upvotes</Label>
            <Input
              id="upvotes"
              value={postData.upvotes}
              onChange={(e) => updateField("upvotes", e.target.value)}
              placeholder="123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Input
              id="comments"
              value={postData.comments}
              onChange={(e) => updateField("comments", e.target.value)}
              placeholder="456"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <Button variant="ghost" className="w-full mb-4 text-sm">
            🔧 Hide Advanced Options ▲
          </Button>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark mode</Label>
                <p className="text-sm text-gray-500">Display the story in dark mode</p>
              </div>
              <Switch
                checked={postData.darkMode}
                onCheckedChange={(checked) => updateField("darkMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Wide layout</Label>
                <p className="text-sm text-gray-500">Display the story in a wider layout</p>
              </div>
              <Switch
                checked={postData.wideLayout}
                onCheckedChange={(checked) => updateField("wideLayout", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Approximate counts</Label>
                <p className="text-sm text-gray-500">Show upvotes/comments with '+' symbol (e.g. 99+)</p>
              </div>
              <Switch
                checked={postData.approximateCounts}
                onCheckedChange={(checked) => updateField("approximateCounts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Hide trophies</Label>
                <p className="text-sm text-gray-500">Don't show the trophies row</p>
              </div>
              <Switch
                checked={postData.hideTrophies}
                onCheckedChange={(checked) => updateField("hideTrophies", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Hide upvotes</Label>
                <p className="text-sm text-gray-500">Don't show the upvote count</p>
              </div>
              <Switch
                checked={postData.hideUpvotes}
                onCheckedChange={(checked) => updateField("hideUpvotes", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Hide comments</Label>
                <p className="text-sm text-gray-500">Don't show the comment count</p>
              </div>
              <Switch
                checked={postData.hideComments}
                onCheckedChange={(checked) => updateField("hideComments", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Hide share</Label>
                <p className="text-sm text-gray-500">Don't show the share button</p>
              </div>
              <Switch
                checked={postData.hideShare}
                onCheckedChange={(checked) => updateField("hideShare", checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Button variant="ghost" className="text-gray-500">
            💡 Suggest a feature
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
