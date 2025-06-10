
import { FakeTextData } from "@/pages/FakeTextGenerator";
import { StatusBar } from "./StatusBar";
import { Header } from "./Header";
import { MessagesArea } from "./MessagesArea";
import { InputArea } from "./InputArea";

interface PhonePreviewProps {
  textData: FakeTextData;
}

export const PhonePreview = ({ textData }: PhonePreviewProps) => {
  return (
    <div className={`relative flex h-[682px] w-[314px] flex-col font-[Inter,_sans-serif] max-sm:scale-80 overflow-hidden rounded-2xl border border-gray-100 shadow-lg ${
      textData.mode === "dark" ? "bg-black" : "bg-white"
    }`} style={{ fontFeatureSettings: 'normal' }}>
      
      {/* Status Bar and Header - Combined gray section */}
      <div className={`relative ${
        textData.mode === "dark" ? "bg-black" : "bg-[#F6F5F6]"
      }`}>
        <StatusBar textData={textData} />
        
        {/* Separator line between status bar and header - only visible in light mode */}
        {textData.mode === "light" && (
          <svg className="absolute inset-x-0 z-10" height="0.5" width="100%" style={{ top: '110px' }}>
            <line className="stroke-[#B2B2B2]" x1="0" y1="0" x2="100%" y2="0" strokeWidth="1"/>
          </svg>
        )}

        <Header textData={textData} />
        
        {/* Separator line at bottom - only visible in light mode */}
        {textData.mode === "light" && (
          <svg className="absolute inset-x-0 bottom-0" height="0.5" width="100%">
            <line className="stroke-[#B2B2B2]" x1="0" y1="0" x2="100%" y2="0" strokeWidth="1"/>
          </svg>
        )}
      </div>

      <MessagesArea textData={textData} />
      <InputArea textData={textData} />
    </div>
  );
};
