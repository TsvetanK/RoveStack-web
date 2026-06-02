import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Privacy Policy — RoveStack",
  description: "How RoveStack collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
  const updated = "1 June 2026";

  return (
    <div className="wrap inner-page">
      <div className="legal-page">
        <div className="legal-header">
          <p className="legal-eyebrow">Legal</p>
          <h1 className="legal-title">Privacy <em>Policy</em></h1>
          <p className="legal-updated">Last updated: {updated}</p>
        </div>

        <div className="legal-body">
          <p>RoveStack (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This policy explains what data we collect, why we collect it, and how we use it when you use our website and services.</p>

          <h2>1. Data we collect</h2>
          <h3>Account data</h3>
          <p>When you create an account we collect your name and email address. If you sign in with Google or Apple we receive only the data you authorise.</p>

          <h3>Purchase data</h3>
          <p>When you buy an eSIM plan we collect your order details and payment confirmation. Card numbers are processed directly by Stripe and never stored on our servers.</p>

          <h3>Usage data</h3>
          <p>We collect standard web server logs (IP address, browser type, pages visited, referrer) for security and performance purposes. We do not sell this data.</p>

          <h3>eSIM usage data</h3>
          <p>After activation, your eSIM provider (eSIM Go) may share data and usage statistics with us so we can display your remaining balance inside your account.</p>

          <h2>2. How we use your data</h2>
          <ul>
            <li>To create and manage your account</li>
            <li>To process payments and deliver your eSIM QR code by email</li>
            <li>To display your active eSIMs and usage in the app</li>
            <li>To send transactional emails (order confirmation, eSIM ready)</li>
            <li>To respond to support requests</li>
            <li>To improve our service and prevent fraud</li>
          </ul>
          <p>We do not use your data for advertising and we do not sell it to third parties.</p>

          <h2>3. Legal basis (GDPR)</h2>
          <p>We process your personal data on the following legal bases:</p>
          <ul>
            <li><strong>Contract</strong> — to fulfil the eSIM plan you purchased</li>
            <li><strong>Legitimate interests</strong> — to keep the platform secure and improve our service</li>
            <li><strong>Legal obligation</strong> — where required by applicable law</li>
          </ul>

          <h2>4. Data sharing</h2>
          <p>We share your data only with the following third parties, strictly for the purpose of operating the service:</p>
          <ul>
            <li><strong>Stripe</strong> — payment processing</li>
            <li><strong>eSIM Go</strong> — eSIM provisioning and activation</li>
            <li><strong>Email provider</strong> — transactional emails</li>
          </ul>
          <p>All processors are bound by data processing agreements and may not use your data for their own purposes.</p>

          <h2>5. Data retention</h2>
          <p>We keep your account data for as long as your account is active. Order and billing records are retained for 7 years to comply with financial regulations. You may request deletion of your account at any time.</p>

          <h2>6. Your rights</h2>
          <p>Under GDPR you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:privacy@rovestack.com">privacy@rovestack.com</a>.</p>

          <h2>7. Cookies</h2>
          <p>We use only essential cookies required to keep you logged in and to protect against CSRF attacks. We do not use tracking or advertising cookies.</p>

          <h2>8. Security</h2>
          <p>All data is transmitted over HTTPS. Passwords are hashed using bcrypt. We conduct regular security reviews and follow industry best practices.</p>

          <h2>9. Children</h2>
          <p>Our service is not directed at children under 16. We do not knowingly collect data from minors.</p>

          <h2>10. Changes to this policy</h2>
          <p>We may update this policy from time to time. We will notify you by email of material changes. Continued use of the service after changes constitutes acceptance.</p>

          <h2>11. Contact</h2>
          <p>For any privacy-related questions: <a href="mailto:privacy@rovestack.com">privacy@rovestack.com</a></p>
        </div>

        <div className="legal-footer">
          <Link href="/terms" className="legal-link">Terms of Service →</Link>
        </div>
      </div>
    </div>
  );
}
