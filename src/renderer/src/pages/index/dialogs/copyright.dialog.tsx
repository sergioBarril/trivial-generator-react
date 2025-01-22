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
import { Song } from "@renderer/types/list.types";

import { useYoutubeContext } from "@renderer/hooks/useYoutubeContext";
import { Progress } from "@renderer/components/ui/Progress";

type CopyrightProgressDialogProps = {
  songs: Song[];
  setUnembeddableIds: Dispatch<SetStateAction<Array<string>>>;
  setStep: Dispatch<SetStateAction<Step>>;
};

export default function CopyrightProgressDialog({
  songs,
  setUnembeddableIds,
  setStep
}: CopyrightProgressDialogProps) {
  const { isReady, isVideoEmbeddable, component } = useYoutubeContext();

  const [count, setCount] = useState({ valid: 0, invalid: 0 });

  /**
   * Check if the songs are embeddable in the HTML
   *
   * @returns A map that assigns to each songId true iff it's embeddable.
   */
  const checkEmbeddability = async () => {
    const songIds = songs.map((song) => song.link.split("/").at(-1)!);

    const results = new Map<string, boolean>();

    for (const songId of songIds) {
      console.log(`songId: ${songId}`);
      const isValid = await isVideoEmbeddable(songId);
      results.set(songId, isValid);

      setCount((oldCount) => {
        const newCount = { ...oldCount };
        if (isValid) {
          newCount.valid += 1;
        } else {
          newCount.invalid += 1;
        }

        return newCount;
      });
    }

    const unembeddableIds = [...results.keys()].filter((songId) => !results.get(songId));

    setUnembeddableIds(unembeddableIds);

    const nextStep = unembeddableIds.length > 0 ? STEPS.DOWNLOAD : STEPS.RENDERING;
    setStep(nextStep);
  };

  useEffect(() => {
    if (isReady) {
      checkEmbeddability();
    }
  }, [isReady]);

  const checkedSongs = count.valid + count.invalid;
  const percentage = (checkedSongs / songs.length) * 100;

  let result: ReactElement | null = null;
  if (checkedSongs === songs.length) {
    result = (
      <p>
        Valid: {count.valid}. Invalid {count.invalid}.
      </p>
    );
  }
  return (
    <Dialog open>
      <DialogContent
        className="[&>button]:hidden sm:max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Copyright check</DialogTitle>
          <DialogDescription>
            Checking if the songs are embeddable in HTML... {result}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Progress value={percentage} />
            <Label>
              Checked {checkedSongs}/{songs.length} ({percentage.toFixed(2)}%)
            </Label>
          </div>
        </div>
        {component}
      </DialogContent>
    </Dialog>
  );
}
