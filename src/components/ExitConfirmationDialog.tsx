import { memo, useCallback, useState } from "react";
import { Button } from "./ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog.tsx";

interface ExitConfirmationDialogProps {
  onConfirmExit: () => void;
  triggerText?: string;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  triggerClassName?: string;
}

export const ExitConfirmationDialog = memo(function ExitConfirmationDialog({
  onConfirmExit,
  triggerText = "← Exit",
  triggerVariant = "ghost",
  triggerClassName = "text-gray-600 hover:text-gray-900",
}: ExitConfirmationDialogProps) {
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleConfirmExit = useCallback(() => {
    setShowExitDialog(false);
    onConfirmExit();
  }, [onConfirmExit]);

  return (
    <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={triggerClassName}>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Are you sure you want to exit the game? Your progress will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleConfirmExit}>
            Exit Game
          </Button>
          <Button variant="outline" onClick={() => setShowExitDialog(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
