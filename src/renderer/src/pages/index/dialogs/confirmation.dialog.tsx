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
import { Dispatch, SetStateAction } from "react";
import { Step, STEPS } from "./dialog.constants";

type ConfirmationDialogProps = {
  isDisabled: boolean;
  isRandomized: boolean;
  toggleRandomized: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<Step>>;
};

export default function ConfirmationDialog({
  isDisabled,
  isRandomized,
  toggleRandomized,
  setStep
}: ConfirmationDialogProps) {
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
                checked={isRandomized}
                onCheckedChange={(e) => {
                  toggleRandomized(e.valueOf());
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
