"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  qrCode: string | null;
  smdpAddress: string | null;
  activationCode: string | null;
}

type Method = "qr" | "manual";

export function InstallGuideModal({ open, onClose, qrCode, smdpAddress, activationCode }: Props) {
  const [method, setMethod] = useState<Method>("qr");
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  if (!open) return null;

  const qrSteps = [
    { icon: "⚙️", title: "Open Settings", desc: "Go to Settings on your device." },
    { icon: "📶", title: "Cellular / Mobile Data", desc: "Tap \"Cellular\" (iOS) or \"Network & Internet\" (Android)." },
    { icon: "➕", title: "Add eSIM", desc: "Tap \"Add eSIM\" or \"Add mobile plan\"." },
    { icon: "📷", title: "Scan QR code", desc: "Choose \"Use QR code\" and scan the QR code from this page." },
    { icon: "✅", title: "Confirm", desc: "Follow the on-screen prompts to complete the installation." },
  ];

  const manualSteps = [
    { icon: "⚙️", title: "Open Settings", desc: "Go to Settings on your device." },
    { icon: "📶", title: "Cellular / Mobile Data", desc: "Tap \"Cellular\" (iOS) or \"Network & Internet\" (Android)." },
    { icon: "➕", title: "Add eSIM", desc: "Tap \"Add eSIM\" or \"Add mobile plan\"." },
    { icon: "⌨️", title: "Enter details manually", desc: "Choose \"Enter details manually\" or \"Enter activation code\"." },
    { icon: "🔗", title: "SM-DP+ Address", desc: "Enter the SM-DP+ address below.", copy: { value: smdpAddress, key: "smdp" } },
    { icon: "🔑", title: "Activation code", desc: "Enter the activation code below.", copy: { value: activationCode, key: "code" } },
    { icon: "✅", title: "Confirm", desc: "Follow the on-screen prompts to complete the installation." },
  ];

  const steps = method === "qr" ? qrSteps : manualSteps;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="How to install your eSIM"
      subtitle="Follow the steps below to activate your plan"
      maxWidth={520}
    >
        {/* Method tabs */}
        <div className="ig-tabs">
          <div className="countries-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={method === "qr"}
              onClick={() => setMethod("qr")}
              className={`tab-btn${method === "qr" ? " active" : ""}`}
            >
              📷 QR Code
            </button>
            <button
              role="tab"
              aria-selected={method === "manual"}
              onClick={() => setMethod("manual")}
              className={`tab-btn${method === "manual" ? " active" : ""}`}
            >
              ⌨️ Manual entry
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="ig-steps">
          {steps.map((step, i) => (
            <div key={i} className="ig-step">
              <div className="ig-step-left">
                <div className="ig-step-num">{i + 1}</div>
                {i < steps.length - 1 && <div className="ig-step-line" />}
              </div>
              <div className="ig-step-body">
                <div className="ig-step-title">
                  <span>{step.icon}</span> {step.title}
                </div>
                <div className="ig-step-desc">{step.desc}</div>
                {"copy" in step && step.copy?.value && (
                  <div className="ig-copy-row">
                    <span className="ig-copy-value">{step.copy.value}</span>
                    <button
                      className="od-copy-btn"
                      onClick={() => copy(step.copy!.value!, step.copy!.key)}
                    >
                      {copied === step.copy.key ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="ig-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M12 8v5m0 3v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Make sure your device supports eSIM and is connected to Wi-Fi before installing.
        </div>
    </Modal>
  );
}
