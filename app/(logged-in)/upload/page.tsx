import UploadForm from "@/components/upload/upload-form";
import { UploadHeader } from "@/components/upload/upload-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
    const user = await currentUser();
    if (!user?.id) {
        redirect("/sign-in");
    }

    return (
        <section className="min-h-screen bg-white p-8 font-mono flex flex-col items-center justify-center">
            
            {/* BACK TO DASHBOARD ACTION */}
            <div className="w-full max-w-2xl mb-6 flex justify-start">
                <Link href="/dashboard">
                    <button className="bg-black text-white px-6 py-2 font-mono font-bold text-lg hover:bg-white hover:text-black border-2 border-black transition-all shadow-hard hover:shadow-none flex items-center gap-2 cursor-pointer">
                        ◄ BACK_TO_DASHBOARD
                    </button>
                </Link>
            </div>

            <div className="w-full max-w-2xl bg-white">
                <div className="flex flex-col items-center justify-center gap-2 text-center w-full">
                    <UploadHeader />
                    <UploadForm />
                </div>
            </div>
        </section>
    );
}

