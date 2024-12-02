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
import { Switch } from "@renderer/components/ui/Switch";
import { useState } from "react";

type ProgressDialogProps = {
  isDisabled: boolean;
  startGeneration: () => void;
};

const STEPS = {
  NOT_STARTED: "NOT_STARTED",
  COPYRIGHT: "COPYRIGHT_CHECK",
  DOWNLOAD: "SONG_DOWNLOAD"
} as const;
type Step = (typeof STEPS)[keyof typeof STEPS];

export default function ProgressDialog({ isDisabled, startGeneration }: ProgressDialogProps) {
  const [randomized, setRandomized] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [step, setStep] = useState<Step>(STEPS.NOT_STARTED);

  if (step === STEPS.NOT_STARTED) {
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
            <Button type="button" variant="default" onClick={startGeneration}>
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
