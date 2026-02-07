import Link from "next/link";
import DeleteButton from "./delete-button";
import { FileText, X } from "lucide-react";
import { cn, formatFileName } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const SummaryHeader = ({
  fileUrl,
  title,
  createdAt,
}: {
  fileUrl: string;
  title: string | null;
  createdAt: string;
}) => {
  return (
    <div className="mb-8">
      <div className="bg-black text-white px-2 py-1 text-lg font-bold inline-block mb-2">
        DOC_REF
      </div>
      <h3 className="font-serif font-black text-3xl mb-4 leading-none uppercase break-words">
        {title || formatFileName(fileUrl)}
      </h3>

      <div className="border-t-4 border-black pt-4 flex justify-between text-xl font-bold font-mono">
        <span>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={cn(
        "px-2 py-1 text-sm font-bold uppercase",
        status === "completed"
          ? "bg-black text-white"
          : "bg-white text-black border-2 border-black"
      )}
    >
      {status}
    </span>
  );
};

export default function SummaryCard({ summary, className }: { summary: any, className?: string }) {
  return (
    <div className={cn(
      "bg-white border-4 border-black p-6 shadow-hard relative hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all",
      className
    )}>
      {/* STICKER TAPE EFFECT */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black opacity-20 rotate-2 pointer-events-none"></div>

      <div className="absolute top-2 right-2 z-10">
        <DeleteButton summaryId={summary.id} />
      </div>

      <Link href={`summaries/${summary.id}`} className="block h-full">
        <div className="flex flex-col h-full justify-between">
          <SummaryHeader
            fileUrl={summary.original_file_url}
            title={summary.title}
            createdAt={summary.created_at}
          />
          <div className="flex justify-between items-center mt-auto">
            <StatusBadge status={summary.status} />
          </div>
        </div>
      </Link>
    </div>
  );
}
