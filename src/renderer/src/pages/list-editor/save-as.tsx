import { Button } from "@renderer/components/ui/Button";
import { Folder, Upload } from "lucide-react";

type SaveAsProps = {
  button: string;
  path: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function openFolder(path: string) {
  window.api.shell.openPath(path);
}

export function SaveAs({ button, path, onClick }: SaveAsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Button id="save-as" variant="outline" onClick={onClick} className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          {button}
        </Button>

        {path && (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open file explorer"
              onClick={() => openFolder(window.api.path.dirname(path))}
            >
              <Folder className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
