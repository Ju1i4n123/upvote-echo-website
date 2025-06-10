
import { useState } from "react";
import { Header } from "@/components/Header";
import { FakeTextForm } from "@/components/FakeTextForm";
import { FakeTextPreview } from "@/components/FakeTextPreview";

export interface Message {
  id: string;
  text: string;
  sender: "sender" | "recipient";
}

export interface FakeTextData {
  recipientAvatar: string;
  recipientName: string;
  messageInput: string;
  deviceTime: string;
  timeFormat: "12h" | "24h";
  mode: "light" | "dark";
  messages: Message[];
}

const FakeTextGenerator = () => {
  const [textData, setTextData] = useState<FakeTextData>({
    recipientAvatar: "",
    recipientName: "",
    messageInput: "",
    deviceTime: "9:41",
    timeFormat: "12h",
    mode: "light",
    messages: [
      {
        id: "1",
        text: "Did you see that viral video of the cat playing piano? 😂",
        sender: "sender"
      },
      {
        id: "2", 
        text: "OMG yes! I can't believe it got 1 million views in one day! 🎹🐱",
        sender: "recipient"
      }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fake Text Generator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create custom text messages for your text story videos. Free to use, no email required.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <FakeTextForm textData={textData} setTextData={setTextData} />
          <FakeTextPreview textData={textData} />
        </div>
      </div>
    </div>
  );
};

export default FakeTextGenerator;
