"use client";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState, useTransition } from "react";
import { deleteSummaryAction } from "@/actions/summary-action";
import { toast } from "sonner";

interface DeleteButtonProps {
  summaryId: string;
}

export default function DeleteButton({ summaryId }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteSummaryAction({ summaryId });
      if (result?.success) {
        toast.success("Summary deleted successfully");
      } else {
        toast.error("Error", {
          description: "Failed to delete summary",
        });
      }
      setOpen(false);
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size="icon"
          className="bg-white text-black border-2 border-black hover:bg-black hover:text-white rounded-none h-8 w-8 transition-all"
        >
          <X className="w-5 h-5 font-bold" strokeWidth={3} />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-4 border-black bg-white rounded-none shadow-hard p-6 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif font-black text-2xl uppercase">CONFIRM_DELETION</DialogTitle>
          <DialogDescription className="font-mono text-black opacity-70 text-lg">
            This action is irreversible. The data will be purged.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            variant="ghost"
            className="rounded-none border-2 border-black text-black hover:bg-black hover:text-white font-mono font-bold uppercase"
            onClick={() => setOpen(false)}
          >
            ABORT
          </Button>
          <Button
            variant="destructive"
            className="rounded-none bg-black text-white border-2 border-black hover:bg-white hover:text-black font-mono font-bold uppercase"
            onClick={handleDelete}
          >
            {isPending ? "PURGING..." : "EXECUTE"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
