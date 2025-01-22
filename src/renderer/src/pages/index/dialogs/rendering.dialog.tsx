import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/Dialog";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Step, STEPS } from "./dialog.constants";
import { ListType, Song } from "@renderer/types/list.types";
import { BeatLoader } from "react-spinners";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffleSongs(songs: Song[]) {
  const newSongs = [...songs];
  for (let i = newSongs.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at index i and j
    [newSongs[i], newSongs[j]] = [newSongs[j], newSongs[i]];
  }
  return newSongs;
}

type RenderingHtmlDialogProps = {
  songs: Song[];
  outputDir: string;
  author: string;
  unembeddableIds: Array<string>;
  failedIds: Array<string>;
  isRandomized: boolean;
  setStep: Dispatch<SetStateAction<Step>>;
  trivialType: ListType;
};

export default function RenderingHtmlDialog({
  songs,
  outputDir,
  author,
  unembeddableIds,
  failedIds,
  isRandomized,
  setStep,
  trivialType
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
      songs: isRandomized ? shuffleSongs(songs) : songs,
      author,
      unembeddableIds,
      trivialType,
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
