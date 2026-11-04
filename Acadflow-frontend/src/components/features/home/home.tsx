import { LandingNav } from "./landing-nav";
import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { FeaturesSection } from "./features-section";
import { HowItWorksSection } from "./how-it-works-section";
import { PrioritySection } from "./priority-section";
import { ImportSection } from "./import-section";
import { TestimonialsSection } from "./testimonials-section";
import { CtaSection } from "./cta-section";
import { LandingFooter } from "./landing-footer";

// The landing feature owns the whole marketing page.
export function Home() {
  return (
    <div className="min-h-svh bg-canvas text-ink">
      <LandingNav />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PrioritySection />
        <ImportSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
