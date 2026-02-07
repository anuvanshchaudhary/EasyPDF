"use client";
import { forwardRef } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const UploadFormInput = forwardRef<
  HTMLFormElement,
  UploadFormInputProps
>(({ onSubmit, isLoading }, ref) => {
  return (
    <form ref={ref} className="flex flex-col gap-6 w-full" onSubmit={onSubmit}>

      {/* UPLOAD ZONE */}
      <div
        className="relative h-96 border-4 border-black border-dashed bg-white flex flex-col items-center justify-center hover:bg-gray-50 transition-colors group overflow-hidden"
      >
        {/* Hidden File Input Overlay */}
        <Input
          id="file"
          type="file"
          name="file"
          accept="application/pdf"
          required
          className={cn(
            "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 file:cursor-pointer",
            isLoading && "pointer-events-none"
          )}
          disabled={isLoading}
          onChange={(e) => {
            if (e.target.files?.length) {
              // Auto-submit on file selection if desired, or just show preview. 
              // For now, consistent with original behavior, user must select file then click button? 
              // Original usage: Input + Button "Upload your PDF".
              // Prompt usage: "Select_Source_File".
              // Since this zone is clickable, we need a submit trigger.
              // The minimal change is to let user select file, but then they need a submit button?
              // The prompts logic: "When a file is selected show a loading bar".
              // To keep it simple and robust: Auto-submit on change?
              // OR: Add a visible submit button below OR make the zone submit `onChange` (triggering form submit programmatically).
              // Let's try to auto-submit on change to be "magical" like "Select Source File" -> "Processing".
              // `if (ref && 'current' in ref && ref.current) ref.current.requestSubmit();`
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />

        {/* Peeling Sticker Effect */}
        <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-xl rotate-3 group-hover:rotate-6 transition-transform border-2 border-transparent group-hover:border-black group-hover:bg-white group-hover:text-black z-10 pointer-events-none">
          DRAG_&_DROP
        </div>

        {!isLoading ? (
          <div className="text-center space-y-4 pointer-events-none">
            <div className="text-8xl font-black">+</div>
            <p className="text-2xl uppercase font-bold underline decoration-4">Select_Source_File</p>
            <p className="text-sm font-mono mt-2">(Confirms on selection)</p>
          </div>
        ) : (
          <div className="w-full px-12 space-y-4 z-10 pointer-events-none">
            <div className="flex justify-between text-xl font-bold uppercase">
              <span>Uploading</span>
              <span>[84%]</span>
            </div>
            {/* Block Progress Bar */}
            <div className="w-full border-4 border-black h-12 p-1 flex gap-1">
              {[...Array(15)].map((_, i) => (
                <div key={i} className={`h-full flex-1 ${i < 12 ? 'bg-black' : 'bg-transparent'}`}></div>
              ))}
            </div>
            <p className="text-left animate-pulse font-mono">Compiling modules...</p>
          </div>
        )}
      </div>

      {/* Manual Submit Button (Backup if JS auto-submit fails or user prefers) - HIDDEN if functional auto-submit works, but let's keep a footer status instead */}
      <div className="mt-2 border-t-4 border-black pt-4 flex justify-between font-bold text-lg font-mono">
        <span>SYSTEM: ONLINE</span>
        <span className="animate-pulse bg-black text-white px-2">{isLoading ? 'PROCESSING...' : 'IDLE'}</span>
      </div>
    </form>
  );
});

UploadFormInput.displayName = "UploadFormInput";

export default UploadFormInput;
