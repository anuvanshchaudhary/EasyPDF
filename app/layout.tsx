import type { Metadata } from "next";
import { Outfit as FontSans, Outfit } from "next/font/google";
import "./globals.css";

const fontSans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
    <html lang="en">
      <body
        className={`${fontSans.variable} font-sans antialiased`}
      >
      {children}
    </body>
  </html>
  );
}
