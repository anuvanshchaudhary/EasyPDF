"use client";
import { Trash2 } from "lucide-react";
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
import { deleteAllSummariesAction } from "@/actions/summary-action";
import { toast } from "sonner";

export default function DeleteAllButton() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteAll = async () => {
    startTransition(async () => {
      const result = await deleteAllSummariesAction();
      if (result?.success) {
        toast.success("All summaries deleted successfully");
      } else {
        toast.error("Error", {
          description: "Failed to delete all summaries",
        });
      }
      setOpen(false);
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="bg-red-500 text-white px-6 py-2 text-xl hover:bg-white hover:text-red-500 border-2 border-black transition-all shadow-hard hover:shadow-none flex items-center gap-2 font-mono font-bold"
        >
          <Trash2 className="w-5 h-5" /> DELETE_ALL
        </button>
      </DialogTrigger>
      <DialogContent className="border-4 border-black bg-white rounded-none shadow-hard p-6 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif font-black text-2xl uppercase text-red-600">WARNING: PURGE_ALL</DialogTitle>
          <DialogDescription className="font-mono text-black opacity-70 text-lg">
            This action will permanently delete ALL your summaries. It is irreversible.
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
            className="rounded-none bg-red-600 text-white border-2 border-black hover:bg-white hover:text-red-600 font-mono font-bold uppercase"
            onClick={handleDeleteAll}
          >
            {isPending ? "PURGING..." : "EXECUTE"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
