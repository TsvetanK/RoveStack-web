import Image from "next/image";
import { useTranslations } from "next-intl";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";

const AppleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z" fill="#00C3FF"/>
    <path d="M16.81 15.02l-2.81-2.813L3.61 22.39c.197.045.41.025.62-.103L16.81 15.02z" fill="#FF3A44"/>
    <path d="M20.16 10.81c.75.411.75 1.488 0 1.9l-3.35 1.945-3.019-3.049 3.02-3.021 3.349 2.225z" fill="#FFC400"/>
    <path d="M14 12.207L3.61 1.814c.197-.045.41-.025.62.103L16.81 9.39 14 12.207z" fill="#00E676"/>
  </svg>
);

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative pt-10 pb-10 overflow-hidden">
      {/* Marquee background */}
      <div
        className="absolute top-[18px] left-0 right-0 overflow-hidden whitespace-nowrap opacity-[0.08] pointer-events-none"
        aria-hidden="true"
      >
        <span
          className="font-display font-[800] text-[11rem] tracking-[-0.04em] inline-block"
          style={{ animation: "marquee 60s linear infinite" }}
        >
          Roam without limits. Roam without limits. Roam without limits.&nbsp;
          Roam without limits. Roam without limits. Roam without limits.&nbsp;
        </span>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes hero-float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        .hero-float { animation: hero-float 6s ease-in-out infinite; }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.05); }
        }
      `}</style>

      <div className="wrap relative z-[1]">
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-16 items-center">
          {/* Left: copy */}
          <div>
            {/* Title */}
            <h1
              className="display text-[clamp(3rem,7vw,5.75rem)] font-normal mb-7"
              style={{ fontVariationSettings: "'SOFT' 40" }}
            >
              Travel the world,<br />
              stay{" "}
              <em
                className="not-italic text-accent relative"
                style={{ fontVariationSettings: "'SOFT' 100" }}
              >
                connected.
                <span
                  className="absolute -left-0.5 -right-0.5 bottom-[0.09em] h-[0.18em] -z-[1] rounded-sm"
                  style={{ background: "rgba(255,91,46,0.15)" }}
                  aria-hidden="true"
                />
              </em>
            </h1>

            {/* Lead */}
            <p className="text-[1.175rem] leading-[1.55] text-mute max-w-[520px] mb-9 font-normal">
              Global data on your phone in under a minute. Choose from 200+ locations.
              No SIM swap, no roaming fees.
            </p>

            {/* CTA buttons */}
            <div className="flex gap-3 mb-[18px]">
              <ButtonLink href="/auth/register" variant="orange" lg className="flex-1">
                {t("cta")} <ArrowIcon />
              </ButtonLink>
              <ButtonLink href="/esim" variant="black" lg className="flex-1">
                {t("ctaStore")} <ArrowIcon />
              </ButtonLink>
            </div>

            {/* App store buttons */}
            <div className="flex gap-3.5 flex-wrap">
              <a href="#" aria-label="Download on the App Store" className="app-btn">
                <AppleIcon />
                <span className="app-btn-text">
                  <span className="app-btn-small">{t("appStore")}</span>
                  <span className="app-btn-large">{t("appStoreName")}</span>
                </span>
              </a>
              <a href="#" aria-label="Get it on Google Play" className="app-btn">
                <GooglePlayIcon />
                <span className="app-btn-text">
                  <span className="app-btn-small">{t("googlePlay")}</span>
                  <span className="app-btn-large">{t("googlePlayName")}</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right: visual */}
          <div className="relative h-[480px] md:h-[560px] grid place-items-center">
            <Image
              src="/hero_visual.png"
              alt="Illustration of a person using RoveStack on their phone while traveling"
              fill
              className="object-contain hero-float"
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
