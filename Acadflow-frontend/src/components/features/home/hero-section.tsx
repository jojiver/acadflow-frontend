import { useNavigate } from "react-router";
import dashboardPreview from "@/assets/dashboard-preview.png";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const navigate = useNavigate();

  function scrollToHowItWorks() {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute -top-[220px] -right-[280px] size-[660px] rounded-full bg-[#EEF2F8]" />
      <div className="pointer-events-none absolute top-[420px] -left-[220px] size-[460px] rounded-full bg-[#EFF3F9]" />

      <div className="relative mx-auto max-w-[1280px] px-5 pt-16 pb-28 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-tint px-3.5 py-2">
            <span className="size-1.5 rounded-full bg-low" />
            <span className="text-[10px] font-bold tracking-[0.08em] text-ink-2">
              SMART IMPORT 2.0 IS LIVE
            </span>
          </span>

          <h1 className="mt-7 text-4xl leading-[1.1] font-bold tracking-tight text-ink sm:text-6xl lg:text-[76px] lg:leading-[84px]">
            Your semester,
            <br />
            finally in order.
          </h1>

          <p className="mt-6 max-w-[1095px] text-base leading-[30px] text-ink-2 sm:text-[18px]">
            AcadFlow reads your class card, builds a colour-coded week, and
            ranks every deadline — so you always know what is next.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              className="h-[52px] rounded-[14px] px-5 text-[15px]"
              onClick={() => navigate("/auth/signup")}
            >
              Get started free →
            </Button>
            <Button
              variant="secondary"
              className="h-[52px] rounded-[14px] px-5 text-[15px]"
              onClick={scrollToHowItWorks}
            >
              See how it works
            </Button>
          </div>

          <p className="mt-6 text-[13px] text-ink-3">
            Free for students · No credit card · Works with PDF, JPG and PNG
          </p>
        </div>

        <div className="relative mx-auto mt-14 w-full max-w-[1120px]">
          <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_26px_48px_rgba(15,23,42,0.14)]">
            <img
              src={dashboardPreview}
              alt="AcadFlow dashboard preview"
              className="h-[360px] w-full object-cover object-top sm:h-[480px] lg:h-[640px]"
            />
          </div>

          <div className="absolute -bottom-10 right-4 hidden w-[300px] rounded-2xl border border-line bg-surface p-5 shadow-[0_18px_36px_rgba(15,23,42,0.16)] lg:block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.08em] text-ink-3 uppercase">
                  Next up
                </p>
                <p className="mt-1.5 text-base font-semibold text-ink">
                  Web Dev Final Project
                </p>
              </div>
              <span className="rounded-full bg-[#FEE2E2] px-2.5 py-1 text-xs font-bold text-high">
                92
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-2">
              Due in 3 days · 60% done
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-brand-tint">
              <div className="h-full w-[60%] rounded-full bg-high" />
            </div>
            <p className="mt-2 text-xs font-semibold text-brand">
              Start this task →
            </p>
          </div>

          <div className="absolute -bottom-16 left-2 hidden items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-3 shadow-[0_14px_28px_rgba(15,23,42,0.12)] lg:flex">
            <span className="size-2 rounded-full bg-low" />
            <span className="text-xs font-semibold text-ink">
              6 classes detected
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
