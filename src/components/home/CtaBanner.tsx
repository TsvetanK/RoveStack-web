import { useTranslations } from "next-intl";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";

export function CtaBanner() {
  const t = useTranslations("cta");

  return (
    <section className="py-[60px]">
      <div className="wrap">
        <div
          className="relative rounded-[28px] px-16 py-20 text-center overflow-hidden"
          style={{ background: "var(--ink)", color: "var(--paper)" }}
        >
          {/* Radial glows */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(255,91,46,0.2), transparent 50%), " +
                "radial-gradient(circle at 80% 70%, rgba(74,111,165,0.2), transparent 50%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-[1]">
            <h2
              className="display text-[clamp(2.5rem,5vw,4rem)] font-normal mb-5"
              style={{ lineHeight: 0.95 }}
            >
              Ready to <em className="not-italic text-accent">roam?</em>
            </h2>
            <p className="text-[rgba(245,241,234,0.7)] text-[1.1rem] max-w-[540px] mx-auto mb-9">
              {t("subtitle")}
            </p>

            <div className="flex gap-3.5 justify-center flex-wrap">
              <ButtonLink href="/auth/register" variant="orange" lg>
                {t("button")} <ArrowIcon />
              </ButtonLink>
              <ButtonLink href="/esim" variant="outline" lg>
                Browse plans
              </ButtonLink>
            </div>

            {/* Payment icons row */}
            <div className="mt-12 pt-8 border-t border-white/10 flex justify-center items-center gap-8 flex-wrap">
              <span className="text-[0.82rem] text-[rgba(245,241,234,0.5)]">{t("paymentMethods")}</span>
              <div className="flex gap-4 items-center">
                <svg height="20" viewBox="0 0 60 20" className="opacity-75 hover:opacity-100 transition-opacity" aria-label="Visa">
                  <text y="16" fontFamily="Arial" fontWeight="bold" fontSize="20" fill="white" letterSpacing="-1">VISA</text>
                </svg>
                <svg height="24" viewBox="0 0 38 24" className="opacity-75 hover:opacity-100 transition-opacity" aria-label="Mastercard">
                  <circle cx="14" cy="12" r="11" fill="#EB001B"/>
                  <circle cx="24" cy="12" r="11" fill="#F79E1B" opacity="0.9"/>
                  <path d="M19 5.5a11 11 0 0 1 0 13A11 11 0 0 1 19 5.5z" fill="#FF5F00"/>
                </svg>
                <svg height="20" viewBox="0 0 50 20" className="opacity-75 hover:opacity-100 transition-opacity" aria-label="American Express">
                  <text y="15" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="white">AMEX</text>
                </svg>
                <svg height="20" viewBox="0 0 55 20" className="opacity-75 hover:opacity-100 transition-opacity" aria-label="Apple Pay">
                  <text y="15" fontFamily="Arial" fontWeight="500" fontSize="11" fill="white">Apple Pay</text>
                </svg>
                <svg height="20" viewBox="0 0 50 20" className="opacity-75 hover:opacity-100 transition-opacity" aria-label="PayPal">
                  <text y="15" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#009cde">Pay</text>
                  <text x="22" y="15" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#003087">Pal</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
