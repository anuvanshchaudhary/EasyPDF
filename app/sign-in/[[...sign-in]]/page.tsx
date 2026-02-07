import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern - Absolute to avoid opacity inheritance */}
      <div className="absolute inset-0 bg-halftone pointer-events-none z-0"></div>

      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-hard relative z-10">
        {/* Decorative corner box */}
        <div className="absolute -top-4 -left-4 bg-black text-white px-2 py-1 font-mono text-xl">
          AUTH_REQUIRED
        </div>

        <h2 className="font-serif font-black text-5xl mb-8 uppercase text-center leading-none">
          Enter The<br />System
        </h2>

        <SignIn
          appearance={{
            layout: { socialButtonsPlacement: "bottom", socialButtonsVariant: "blockButton" },
            variables: {
              colorPrimary: "#000000",
              colorText: "#000000",
              colorBackground: "#ffffff",
              colorInputBackground: "#ffffff",
              colorInputText: "#000000",
              borderRadius: "0px",
            },
            elements: {
              card: "shadow-none border-none p-0 bg-transparent text-black",
              headerTitle: "text-2xl font-bold uppercase mb-4",
              headerSubtitle: "text-lg font-mono mb-4",
              formButtonPrimary: "bg-black text-white hover:bg-white hover:text-black border-4 border-black shadow-none rounded-none text-xl font-mono uppercase transition-all",
              socialButtonsBlockButton: "bg-white text-black border-4 border-black hover:bg-black hover:text-white shadow-none rounded-none text-xl font-mono uppercase transition-all",
              formFieldInput: "border-4 border-black rounded-none shadow-none focus:ring-0 focus:border-black bg-white text-black",
              footerActionLink: "text-black underline decoration-4 hover:bg-black hover:text-white",
              identityPreviewText: "text-black font-mono",
              formFieldLabel: "uppercase font-bold font-mono text-black",
            }
          }}
        />
      </div>
    </div>
  );
}
