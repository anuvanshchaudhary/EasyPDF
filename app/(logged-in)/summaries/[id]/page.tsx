import { SummaryViewer } from "@/components/summaries/summary-viewer";
import { getSummaryById } from "@/lib/summaries";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SummaryPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const id = params.id;
    const summary = await getSummaryById(id);

    if (!summary) {
        notFound();
    }
    const {
        title,
        summary_text,
        file_name,
        word_count,
        created_at
    } = summary;

    return (
        <div className="min-h-screen bg-white p-4 md:p-12 flex flex-col items-center justify-center selection:bg-black selection:text-white">

            {/* BACK TO DASHBOARD ACTION */}
            <div className="w-full max-w-4xl mb-6 flex justify-start">
                <Link href="/dashboard">
                    <button className="bg-black text-white px-6 py-2 font-mono font-bold text-lg hover:bg-white hover:text-black border-2 border-black transition-all shadow-hard hover:shadow-none flex items-center gap-2 cursor-pointer">
                        ◄ BACK_TO_DASHBOARD
                    </button>
                </Link>
            </div>

            {/* PAPER CONTAINER */}
            <div className="w-full max-w-4xl bg-white border-l-4 border-r-4 border-black p-8 md:p-16 shadow-hard relative min-h-[80vh]">


                {/* Double Border Header */}
                <header className="border-b-4 border-black mb-12 pb-8 text-center">
                    <h1 className="font-serif font-black text-6xl md:text-8xl uppercase leading-[0.8] mb-4">
                        Executive<br />Briefing
                    </h1>
                    <div className="mt-4 font-mono text-xl font-bold bg-black text-white inline-block px-4 py-1 rotate-1 uppercase">
                        CONFIDENTIAL // AI_GENERATED // {file_name}
                    </div>
                </header>

                {/* MAIN BODY */}
                <div className="font-serif text-2xl md:text-3xl leading-snug font-bold text-justify space-y-8">
                    <p className="mb-12">
                        <span className="float-left text-8xl font-black leading-[0.7] mr-4 border-2 border-black p-2 shadow-hard-sm">T</span>
                        he following analysis of <span className="underline decoration-4">{title}</span> indicates a high-priority data extraction.
                        <br />
                        <span className="text-xl font-mono mt-2 block opacity-70">WORD_COUNT: {word_count} | DATE: {new Date(created_at).toLocaleDateString()}</span>
                    </p>

                    <SummaryViewer summary={summary_text} />
                </div>

                {/* FOOTER STAMP */}
                <div className="mt-20 border-t-4 border-black pt-8 flex justify-between font-mono text-xl font-bold uppercase items-end">
                    <div>
                        Ref: #{id.substring(0, 8).toUpperCase()} <br />
                        Time: {new Date().toLocaleTimeString()}
                    </div>
                    <div className="border-4 border-black p-4 rotate-12 opacity-50 text-4xl font-black border-double">
                        VERIFIED
                    </div>
                </div>

            </div>
        </div>
    );
}
