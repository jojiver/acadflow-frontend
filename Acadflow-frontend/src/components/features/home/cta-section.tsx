import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-canvas py-16">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[24px] bg-brand-dark px-6 py-14 text-center sm:px-16">
          <div className="pointer-events-none absolute -top-[120px] right-[120px] size-[420px] rounded-full bg-brand-glow" />

          <div className="relative mx-auto max-w-[900px]">
            <h2 className="text-3xl font-bold text-white sm:text-[36px] sm:leading-[44px]">
              Your best semester starts
              <br />
              with one photo.
            </h2>
            <p className="mt-4 text-[15px] leading-6 text-[#CBD5E1]">
              Free for students. No credit card. Set up in under two minutes.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button
                className="h-12 rounded-xl bg-white px-5 text-brand hover:bg-brand-tint"
                onClick={() => navigate("/auth/signup")}
              >
                Get started free →
              </Button>
              <Button
                variant="secondary"
                className="h-12 rounded-xl border-[#3A4D60] bg-brand-dark px-5 text-white hover:bg-brand-glow"
                onClick={() => navigate("/auth/login")}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
