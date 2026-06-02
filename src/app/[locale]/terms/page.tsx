import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Terms of Service — RoveStack",
  description: "Terms and conditions for using RoveStack eSIM services.",
};

export default function TermsPage() {
  const updated = "1 June 2026";

  return (
    <div className="wrap inner-page">
      <div className="legal-page">
        <div className="legal-header">
          <p className="legal-eyebrow">Legal</p>
          <h1 className="legal-title">Terms of <em>Service</em></h1>
          <p className="legal-updated">Last updated: {updated}</p>
        </div>

        <div className="legal-body">
          <p>Please read these Terms of Service carefully before using RoveStack. By creating an account or purchasing an eSIM plan you agree to be bound by these terms.</p>

          <h2>1. The service</h2>
          <p>RoveStack is an eSIM marketplace that lets you purchase prepaid mobile data plans for use abroad. We act as a reseller; the underlying eSIM plans are provisioned by eSIM Go.</p>

          <h2>2. Eligibility</h2>
          <p>You must be at least 16 years old to use our service. By registering you confirm that the information you provide is accurate and complete.</p>

          <h2>3. Account</h2>
          <p>You are responsible for maintaining the confidentiality of your password and for all activity under your account. Notify us immediately at <a href="mailto:support@rovestack.com">support@rovestack.com</a> if you suspect unauthorised access.</p>

          <h2>4. Purchases and payments</h2>
          <p>All prices are shown inclusive of applicable taxes. Payments are processed securely by Stripe. By completing a purchase you authorise us to charge your payment method for the displayed amount.</p>
          <p>Your eSIM QR code will be delivered to your registered email address within minutes of a successful payment.</p>

          <h2>5. eSIM activation and use</h2>
          <ul>
            <li>eSIMs are digital products and are delivered electronically.</li>
            <li>You are responsible for ensuring your device is eSIM-compatible before purchasing.</li>
            <li>Each eSIM plan has a fixed data allowance and validity period that begins on activation.</li>
            <li>Plans are non-transferable and may only be installed on one device.</li>
            <li>Unused data does not roll over after the validity period expires.</li>
          </ul>

          <h2>6. Refund policy</h2>
          <p>Because eSIMs are digital goods delivered instantly, we generally cannot offer refunds once an eSIM has been activated (i.e. the QR code has been scanned).</p>
          <p>We will issue a full refund if:</p>
          <ul>
            <li>The eSIM could not be provisioned due to a technical fault on our end</li>
            <li>The eSIM was never activated and you request a refund within 14 days of purchase</li>
          </ul>
          <p>To request a refund contact <a href="mailto:support@rovestack.com">support@rovestack.com</a>.</p>

          <h2>7. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to reverse-engineer, copy or redistribute our platform</li>
            <li>Abuse promotional offers or create multiple accounts to circumvent limits</li>
            <li>Use automated tools to access the service without our written permission</li>
          </ul>

          <h2>8. Availability</h2>
          <p>We aim for high availability but do not guarantee uninterrupted access to the service. Planned maintenance will be announced in advance where possible. We are not liable for losses arising from downtime.</p>

          <h2>9. Limitation of liability</h2>
          <p>To the maximum extent permitted by law, RoveStack&rsquo;s total liability for any claim arising from use of the service is limited to the amount you paid for the affected order.</p>
          <p>We are not liable for indirect, incidental or consequential losses including lost profits, data loss or business interruption.</p>

          <h2>10. Intellectual property</h2>
          <p>All content, trademarks and software on RoveStack are owned by or licensed to us. You may not use our branding without written permission.</p>

          <h2>11. Governing law</h2>
          <p>These terms are governed by the laws of the European Union and the Republic of Bulgaria. Disputes shall be submitted to the competent courts in Sofia, Bulgaria.</p>

          <h2>12. Changes to these terms</h2>
          <p>We may update these terms at any time. We will notify you by email of material changes at least 14 days before they take effect. Continued use of the service after the effective date constitutes acceptance.</p>

          <h2>13. Contact</h2>
          <p>For any questions about these terms: <a href="mailto:support@rovestack.com">support@rovestack.com</a></p>
        </div>

        <div className="legal-footer">
          <Link href="/privacy" className="legal-link">Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
}
