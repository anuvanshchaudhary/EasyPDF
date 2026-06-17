import type { Metadata } from "next";
import "./globals.css";
import ClerkClientProvider from "./clerk-provider";

export const metadata: Metadata = {
  title: "Easy PDF -  Summarize PDF",
  description: "Easy PDF is a tool that allows you to create PDF files easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkClientProvider>
      <html lang="en">
        <body className="antialiased" suppressHydrationWarning>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </ClerkClientProvider>
  );
}
