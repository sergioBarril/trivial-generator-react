/* eslint-disable react/no-unescaped-entities */
import { Button } from "@renderer/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@renderer/components/ui/Dialog";
import { Input } from "@renderer/components/ui/Input";
import { Label } from "@renderer/components/ui/Label";
import { Progress } from "@renderer/components/ui/Progress";
import { Switch } from "@renderer/components/ui/Switch";
import useYoutubeEmbed from "@renderer/hooks/useYoutubeEmbed";
import { AnimeSong } from "@renderer/types/list.types";
import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";

type ProgressDialogProps = {
  songs: AnimeSong[];
  outputDir: string;
};

type ConfirmationDialogProps = {
  isDisabled: boolean;
  setStep: Dispatch<SetStateAction<Step>>;
};

const STEPS = {
  CONFIRMATION: "CONFIRMATION",
  COPYRIGHT: "COPYRIGHT_CHECK",
  DOWNLOAD: "SONG_DOWNLOAD",
  RENDERING: "HTML_RENDERING",
  COMPLETED: "COMPLETED"
} as const;
type Step = (typeof STEPS)[keyof typeof STEPS];

function ConfirmationDialog({ isDisabled, setStep }: ConfirmationDialogProps) {
  const [randomized, setRandomized] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={isDisabled}>
          Generate
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Generate the trivial at the selected location</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <div className="flex flex-row gap-5">
              <Label htmlFor="song-amount" className="self-center">
                Songs:
              </Label>
              <Input
                id="song-amount"
                defaultValue={32}
                type="number"
                readOnly
                className="max-w-10 px-0 pl-2"
              />
            </div>

            <div className="flex flex-row gap-5 mt-2">
              <Label htmlFor="randomize" className="self-center">
                Randomize:
              </Label>
              <Switch
                id="randomize"
                checked={randomized}
                onCheckedChange={(e) => {
                  setRandomized(e.valueOf());
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="button" variant="default" onClick={() => setStep(STEPS.COPYRIGHT)}>
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type CopyrightProgressDialogProps = {
  songs: AnimeSong[];
  setUnembeddableIds: Dispatch<SetStateAction<Array<string>>>;
  setStep: Dispatch<SetStateAction<Step>>;
};

function CopyrightProgressDialog({
  songs,
  setUnembeddableIds,
  setStep
}: CopyrightProgressDialogProps) {
  const { isReady, isVideoEmbeddable, component } = useYoutubeEmbed();

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

    const nextStep = unembeddableIds.length > 0 ? "SONG_DOWNLOAD" : "HTML_RENDERING";
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
        className="sm:max-w-md"
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

type DownloadProgressDialogProps = {
  outputDir: string;
  unembeddableIds: Array<string>;
  setFailedIds: Dispatch<SetStateAction<Array<string>>>;
};

type HandleDownloadCompletedBody = {
  songId: string;
  isDownloaded: boolean;
};

function DownloadProgressDialog({
  unembeddableIds,
  outputDir,
  setFailedIds
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

    downloadAudios();
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

export default function ProgressDialog({ songs, outputDir }: ProgressDialogProps) {
  const [step, setStep] = useState<Step>(STEPS.CONFIRMATION);

  const [unembeddableIds, setUnembeddableIds] = useState<Array<string>>([]);
  const [invalidIds, setFailedIds] = useState<Array<string>>([]);

  const isDisabled = Boolean(!outputDir || songs.length === 0);

  if (step === STEPS.CONFIRMATION) {
    return <ConfirmationDialog isDisabled={isDisabled} setStep={setStep} />;
  }

  if (step === STEPS.COPYRIGHT) {
    console.log(unembeddableIds);
    console.log(invalidIds);
    return (
      <CopyrightProgressDialog
        songs={songs}
        setUnembeddableIds={setUnembeddableIds}
        setStep={setStep}
      />
    );
  }

  if (step === STEPS.DOWNLOAD) {
    return (
      <DownloadProgressDialog
        unembeddableIds={unembeddableIds}
        setFailedIds={setFailedIds}
        outputDir={outputDir}
      />
    );
  }

  return null;
}
