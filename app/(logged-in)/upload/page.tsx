import UploadForm from "@/components/upload/upload-form";
import { UploadHeader } from "@/components/upload/upload-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await currentUser();
    if (!user?.id) {
        redirect("/sign-in");
    }

    return (
        <section className="min-h-screen bg-white p-8 font-mono flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl bg-white">
                <div className="flex flex-col items-center justify-center gap-2 text-center w-full">
                    <UploadHeader />
                    <UploadForm />
                </div>
            </div>
        </section>
    );
}
