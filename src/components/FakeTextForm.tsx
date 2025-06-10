import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FakeTextData, Message } from "@/pages/FakeTextGenerator";
import { Camera, Edit, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { handleImageUpload } from "@/utils/imageUtils";

interface FakeTextFormProps {
  textData: FakeTextData;
  setTextData: (data: FakeTextData) => void;
}

export const FakeTextForm = ({ textData, setTextData }: FakeTextFormProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [newMessageSender, setNewMessageSender] = useState<"sender" | "recipient">("sender");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const updateField = (field: keyof FakeTextData, value: string | Message[]) => {
    setTextData({ ...textData, [field]: value });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await handleImageUpload(file);
        updateField("recipientAvatar", imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const addMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: newMessageSender
      };
      updateField("messages", [...textData.messages, message]);
      setNewMessage("");
    }
  };

  const updateMessage = (id: string, text: string) => {
    const updatedMessages = textData.messages.map(msg =>
      msg.id === id ? { ...msg, text } : msg
    );
    updateField("messages", updatedMessages);
  };

  const deleteMessage = (id: string) => {
    const updatedMessages = textData.messages.filter(msg => msg.id !== id);
    updateField("messages", updatedMessages);
  };

  const toggleMessageSender = (id: string) => {
    const updatedMessages = textData.messages.map(msg => {
      if (msg.id === id) {
        const newSender: "sender" | "recipient" = msg.sender === "sender" ? "recipient" : "sender";
        return { ...msg, sender: newSender };
      }
      return msg;
    });
    updateField("messages", updatedMessages);
  };

  return (
    <div className="shadow-xs flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 md:flex-row">
      <div className="flex-1 space-y-4 overflow-auto p-3 max-sm:pb-6 md:pr-5">
        
        {/* Recipient Avatar */}
        <div className="group/field-root flex flex-col gap-y-1 items-start">
          <Label className="font-semibold text-gray-900 text-sm">Recipient Avatar</Label>
          <div className="flex items-center gap-4">
            <button 
              className="group/image-input relative cursor-pointer overflow-hidden h-9 min-w-9 rounded-md bg-background shadow-xs p-px ring ring-inset ring-gray-200 hover:bg-gray-50"
              onClick={triggerFileUpload}
            >
              {textData.recipientAvatar ? (
                <img 
                  src={textData.recipientAvatar} 
                  alt="Profile" 
                  className="size-full object-cover rounded-md"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-gray-400">
                  <Camera className="size-[55%]" />
                </div>
              )}
              <div className="invisible absolute inset-0 z-0 flex items-center justify-center group-hover/image-input:visible group-hover/image-input:bg-black/40 rounded-md">
                <Edit className="size-[45%] text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 text-xs rounded-sm px-2 text-gray-500 border-gray-200"
              onClick={triggerFileUpload}
            >
              Upload
            </Button>
          </div>
        </div>

        {/* Recipient Name */}
        <div className="group/field-root flex flex-col gap-y-1">
          <Label className="font-semibold text-gray-900 text-sm">Recipient Name</Label>
          <Input
            value={textData.recipientName}
            onChange={(e) => updateField("recipientName", e.target.value)}
            placeholder="e.g. Postfully"
            className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0"
          />
        </div>

        {/* Message Input */}
        <div className="group/field-root flex flex-col gap-y-1">
          <Label className="font-semibold text-gray-900 text-sm">Message Input</Label>
          <Input
            value={textData.messageInput}
            onChange={(e) => updateField("messageInput", e.target.value)}
            placeholder="e.g. Postfully.app"
            className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0"
          />
        </div>

        {/* Device Time */}
        <div className="group/field-root flex flex-col gap-y-1">
          <Label className="font-semibold text-gray-900 text-sm">Device Time</Label>
          <Input
            value={textData.deviceTime}
            onChange={(e) => updateField("deviceTime", e.target.value)}
            placeholder="9:41"
            className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0"
          />
        </div>

        {/* Time Format */}
        <div className="group/field-root flex flex-col gap-y-1">
          <Label className="font-semibold text-gray-900 text-sm">Time format</Label>
          <Select value={textData.timeFormat} onValueChange={(value: "12h" | "24h") => updateField("timeFormat", value)}>
            <SelectTrigger className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">Standard (12-hour clock)</SelectItem>
              <SelectItem value="24h">Military (24-hour clock)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mode */}
        <div className="group/field-root flex flex-col gap-y-1">
          <Label className="font-semibold text-gray-900 text-sm">Mode</Label>
          <Select value={textData.mode} onValueChange={(value: "light" | "dark") => updateField("mode", value)}>
            <SelectTrigger className="h-9 bg-background shadow-xs ring ring-inset ring-gray-200 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Messages */}
        <div className="group/field-root flex flex-col gap-y-1">
          <div className="flex w-full flex-col gap-1">
            <Label className="font-semibold text-gray-900 text-sm">Messages</Label>
            <div className="flex w-full flex-col items-start gap-3">
              <div className="flex w-full flex-col gap-2">
                {textData.messages.map((message) => (
                  <div key={message.id} className="shadow-xs relative flex rounded-md px-1 ring ring-gray-200">
                    <button 
                      className="flex h-9 w-7 shrink-0 cursor-pointer items-center justify-center"
                      onClick={() => toggleMessageSender(message.id)}
                    >
                      <div 
                        className="size-[12px] rounded-full"
                        style={{ 
                          backgroundColor: message.sender === "sender" ? "rgb(0, 122, 255)" : "rgb(209, 209, 211)" 
                        }}
                      />
                    </button>
                    <button className="group flex h-9 w-7 shrink-0 cursor-pointer items-center justify-center">
                      <Camera className="size-3.5 text-gray-400 group-hover:text-gray-600" />
                    </button>
                    <textarea
                      className="field-sizing-content min-h-9 w-full resize-none p-2 text-sm placeholder:text-gray-400"
                      placeholder="Type a message..."
                      value={message.text}
                      onChange={(e) => updateMessage(message.id, e.target.value)}
                    />
                    <button 
                      className="group flex h-9 w-7 shrink-0 cursor-pointer items-center justify-center"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px] text-gray-400 group-hover:text-gray-600">
                        <path d="M4.5 9.5C3.125 9.5 2 10.625 2 12C2 13.375 3.125 14.5 4.5 14.5C5.875 14.5 7 13.375 7 12C7 10.625 5.875 9.5 4.5 9.5Z" fill="currentColor"/>
                        <path d="M19.5 9.5C18.125 9.5 17 10.625 17 12C17 13.375 18.125 14.5 19.5 14.5C20.875 14.5 22 13.375 22 12C22 10.625 20.875 9.5 19.5 9.5Z" fill="currentColor"/>
                        <path d="M9.5 12C9.5 10.625 10.625 9.5 12 9.5C13.375 9.5 14.5 10.625 14.5 12C14.5 13.375 13.375 14.5 12 14.5C10.625 14.5 9.5 13.375 9.5 12Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                ))}
                
                {/* Add new message */}
                <div className="shadow-xs relative flex rounded-md px-1 ring ring-gray-200">
                  <button 
                    className="flex h-9 w-7 shrink-0 cursor-pointer items-center justify-center"
                    onClick={() => setNewMessageSender(newMessageSender === "sender" ? "recipient" : "sender")}
                  >
                    <div 
                      className="size-[12px] rounded-full"
                      style={{ 
                        backgroundColor: newMessageSender === "sender" ? "rgb(0, 122, 255)" : "rgb(209, 209, 211)" 
                      }}
                    />
                  </button>
                  <button className="group flex h-9 w-7 shrink-0 cursor-pointer items-center justify-center">
                    <Camera className="size-3.5 text-gray-400 group-hover:text-gray-600" />
                  </button>
                  <textarea
                    className="field-sizing-content min-h-9 w-full resize-none p-2 text-sm placeholder:text-gray-400"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    className="group flex h-9 w-7 shrink-0 cursor-pointer items-center justify-center"
                    onClick={addMessage}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px] text-gray-400 group-hover:text-gray-600">
                      <path d="M4.5 9.5C3.125 9.5 2 10.625 2 12C2 13.375 3.125 14.5 4.5 14.5C5.875 14.5 7 13.375 7 12C7 10.625 5.875 9.5 4.5 9.5Z" fill="currentColor"/>
                      <path d="M19.5 9.5C18.125 9.5 17 10.625 17 12C17 13.375 18.125 14.5 19.5 14.5C20.875 14.5 22 13.375 22 12C22 10.625 20.875 9.5 19.5 9.5Z" fill="currentColor"/>
                      <path d="M9.5 12C9.5 10.625 10.625 9.5 12 9.5C13.375 9.5 14.5 10.625 14.5 12C14.5 13.375 13.375 14.5 12 14.5C10.625 14.5 9.5 13.375 9.5 12Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <Button variant="outline" className="h-7.5 gap-2 px-3 text-sm bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full flex items-center">
                <Plus className="size-4" />
                Add Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
