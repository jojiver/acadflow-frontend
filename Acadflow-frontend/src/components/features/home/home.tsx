import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { FeaturesSection } from "./features-section";
import { HowItWorksSection } from "./how-it-works-section";
import { PrioritySection } from "./priority-section";
import { ImportSection } from "./import-section";
import { TestimonialsSection } from "./testimonials-section";
import { CtaSection } from "./cta-section";

// The landing feature owns the marketing sections. Nav + footer live in the
// guest layout so every marketing page shares them.
export function Home() {
  return (
    <div className="text-ink">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PrioritySection />
      <ImportSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
