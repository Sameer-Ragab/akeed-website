import { AppDownload } from "@/components/AppDownload";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { FinalCta } from "@/components/FinalCta";
import { Hero } from "@/components/Hero";
import { LeadersSection } from "@/components/LeadersSection";
import { MotionController } from "@/components/MotionController";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <>
      <MotionController />
      <SiteHeader />
      <main>
        <Hero />
        <LeadersSection />
        <AppDownload />
        <FeatureShowcase />
        <FinalCta />
      </main>
    </>
  );
}
