
import { Button } from "@/components/ui/button";
import { FakeTextData } from "@/pages/FakeTextGenerator";
import { Lightbulb } from "lucide-react";

interface FakeTextPreviewProps {
  textData: FakeTextData;
}

export const FakeTextPreview = ({ textData }: FakeTextPreviewProps) => {
  const formatTime = (time: string) => {
    if (textData.timeFormat === "12h") {
      return time.includes("AM") || time.includes("PM") ? time : time + " AM";
    }
    return time;
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-xl bg-gray-50 ring ring-gray-100">
      {/* Header with Reset and Download */}
      <div className="flex w-full justify-end space-x-1.5 p-3">
        <Button variant="outline" size="sm" className="h-7.5 text-sm rounded-full border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-500">
          Reset
        </Button>
        <Button size="sm" className="h-7.5 text-sm rounded-full bg-blue-600 hover:bg-blue-700 text-white">
          Download
        </Button>
      </div>

      {/* Phone Preview */}
      <div className="flex flex-1 flex-col justify-center gap-3">
        <div className={`relative flex h-[684px] w-[316px] flex-col font-[Inter,_sans-serif] max-sm:scale-80 overflow-hidden rounded-2xl border border-gray-100 shadow-lg ${
          textData.mode === "dark" ? "bg-black" : "bg-white"
        }`} style={{ fontFeatureSettings: 'normal' }}>
          
          {/* Status Bar */}
          <div className={`absolute inset-x-0 top-0 z-10 pb-[5px] pt-[13px] ${
            textData.mode === "dark" ? "bg-black" : "bg-[#F6F5F6]"
          }`}>
            <div className={`flex items-center justify-between pl-[31px] pr-[25px] ${
              textData.mode === "dark" ? "text-white" : "text-black"
            }`}>
              <span className="text-[14px] font-semibold">{formatTime(textData.deviceTime)}</span>
              <div className="flex items-center gap-[5px]">
                {/* Signal, WiFi, Battery icons */}
                <svg viewBox="0 0 27 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[10px]">
                  <path d="M22.959 16.9531H25.332C25.9375 16.9531 26.3477 16.5234 26.3477 15.8887V1.06445C26.3477 0.429688 25.9375 0 25.332 0H22.959C22.3535 0 21.9336 0.429688 21.9336 1.06445V15.8887C21.9336 16.5234 22.3535 16.9531 22.959 16.9531Z" fill="currentColor"/>
                  <path d="M15.6543 16.9531H18.0078C18.6133 16.9531 19.0332 16.5234 19.0332 15.8887V4.92188C19.0332 4.28711 18.6133 3.85742 18.0078 3.85742H15.6543C15.0391 3.85742 14.6289 4.28711 14.6289 4.92188V15.8887C14.6289 16.5234 15.0391 16.9531 15.6543 16.9531Z" fill="currentColor"/>
                  <path d="M8.33984 16.9531H10.6934C11.3086 16.9531 11.7188 16.5234 11.7188 15.8887V8.45703C11.7188 7.82227 11.3086 7.39258 10.6934 7.39258H8.33984C7.72461 7.39258 7.31445 7.82227 7.31445 8.45703V15.8887C7.31445 16.5234 7.72461 16.9531 8.33984 16.9531Z" fill="currentColor"/>
                  <path d="M1.02539 16.9531H3.37891C3.99414 16.9531 4.4043 16.5234 4.4043 15.8887V11.5039C4.4043 10.8691 3.99414 10.4492 3.37891 10.4492H1.02539C0.410156 10.4492 0 10.8691 0 11.5039V15.8887C0 16.5234 0.410156 16.9531 1.02539 16.9531Z" fill="currentColor"/>
                </svg>
                <svg viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[11px]">
                  <path d="M1.4761 6.84972C1.67141 7.03538 1.94485 7.03538 2.13039 6.83996C4.53274 4.28963 7.6968 2.94117 11.2417 2.94117C14.8062 2.94117 17.9898 4.2994 20.3726 6.84972C20.5484 7.02561 20.812 7.01584 21.0073 6.83018L22.355 5.48174C22.5308 5.30584 22.521 5.09088 22.3843 4.92477C20.0894 2.09106 15.773 0.00976562 11.2417 0.00976562C6.72024 0.00976562 2.3843 2.09106 0.0991432 4.92477C-0.0375756 5.09088 -0.0375756 5.30584 0.12844 5.48174L1.4761 6.84972Z" fill="currentColor"/>
                  <path d="M5.52878 10.9341C5.74362 11.1393 6.0073 11.11 6.20261 10.8951C7.37448 9.59548 9.28855 8.64766 11.2416 8.65743C13.2143 8.64766 15.1283 9.6248 16.3197 10.9244C16.4955 11.1295 16.7397 11.1198 16.9545 10.9244L18.4682 9.4196C18.6244 9.26326 18.644 9.04829 18.4975 8.87241C17.0229 7.0647 14.2885 5.70648 11.2416 5.70648C8.1948 5.70648 5.46042 7.0647 3.98581 8.87241C3.83933 9.04829 3.84909 9.24371 4.01511 9.4196L5.52878 10.9341Z" fill="currentColor"/>
                  <path d="M11.2417 16.2498C11.4566 16.2498 11.6421 16.1521 12.023 15.7808L14.4058 13.4942C14.5523 13.3477 14.5913 13.1327 14.4546 12.9568C13.8198 12.136 12.6187 11.4227 11.2417 11.4227C9.82571 11.4227 8.62453 12.1654 7.98977 13.0155C7.89211 13.1719 7.93117 13.3477 8.08742 13.4942L10.4605 15.7808C10.8413 16.1423 11.0269 16.2498 11.2417 16.2498Z" fill="currentColor"/>
                </svg>
                <svg viewBox="0 0 29 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[11px]">
                  <path d="M5.02041 12.6861H20.1843C21.9541 12.6861 23.2181 12.4875 24.1203 11.5853C25.0256 10.683 25.2114 9.4416 25.2114 7.66573V5.03555C25.2114 3.25967 25.0256 2.01221 24.1203 1.11299C23.215 0.210742 21.9541 0.0151367 20.1843 0.0151367H4.96455C3.26338 0.0151367 1.99639 0.213769 1.09414 1.11904C0.188867 2.02129 0 3.27246 0 4.97295V7.66573C0 9.4416 0.18584 10.686 1.08809 11.5853C1.99639 12.4875 3.2543 12.6861 5.02041 12.6861ZM4.76279 11.4771C3.61162 11.4771 2.5751 11.295 1.97334 10.7C1.38135 10.0982 1.20899 9.07754 1.20899 7.92334V4.83076C1.20899 3.62979 1.38135 2.59697 1.97031 1.99522C2.57207 1.39043 3.62442 1.2211 4.82236 1.2211H20.4486C21.5998 1.2211 22.6363 1.40625 23.2283 1.99824C23.8301 2.6 24.0024 3.61397 24.0024 4.76817V7.92334C24.0024 9.07754 23.8271 10.0982 23.2283 10.7C22.6363 11.298 21.5998 11.4771 20.4486 11.4771H4.76279ZM26.3428 8.72823C27.0658 8.68243 28.0435 7.75059 28.0435 6.34727C28.0435 4.94766 27.0658 4.01582 26.3428 3.97002V8.72823Z" fill="currentColor" opacity="0.25"/>
                  <path d="M4.4208 10.4745H15.5968C16.4825 10.4745 17.0033 10.3375 17.3313 10.0065C17.6652 9.67256 17.8022 9.14873 17.8022 8.27207V4.42617C17.8022 3.54346 17.6652 3.02569 17.3373 2.6917C17.0033 2.36377 16.4667 2.22373 15.5968 2.22373H4.48037C3.53809 2.22373 2.99844 2.36075 2.68028 2.68867C2.35235 3.02266 2.21534 3.56231 2.21534 4.48203V8.27207C2.21534 9.15781 2.35235 9.67256 2.68028 10.0065C3.01426 10.3345 3.55088 10.4745 4.4208 10.4745Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mt-[50px]">
            <div className="relative flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-[6px] size-[25px] text-[#007AFF]">
                <path d="M7.5 11.7486C7.5 12.0987 7.62428 12.39 7.91163 12.6718L14.5496 19.1656C14.7703 19.3921 15.0397 19.5 15.36 19.5C16.0116 19.5 16.535 18.9852 16.535 18.3419C16.535 18.016 16.3962 17.7248 16.1649 17.4931L10.2632 11.7459L16.1649 6.00414C16.399 5.76971 16.535 5.47528 16.535 5.15812C16.535 4.51201 16.0116 4 15.36 4C15.0369 4 14.7703 4.10782 14.5496 4.32854L7.91163 10.8254C7.62702 11.1014 7.50274 11.3958 7.5 11.7486Z" fill="currentColor"/>
              </svg>
              <div className="size-[40px] overflow-hidden rounded-full">
                <div className="flex size-full items-center justify-center bg-gradient-to-b from-[#A5ABB9] to-[#858994] text-center">
                  <span className="text-[18px] font-semibold text-white">
                    {textData.recipientName ? textData.recipientName.charAt(0).toUpperCase() : "P"}
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-[17px] size-[25px] text-[#007AFF]">
                <path d="M4.82117 19H13.7202C15.798 19 17.0414 17.7908 17.0414 15.7129V8.27859C17.0414 6.20925 15.798 5 13.7202 5H4.82117C2.83699 5 1.5 6.20925 1.5 8.27859V15.7129C1.5 17.7908 2.74332 19 4.82117 19ZM5.05962 17.7141C3.66302 17.7141 2.87105 16.9903 2.87105 15.517V8.48296C2.87105 7.00121 3.66302 6.27737 5.05962 6.27737H13.4818C14.8699 6.27737 15.6703 7.00121 15.6703 8.48296V15.517C15.6703 16.9903 14.8699 17.7141 13.4818 17.7141H5.05962ZM16.8455 9.61557V11.2336L20.899 7.88686C20.9756 7.82725 21.0267 7.78467 21.1034 7.78467C21.2056 7.78467 21.2481 7.86983 21.2481 7.98904V16.011C21.2481 16.1302 21.2056 16.2068 21.1034 16.2068C21.0267 16.2068 20.9756 16.1642 20.899 16.1131L16.8455 12.7664V14.3759L20.2603 17.2713C20.6009 17.5523 20.9756 17.7481 21.3248 17.7481C22.0742 17.7481 22.5681 17.1947 22.5681 16.4027V7.59733C22.5681 6.80535 22.0742 6.25183 21.3248 6.25183C20.9756 6.25183 20.6009 6.44769 20.2603 6.72871L16.8455 9.61557Z" fill="currentColor"/>
              </svg>
            </div>
            <div className={`mx-auto mt-[2.5px] flex max-w-[65%] items-center justify-center overflow-hidden`}>
              <span className={`truncate text-[9px] ${textData.mode === "dark" ? "text-white" : "text-black"}`}>
                {textData.recipientName || "Postfully"}
              </span>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[9px] text-[#C1C1C3]">
                <path d="M16.535 11.7486C16.5295 11.3958 16.402 11.1014 16.1174 10.8254L9.48535 4.32854C9.25873 4.10782 8.99214 4 8.66634 4C8.02338 4 7.5 4.51201 7.5 5.15812C7.5 5.47528 7.63016 5.76971 7.8642 6.00414L13.7659 11.7459L7.8642 17.4931C7.6329 17.7248 7.5 18.016 7.5 18.3419C7.5 18.9852 8.02338 19.5 8.66634 19.5C8.98665 19.5 9.25873 19.3921 9.48535 19.1656L16.1174 12.6718C16.4048 12.39 16.535 12.0987 16.535 11.7486Z" fill="currentColor"/>
              </svg>
            </div>
            <svg className="absolute inset-x-0 bottom-0" height="0.5" width="100%">
              <line className="stroke-[#B2B2B2]" x1="0" y1="0" x2="100%" y2="0" strokeWidth="1"/>
            </svg>
          </div>

          {/* Messages */}
          <div className={`no-scrollbar relative flex flex-1 flex-col overflow-auto px-[11px] pb-[81px] pt-[15px] ${
            textData.mode === "dark" ? "bg-black" : "bg-white"
          }`}>
            <div className="flex justify-center pb-[6px] pt-[11px] text-center">
              <span className="text-[9px] font-medium text-[#8A898E]">Today 11:32 AM</span>
            </div>
            
            <div className="flex flex-col gap-[2px] pb-[6px]">
              <div className="flex flex-col gap-[2px] items-end">
                <div className="flex items-center gap-[6px]">
                  <div className="relative flex max-w-[198px] break-words rounded-[14px] px-[10px] py-[6px] bg-[#007AFF]">
                    <span className="w-full whitespace-pre-wrap text-[13px]/4 text-white">Did you see that viral video of the cat playing piano? 😂</span>
                    <svg viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-[-1px] h-[18px] right-[-4.2820px] text-[#007AFF]">
                      <path d="M16.8869 20.1846C11.6869 20.9846 6.55352 18.1212 4.88685 16.2879C6.60472 12.1914 -4.00107 2.24186 2.99893 2.24148C4.61754 2.24148 6 -1.9986 11.8869 1.1846C11.9081 2.47144 11.8869 6.92582 11.8869 7.6842C11.8869 18.1842 17.8869 19.5813 16.8869 20.1846Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[2px] pb-[6px]">
              <div className="flex flex-col gap-[2px] items-start">
                <div className="flex items-center gap-[6px]">
                  <div className="relative flex max-w-[198px] break-words rounded-[14px] px-[10px] py-[6px] bg-[#E9E9EB]">
                    <span className="w-full whitespace-pre-wrap text-[13px]/4 text-black">OMG yes! I can't believe it got 1 million views in one day! 🎹🐱</span>
                    <svg viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-[-1px] h-[18px] left-[-4.2578px] scale-x-[-1] text-[#E9E9EB]">
                      <path d="M16.8869 20.1846C11.6869 20.9846 6.55352 18.1212 4.88685 16.2879C6.60472 12.1914 -4.00107 2.24186 2.99893 2.24148C4.61754 2.24148 6 -1.9986 11.8869 1.1846C11.9081 2.47144 11.8869 6.92582 11.8869 7.6842C11.8869 18.1842 17.8869 19.5813 16.8869 20.1846Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {textData.messages.slice(2).map((message, index) => (
              <div key={message.id} className="flex flex-col gap-[2px] pb-[6px]">
                <div className={`flex flex-col gap-[2px] ${message.sender === "sender" ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-[6px]">
                    <div className={`relative flex max-w-[198px] break-words rounded-[14px] px-[10px] py-[6px] ${
                      message.sender === "sender" 
                        ? "bg-[#007AFF]" 
                        : textData.mode === "dark" ? "bg-[#2C2C2E]" : "bg-[#E9E9EB]"
                    }`}>
                      <span className={`w-full whitespace-pre-wrap text-[13px]/4 ${
                        message.sender === "sender" 
                          ? "text-white" 
                          : textData.mode === "dark" ? "text-white" : "text-black"
                      }`}>
                        {message.text}
                      </span>
                      <svg 
                        viewBox="0 0 17 21" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`absolute bottom-[-1px] h-[18px] ${
                          message.sender === "sender" 
                            ? "right-[-4.2820px] text-[#007AFF]" 
                            : "left-[-4.2578px] scale-x-[-1]"
                        } ${
                          message.sender === "recipient" 
                            ? (textData.mode === "dark" ? "text-[#2C2C2E]" : "text-[#E9E9EB]")
                            : "text-[#007AFF]"
                        }`}
                      >
                        <path d="M16.8869 20.1846C11.6869 20.9846 6.55352 18.1212 4.88685 16.2879C6.60472 12.1914 -4.00107 2.24186 2.99893 2.24148C4.61754 2.24148 6 -1.9986 11.8869 1.1846C11.9081 2.47144 11.8869 6.92582 11.8869 7.6842C11.8869 18.1842 17.8869 19.5813 16.8869 20.1846Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className={`absolute inset-x-0 bottom-0 z-10 flex flex-col ${
            textData.mode === "dark" ? "bg-black" : "bg-[#FCFCFC]"
          }`}>
            <div className="mb-[23px] flex items-center gap-[10px] px-[11px] pt-[4px]">
              <div className="flex size-[28px] items-center justify-center rounded-full bg-[#E8E7EC] text-[#7E7F84]">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[14px]">
                  <path d="M4 12.2616C4 12.9544 4.56808 13.5189 5.25732 13.5189H11.0074V19.269C11.0074 19.9551 11.5688 20.5232 12.2616 20.5232C12.9544 20.5232 13.5256 19.9551 13.5256 19.269V13.5189H19.269C19.9551 13.5189 20.5232 12.9544 20.5232 12.2616C20.5232 11.5688 19.9551 10.9976 19.269 10.9976H13.5256V5.25732C13.5256 4.56808 12.9544 4 12.2616 4C11.5688 4 11.0074 4.56808 11.0074 5.25732V10.9976H5.25732C4.56808 10.9976 4 11.5688 4 12.2616Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex flex-1 items-center overflow-hidden rounded-full border px-[10px] py-[4.5px] border-[#DEDEDE]">
                <span className="flex-1 truncate text-[13px] text-[#C1C2C4]">
                  {textData.messageInput || "Postfully.app"}
                </span>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[16px] text-[#ACB4B7]">
                  <path d="M5 11.6945C5 15.4993 7.52124 18.0717 11.0854 18.4399V20.0892H7.87046C7.3483 20.0892 6.90515 20.5177 6.90515 21.0491C6.90515 21.5718 7.3483 22 7.87046 22H16.1267C16.6517 22 17.0948 21.5718 17.0948 21.0491C17.0948 20.5177 16.6517 20.0892 16.1267 20.0892H12.9146V18.4399C16.4848 18.0717 19 15.4993 19 11.6945V9.95811C19 9.42964 18.574 9.02132 18.0463 9.02132C17.5213 9.02132 17.0838 9.42964 17.0838 9.95811V11.6294C17.0838 14.6721 15.0013 16.6593 12.003 16.6593C8.99865 16.6593 6.91616 14.6721 6.91616 11.6294V9.95811C6.91616 9.42964 6.48465 9.02132 5.95086 9.02132C5.42309 9.02132 5 9.42964 5 9.95811V11.6945ZM12.003 14.8612C13.8096 14.8612 15.2081 13.4822 15.2081 11.4521V5.41195C15.2081 3.37859 13.8096 2 12.003 2C10.1876 2 8.78063 3.37576 8.78063 5.40911V11.4521C8.78063 13.4822 10.1876 14.8612 12.003 14.8612Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div className="flex items-center justify-center pb-[6px]">
              <div className="h-[4px] w-[112px] rounded-full bg-black"></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-3 text-gray-400">
            <path d="M12 16V11M12.5 8C12.5 8.27614 12.2761 8.5 12 8.5C11.7239 8.5 11.5 8.27614 11.5 8M12.5 8C12.5 7.72386 12.2761 7.5 12 7.5C11.7239 7.5 11.5 7.72386 11.5 8M12.5 8H11.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs text-gray-400">Preview is scrollable</span>
        </div>
      </div>

      {/* Suggest Feature Button */}
      <div className="flex justify-center p-3">
        <Button variant="outline" className="h-7.5 text-sm rounded-full border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-500">
          <Lightbulb className="size-4" />
          Suggest a feature
        </Button>
      </div>
    </div>
  );
};
