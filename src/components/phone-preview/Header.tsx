
import { FakeTextData } from "@/pages/FakeTextGenerator";

interface HeaderProps {
  textData: FakeTextData;
}

export const Header = ({ textData }: HeaderProps) => {
  return (
    <div className="mt-[13px] pb-[3px]">
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
    </div>
  );
};
