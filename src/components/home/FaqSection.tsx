import Link from "next/link";
import { useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/Accordion";

export function FaqSection() {
  const t = useTranslations("faq");

  const items = [
    {
      q: "What exactly is an eSIM?",
      a: "An eSIM is a digital SIM embedded in your device. Instead of inserting a plastic card, you scan a QR code and a cellular plan installs onto your phone — typically in under a minute.",
    },
    {
      q: "Which devices support eSIM?",
      a: "iPhone XR and later, iPad Pro (3rd gen+), Google Pixel 3 and later, Samsung Galaxy S20 and newer, plus most recent unlocked Android flagships.",
    },
    {
      q: "How fast does activation happen?",
      a: "Typically under 5 minutes. Install before you fly — your plan activates the moment you connect to a local network at your destination.",
    },
    {
      q: "Can I keep my regular number?",
      a: "Yes. Your physical SIM stays put for calls and texts from your home number, while the eSIM handles data abroad. Dual-SIM by default.",
    },
    {
      q: "What if I run out of data?",
      a: "You'll get a notification when you're running low. You can top up instantly from the app or dashboard — no need to buy a new plan.",
    },
  ];

  return (
    <section className="py-[60px]" id="faq">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-20 items-start">
          {/* Left */}
          <div>
            <p className="mono text-mute mb-3">{t("label")}</p>
            <h2
              className="display font-normal"
              style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}
            >
              Frequently <em className="not-italic text-accent">asked.</em>
            </h2>
            <p className="text-mute mt-5 max-w-[320px] leading-[1.6]">
              Can&apos;t find what you&apos;re looking for? Our support team answers in under 5 minutes, 24/7.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 mt-6 font-medium text-accent"
            >
              Contact support →
            </Link>
          </div>

          {/* Right: accordion */}
          <Accordion items={items} defaultOpen={0} />
        </div>
      </div>
    </section>
  );
}
