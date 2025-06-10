
import { Button } from "@/components/ui/button";
import { FakeTextData } from "@/pages/FakeTextGenerator";
import { Lightbulb } from "lucide-react";
import { PhonePreview } from "./phone-preview/PhonePreview";

interface FakeTextPreviewProps {
  textData: FakeTextData;
}

export const FakeTextPreview = ({ textData }: FakeTextPreviewProps) => {
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
        <PhonePreview textData={textData} />
        
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
