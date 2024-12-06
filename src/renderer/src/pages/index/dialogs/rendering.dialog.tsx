import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/Dialog";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Step, STEPS } from "./dialog.constants";
import { AnimeSong } from "@renderer/types/list.types";
import { BeatLoader } from "react-spinners";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type RenderingHtmlDialogProps = {
  songs: AnimeSong[];
  outputDir: string;
  author: string;
  unembeddableIds: Array<string>;
  failedIds: Array<string>;
  setStep: Dispatch<SetStateAction<Step>>;
};

export default function RenderingHtmlDialog({
  songs,
  outputDir,
  author,
  unembeddableIds,
  failedIds,
  setStep
}: RenderingHtmlDialogProps) {
  useEffect(() => {
    const handleTrivialGeneration = async () => {
      await sleep(1500);
      setStep(STEPS.COMPLETED);
    };

    const trivialCompletedListenerCleanup = window.electron.ipcRenderer.once(
      "generate:trivial:completed",
      handleTrivialGeneration
    );

    window.electron.ipcRenderer.send("generate:trivial", {
      outputDir,
      songs,
      author,
      unembeddableIds,
      failedIds
    });

    return trivialCompletedListenerCleanup;
  }, []);

  return (
    <Dialog open>
      <DialogContent
        className="[&>button]:hidden sm:max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Generating Trivial...</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <BeatLoader color="#ffffff" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
