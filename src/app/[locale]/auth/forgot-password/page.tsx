import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-modal auth-modal--standalone">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
