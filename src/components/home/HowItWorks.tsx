import { useTranslations } from "next-intl";

interface Step {
  num: string;
  title: string;
  desc: string;
  image: string;
}

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps: Step[] = [
    { num: "Step 01", title: t("step1Title"), desc: t("step1Desc"), image: "/pick-plan.png" },
    { num: "Step 02", title: t("step2Title"), desc: t("step2Desc"), image: "/scan-and-install.png" },
    { num: "Step 03", title: t("step3Title"), desc: t("step3Desc"), image: "/land-and-connect.png" },
  ];

  return (
    <section
      className="py-[60px] relative overflow-hidden my-[30px]"
      style={{ background: "var(--paper-warm)" }}
      id="how"
    >
      <div className="wrap">
        <div className="mb-10">
          <h2 className="display text-[clamp(2.5rem,5vw,4rem)] font-normal">
            Enjoy <em className="not-italic text-accent">unlimited</em> data{" "}
            <br className="hidden md:block" />
            in three steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden
                transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-1"
            >
              {/* Image area */}
              <div
                className="w-full h-[300px] bg-[var(--paper-deep)] bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${step.image}')` }}
                role="img"
                aria-label={step.title}
              />

              {/* Body */}
              <div className="p-7 pt-7 pb-8 flex flex-col gap-2.5">
                <span className="font-mono text-[0.72rem] tracking-[0.1em] uppercase text-accent font-medium">
                  {step.num}
                </span>
                <h3 className="font-display text-[1.45rem] font-medium tracking-[-0.02em] leading-[1.15] text-ink">
                  {step.title}
                </h3>
                <p className="text-mute text-[0.92rem] leading-[1.6]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
