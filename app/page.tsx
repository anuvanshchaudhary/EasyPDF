import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-mono overflow-x-hidden text-black selection:bg-black selection:text-white">

      {/* NAVBAR */}
      <nav className="border-b-4 border-black p-4 flex justify-between items-center sticky top-0 bg-white z-50">
        <div className="text-4xl font-black uppercase tracking-tighter">
          EASY_PDF<span className="text-xs align-top border border-black px-1 ml-1">v2.0</span>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <button className="bg-black text-white text-2xl px-6 py-1 hover:bg-white hover:text-black hover:shadow-hard transition-all border-2 border-transparent hover:border-black cursor-pointer">
                LOGIN
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-white text-black text-xl px-4 py-1 hover:bg-black hover:text-white transition-all border-4 border-black cursor-pointer font-bold mr-4">
                DASHBOARD
              </button>
            </Link>
            <div className="border-4 border-black p-1">
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-none" } }} />
            </div>
          </SignedIn>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="grid grid-cols-1 lg:grid-cols-2 border-b-4 border-black">
        <div className="p-8 lg:p-16 flex flex-col justify-center border-r-4 border-black border-dashed lg:border-solid lg:border-r-4 border-b-4 lg:border-b-0">
          <h1 className="font-serif font-black text-7xl lg:text-9xl leading-[0.85] mb-8">
            DATA <br />
            <span className="bg-black text-white px-2">ANARCHY.</span>
          </h1>
          <p className="text-2xl mb-8 font-bold max-w-md">
            Stop reading PDFs. Start extracting raw intelligence.
            <span className="bg-black text-white px-1 ml-1">NO FLUFF.</span> just code.
          </p>

          <Link href="/upload" className="self-start">
            <button className="bg-black text-white text-3xl px-8 py-3 border-4 border-transparent hover:bg-white hover:text-black hover:border-black hover:shadow-hard transition-all flex items-center gap-4 cursor-pointer">
              INITIATE_UPLOAD <ArrowRight size={32} />
            </button>
          </Link>
        </div>

        {/* DITHERED IMAGE AREA */}
        <div className="relative bg-black h-96 lg:h-auto overflow-hidden flex items-center justify-center">
          {/* CSS Pattern to simulate dither */}
          <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
          <div className="text-white text-center p-8 border-4 border-white m-12 rotate-2 z-10 w-fit mx-auto">
            <Star size={64} className="mx-auto mb-4" fill="white" />
            <h2 className="text-4xl font-bold uppercase">100%<br />AI POWERED</h2>
          </div>
        </div>
      </header>

      {/* HOW IT WORKS (Technical Manual) */}
      <section className="p-12">
        <h2 className="text-5xl font-black uppercase mb-12 decoration-4 underline underline-offset-8">
          Execution_Protocol:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 font-bold text-2xl items-center">
          <div className="border-4 border-black p-6 shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-crosshair">
            <span className="block text-6xl mb-4 font-black">01.</span>
            UPLOAD_TARGET <br />
            [PDF/TXT]
          </div>
          <div className="hidden md:flex items-center justify-center text-4xl tracking-widest font-mono">
            -----&gt;
          </div>
          <div className="border-4 border-black p-6 shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-crosshair">
            <span className="block text-6xl mb-4 font-black">02.</span>
            GEMINI_PROCESS <br />
            [EXTRACT]
          </div>
          <div className="hidden md:flex items-center justify-center text-4xl tracking-widest font-mono">
            -----&gt;
          </div>
          <div className="border-4 border-black p-6 shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-crosshair">
            <span className="block text-6xl mb-4 font-black">03.</span>
            INTEL_REPORT <br />
            [DOWNLOAD]
          </div>
        </div>
      </section>

      {/* PRICING (Label Maker Style) */}
      <section className="border-t-4 border-black p-12 bg-white" id="pricing">
        <h2 className="text-5xl font-black uppercase mb-12 text-center text-black">
          Select_Clearance_Level:
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black bg-white shadow-hard text-black">

          {/* FREE TIER */}
          <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col relative group hover:bg-black hover:text-white transition-colors">
            <h3 className="text-4xl font-bold mb-2">STARTER</h3>
            <p className="text-xl font-mono mb-6 opacity-70">For casual extraction.</p>
            <p className="text-6xl font-black mb-8">₹0</p>

            <ul className="text-lg font-mono mb-8 space-y-2 flex-grow">
              <li className="flex items-center"><span className="mr-2 font-black">[x]</span> 1 PDF Summary/mo</li>
              <li className="flex items-center"><span className="mr-2 font-black">[x]</span> Standard Speed</li>
              <li className="flex items-center opacity-50"><span className="mr-2 font-black">[ ]</span> Email Support</li>
            </ul>

            <button className="bg-black text-white w-full py-2 text-2xl border-4 border-transparent group-hover:border-white group-hover:bg-white group-hover:text-black cursor-pointer uppercase font-bold">INITIATE</button>
          </div>

          {/* BASIC TIER */}
          <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col relative group hover:bg-black hover:text-white transition-colors">
            <h3 className="text-4xl font-bold mb-2">BASIC</h3>
            <p className="text-xl font-mono mb-6 opacity-70">Daily operations.</p>
            <p className="text-6xl font-black mb-8">₹99</p>

            <ul className="text-lg font-mono mb-8 space-y-2 flex-grow">
              <li className="flex items-center"><span className="mr-2 font-black">[x]</span> 5 PDF Summaries/mo</li>
              <li className="flex items-center"><span className="mr-2 font-black">[x]</span> Standard Speed</li>
              <li className="flex items-center"><span className="mr-2 font-black">[x]</span> Email Support</li>
            </ul>

            <button className="bg-black text-white w-full py-2 text-2xl border-4 border-transparent group-hover:border-white group-hover:bg-white group-hover:text-black cursor-pointer uppercase font-bold">UPGRADE</button>
          </div>

          {/* PREMIUM TIER */}
          <div className="p-8 bg-black text-white flex flex-col relative overflow-hidden ring-inset">
            <div className="absolute top-6 -right-6 bg-white text-black px-8 py-1 text-sm font-bold border-2 border-white rotate-45 z-10">RECOMMENDED</div>

            <h3 className="text-4xl font-bold mb-2">PREMIUM</h3>
            <p className="text-xl font-mono mb-6 opacity-80">Full unrestricted access.</p>
            <p className="text-6xl font-black mb-8">₹229</p>

            <ul className="text-lg font-mono mb-8 space-y-2 flex-grow">
              <li className="flex items-center"><span className="mr-2 font-black text-white">&gt;&gt;</span> Unlimited PDFs</li>
              <li className="flex items-center"><span className="mr-2 font-black text-white">&gt;&gt;</span> Priority Processing</li>
              <li className="flex items-center"><span className="mr-2 font-black text-white">&gt;&gt;</span> 24/7 Priority Support</li>
              <li className="flex items-center"><span className="mr-2 font-black text-white">&gt;&gt;</span> Markdown Export</li>
            </ul>

            <button className="bg-white text-black w-full py-2 text-2xl border-4 border-transparent hover:border-white hover:bg-black hover:text-white cursor-pointer uppercase font-bold transition-all">ACCESS_ALL</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;