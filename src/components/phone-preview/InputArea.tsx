
import { FakeTextData } from "@/pages/FakeTextGenerator";

interface InputAreaProps {
  textData: FakeTextData;
}

export const InputArea = ({ textData }: InputAreaProps) => {
  return (
    <div className={`absolute inset-x-0 bottom-0 z-10 flex flex-col font-sf-pro ${
      textData.mode === "dark" ? "bg-black" : "bg-[#FCFCFC]"
    }`}>
      <div className="mb-[23px] flex items-center gap-[10px] px-[11px] pt-[4px]">
        <div className={`flex size-[28px] items-center justify-center rounded-full ${
          textData.mode === "dark" ? "bg-[#48484A]" : "bg-[#E8E7EC]"
        }`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`size-[14px] ${
            textData.mode === "dark" ? "text-[#8E8E93]" : "text-[#7E7F84]"
          }`}>
            <path d="M4 12.2616C4 12.9544 4.56808 13.5189 5.25732 13.5189H11.0074V19.269C11.0074 19.9551 11.5688 20.5232 12.2616 20.5232C12.9544 20.5232 13.5256 19.9551 13.5256 19.269V13.5189H19.269C19.9551 13.5189 20.5232 12.9544 20.5232 12.2616C20.5232 11.5688 19.9551 10.9976 19.269 10.9976H13.5256V5.25732C13.5256 4.56808 12.9544 4 12.2616 4C11.5688 4 11.0074 4.56808 11.0074 5.25732V10.9976H5.25732C4.56808 10.9976 4 11.5688 4 12.2616Z" fill="currentColor"/>
          </svg>
        </div>
        <div className={`flex flex-1 items-center overflow-hidden rounded-full border px-[10px] py-[4.5px] ${
          textData.mode === "dark" 
            ? "border-[#48484A] bg-black" 
            : "border-[#DEDEDE] bg-white"
        }`}>
          <span className={`flex-1 truncate text-[13px] font-sf-pro ${
            textData.mode === "dark" ? "text-[#8E8E93]" : "text-[#C1C2C4]"
          }`}>
            {textData.messageInput || "Postfully.app"}
          </span>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`size-[16px] ${
            textData.mode === "dark" ? "text-[#8E8E93]" : "text-[#ACB4B7]"
          }`}>
            <path d="M5 11.6945C5 15.4993 7.52124 18.0717 11.0854 18.4399V20.0892H7.87046C7.3483 20.0892 6.90515 20.5177 6.90515 21.0491C6.90515 21.5718 7.3483 22 7.87046 22H16.1267C16.6517 22 17.0948 21.5718 17.0948 21.0491C17.0948 20.5177 16.6517 20.0892 16.1267 20.0892H12.9146V18.4399C16.4848 18.0717 19 15.4993 19 11.6945V9.95811C19 9.42964 18.574 9.02132 18.0463 9.02132C17.5213 9.02132 17.0838 9.42964 17.0838 9.95811V11.6294C17.0838 14.6721 15.0013 16.6593 12.003 16.6593C8.99865 16.6593 6.91616 14.6721 6.91616 11.6294V9.95811C6.91616 9.42964 6.48465 9.02132 5.95086 9.02132C5.42309 9.02132 5 9.42964 5 9.95811V11.6945ZM12.003 14.8612C13.8096 14.8612 15.2081 13.4822 15.2081 11.4521V5.41195C15.2081 3.37859 13.8096 2 12.003 2C10.1876 2 8.78063 3.37576 8.78063 5.40911V11.4521C8.78063 13.4822 10.1876 14.8612 12.003 14.8612Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      {/* Bottom bar with rounded corners */}
      <div className={`flex items-center justify-center pb-[6px] ${
        textData.mode === "dark" ? "bg-black" : "bg-[#FCFCFC]"
      }`}>
        <div className={`h-[4px] w-[112px] rounded-full ${
          textData.mode === "dark" ? "bg-white" : "bg-black"
        }`}></div>
      </div>
    </div>
  );
};
