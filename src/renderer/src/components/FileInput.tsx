import React, { useRef } from "react";
import { cn } from "@renderer/lib/utils"; // Assuming you're using some utility function for classnames

interface FileInputProps extends React.HTMLAttributes<HTMLButtonElement> {
  text?: string;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

const FileInput = React.forwardRef<HTMLButtonElement, FileInputProps>(
  ({ className, text = "Choose!", onFileChange, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
      inputRef.current?.click(); // Trigger hidden input
    };

    return (
      <>
        <button
          ref={ref}
          className={cn(
            "inline h-full px-5 border-2 border-input font-mono rounded-md bg-background text-sm ring-offset-background w-52 cursor-pointer font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-200 hover:bg-opacity-5",
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {text}
        </button>
        <input
          accept={props.accept}
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={onFileChange}
        />
      </>
    );
  }
);

// Add displayName for better debugging
FileInput.displayName = "FileInput";

export default FileInput;
