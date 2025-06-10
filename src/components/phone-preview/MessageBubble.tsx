
interface MessageBubbleProps {
  message: string;
  sender: "sender" | "recipient";
  mode: "light" | "dark";
}

export const MessageBubble = ({ message, sender, mode }: MessageBubbleProps) => {
  return (
    <div className="flex flex-col gap-[2px] pb-[6px]">
      <div className={`flex flex-col gap-[2px] ${sender === "sender" ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-[6px]">
          <div className={`relative flex max-w-[198px] break-words rounded-[14px] px-[10px] py-[6px] ${
            sender === "sender" 
              ? "bg-[#007AFF]" 
              : mode === "dark" ? "bg-[#26252a]" : "bg-[#E9E9EB]"
          }`}>
            <span className={`w-full whitespace-pre-wrap text-[13px]/4 ${
              sender === "sender" 
                ? "text-white" 
                : mode === "dark" ? "text-white" : "text-black"
            }`}>
              {message}
            </span>
            <svg 
              viewBox="0 0 17 21" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className={`absolute bottom-[-1px] h-[18px] ${
                sender === "sender" 
                  ? "right-[-4.2820px] text-[#007AFF]" 
                  : "left-[-4.2578px] scale-x-[-1]"
              } ${
                sender === "recipient" 
                  ? (mode === "dark" ? "text-[#26252a]" : "text-[#E9E9EB]")
                  : "text-[#007AFF]"
              }`}
            >
              <path d="M16.8869 20.1846C11.6869 20.9846 6.55352 18.1212 4.88685 16.2879C6.60472 12.1914 -4.00107 2.24186 2.99893 2.24148C4.61754 2.24148 6 -1.9986 11.8869 1.1846C11.9081 2.47144 11.8869 6.92582 11.8869 7.6842C11.8869 18.1842 17.8869 19.5813 16.8869 20.1846Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
