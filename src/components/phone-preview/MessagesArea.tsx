
import { FakeTextData } from "@/pages/FakeTextGenerator";
import { MessageBubble } from "./MessageBubble";

interface MessagesAreaProps {
  textData: FakeTextData;
}

export const MessagesArea = ({ textData }: MessagesAreaProps) => {
  return (
    <div className={`no-scrollbar relative flex flex-1 flex-col overflow-auto px-[11px] pb-[81px] pt-[15px] ${
      textData.mode === "dark" ? "bg-[#000000]" : "bg-white"
    }`}>
      <div className="flex justify-center pb-[6px] pt-[11px] text-center">
        <span className="text-[9px] font-medium text-[#8A898E]">Today 11:32 AM</span>
      </div>
      
      {/* Default messages */}
      <MessageBubble 
        message="Did you see that viral video of the cat playing piano? 😂"
        sender="sender"
        mode={textData.mode}
      />

      <MessageBubble 
        message="OMG yes! I can't believe it got 1 million views in one day! 🎹🐱"
        sender="recipient"
        mode={textData.mode}
      />

      {/* Additional messages */}
      {textData.messages.slice(2).map((message) => (
        <MessageBubble
          key={message.id}
          message={message.text}
          sender={message.sender}
          mode={textData.mode}
        />
      ))}
    </div>
  );
};
