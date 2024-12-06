/* eslint-disable react/no-unescaped-entities */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@renderer/components/ui/Dialog";

import { Label } from "@renderer/components/ui/Label";
import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import { Step, STEPS } from "./dialog.constants";
import { Progress } from "@renderer/components/ui/Progress";

type DownloadProgressDialogProps = {
  outputDir: string;
  unembeddableIds: Array<string>;
  setFailedIds: Dispatch<SetStateAction<Array<string>>>;
  setStep: Dispatch<SetStateAction<Step>>;
};

type HandleDownloadCompletedBody = {
  songId: string;
  isDownloaded: boolean;
};

export default function DownloadProgressDialog({
  unembeddableIds,
  outputDir,
  setFailedIds,
  setStep
}: DownloadProgressDialogProps) {
  const [count, setCount] = useState({ valid: 0, invalid: 0 });

  const downloadAudio = async (songId: string) => {
    let lastListenerCleanup: (() => void) | null = null;

    return new Promise<boolean>((resolve) => {
      const handleDownloadCompleted = (_, body: HandleDownloadCompletedBody) => {
        const { songId, isDownloaded } = body;

        if (!isDownloaded) {
          setFailedIds((prev) => [...prev, songId]);
        }

        setCount((oldCount) => {
          const newCount = { ...oldCount };
          if (isDownloaded) {
            newCount.valid += 1;
          } else {
            newCount.invalid += 1;
          }
          return newCount;
        });

        resolve(isDownloaded);
      };

      lastListenerCleanup = window.electron.ipcRenderer.once(
        "generate:onDownloadCompleted",
        handleDownloadCompleted
      );

      window.electron.ipcRenderer.send("generate:download", { songId, outputDir });
    })
      .catch(() => false)
      .finally(() => lastListenerCleanup?.());
  };

  useEffect(() => {
    const downloadAudios = async () => {
      for (const songId of unembeddableIds) {
        await downloadAudio(songId);
      }
    };

    downloadAudios().then(() => setStep(STEPS.RENDERING));
  }, []);

  const downloadedSongs = count.valid + count.invalid;
  const percentage = (downloadedSongs / unembeddableIds.length) * 100;

  let result: ReactElement | null = null;
  if (downloadedSongs === unembeddableIds.length) {
    result = (
      <p>
        Valid: {count.valid}. Invalid {count.invalid}.
      </p>
    );
  }
  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Downloading songs</DialogTitle>
          <DialogDescription>
            Downloading the songs that couldn't be embedded using Youtube... {result}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Progress value={percentage} />
            <Label>
              Downloaded {downloadedSongs}/{unembeddableIds.length} ({percentage.toFixed(2)}%)
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
