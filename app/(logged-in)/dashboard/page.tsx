import EmptySummaryState from "@/components/summaries/empty-summary-state";
import SummaryCard from "@/components/summaries/summary-card";
import DeleteAllButton from "@/components/summaries/delete-all-button";

import { getSummaries } from "@/lib/summaries";
import { currentUser } from "@clerk/nextjs/server";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
        return redirect("/sign-in");
    }

    const uploadLimit = 5;
    const summaries = await getSummaries(userId);

    // Creating slight random rotations for the scrapbook feel
    const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1'];

    return (
        <main className="min-h-screen bg-white relative overflow-hidden font-mono p-8 md:p-16">
            <div className="absolute inset-0 bg-halftone pointer-events-none z-0"></div>

            <div className="relative z-10">
                <header className="mb-16 border-b-4 border-black pb-4 bg-white inline-block pr-12 shadow-hard">
                    <h1 className="text-6xl font-black uppercase font-serif">Archive_Index</h1>
                </header>

                <div className="flex justify-between items-center mb-8">
                    <div className="text-xl font-bold bg-white p-2 border-2 border-black inline-block">
                        Total_Docs: {summaries.length}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap justify-end">
                        {summaries.length > 0 && <DeleteAllButton />}
                        <Link href="/upload">
                            <button className="bg-black text-white px-6 py-2 text-xl hover:bg-white hover:text-black border-2 border-black transition-all shadow-hard hover:shadow-none flex items-center gap-2">
                                <Plus className="w-5 h-5" /> NEW_ENTRY
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="container mx-auto">
                    <div className="mb-6">
                        {/* Limit warning can be styled as a sticky note or alert */}
                        <div className="bg-white border-4 border-black p-4 shadow-hard-sm relative rotate-1 max-w-lg mx-auto mb-12">
                            <div className="absolute -top-3 -left-3 bg-black text-white px-2 font-bold">WARNING</div>
                            <p className="text-lg font-bold">
                                SYSTEM LIMIT: {uploadLimit} UPLOADS (BASIC TIER)
                                <br />
                                <Link
                                    href="/#pricing"
                                    className="underline decoration-2 hover:bg-black hover:text-white inline-flex items-center mt-2 group"
                                >
                                    UPGRADE_ACCESS <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </p>
                        </div>
                    </div>

                    {summaries.length === 0 ? (
                        <EmptySummaryState /> // This might need restyling too, but assuming it fits or is simple
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-20">
                            {summaries.map((summary, idx) => (
                                <SummaryCard
                                    key={idx}
                                    summary={summary}
                                    className={rotations[idx % 4]}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
