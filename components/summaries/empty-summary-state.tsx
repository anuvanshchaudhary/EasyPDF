import { FileText } from "lucide-react";
import Link from "next/link";

export default function EmptySummaryState() {
  return (
    <div className="flex justify-center py-12">
      <div className="bg-white border-4 border-black p-8 shadow-hard max-w-lg mx-auto rotate-1 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-black text-white p-4">
            <FileText className="w-16 h-16" strokeWidth={1.5} />
          </div>

          <h2 className="font-serif font-black text-4xl uppercase mt-4">
            NO_DATA_FOUND
          </h2>

          <p className="font-mono text-xl mb-6">
            The archives are empty. <br />
            Initialize extraction sequence.
          </p>

          <Link href="/upload">
            <button className="bg-black text-white px-8 py-3 text-2xl font-bold uppercase hover:bg-white hover:text-black border-4 border-transparent hover:border-black transition-all shadow-hard hover:shadow-none cursor-pointer">
              INITIATE_UPLOAD
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}