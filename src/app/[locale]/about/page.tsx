import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About — RoveStack",
  description: "RoveStack makes staying connected abroad effortless with instant eSIM data plans for travellers worldwide.",
};

const sections = [
  {
    title: "We believe travel should be effortless",
    subtitle: "RoveStack was born out of frustration. Our founders were tired of paying roaming fees, hunting for local SIM cards at airports, and losing connectivity at the worst possible moments. We set out to build something better.",
    image: "/about/Wavy_Tech-09_Single-11.jpg",
    alt: "Traveller connected abroad",
  },
  {
    title: "Instant connectivity in 100+ countries",
    subtitle: "Our eSIM marketplace gives you access to prepaid data plans across more than 100 destinations. Buy before you fly, scan a QR code, and you're connected the moment your plane lands — no physical SIM required.",
    image: "/about/4207380.jpg",
    alt: "Global coverage map",
  },
  {
    title: "Built for the modern traveller",
    subtitle: "Whether you're a digital nomad, a weekend explorer or a business traveller, RoveStack has a plan for your trip. Flexible data allowances, fair prices, and instant delivery straight to your inbox.",
    image: "/about/working.svg",
    alt: "Working remotely",
  },
  {
    title: "Transparent, simple, honest",
    subtitle: "No hidden fees. No confusing contracts. What you see is what you pay. We partner with trusted eSIM providers to guarantee reliable coverage and show you real pricing upfront.",
    image: "/about/20943984.jpg",
    alt: "Simple and transparent pricing",
  },
];

export default function AboutPage() {
  return (
    <div className="wrap inner-page">
      <PageHeader
        title={<>About <em>us</em></>}
        subtitle="RoveStack makes mobile data abroad simple. Instant eSIM plans, fair prices, no roaming surprises."
      />

      {/* Alternating sections */}
      <div className="about-sections">
        {sections.map((s, i) => (
          <div key={i} className={`about-row${i % 2 === 1 ? " about-row--reverse" : ""}`}>
            <div className="about-row-text">
              <h2 className="about-row-title">{s.title}</h2>
              <p className="about-row-sub">{s.subtitle}</p>
            </div>
            <div className="about-row-image">
              <Image
                src={s.image}
                alt={s.alt}
                width={600}
                height={440}
                className="about-img"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="about-cta">
        <h2 className="about-cta-title">Ready to travel smarter?</h2>
        <p className="about-cta-sub">Browse our eSIM plans and get connected before your next trip.</p>
        <Link href="/esim" className="btn-orange">
          Browse plans
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 11L11 3m0 0H5m6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
