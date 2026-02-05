import HeroSection from '@/components/home/hero';
import DemoSection from '@/components/home/demo';
import WorkingSection from '@/components/home/working';  
import BgGradient from "@/components/common/bg-gradient";
import PricingSection from "@/components/home/pricing";
import CTASection from "@/components/home/cta";


export default function Home() {
  return (
    <div className="relative w-full">
      <BgGradient />
      <main className="flex flex-col">
        <HeroSection />
        <DemoSection />
        <WorkingSection />
        <PricingSection/>
        <CTASection/>
      </main>
    </div>
  );
}