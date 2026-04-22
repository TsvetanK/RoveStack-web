import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-modal auth-modal--standalone">
        <RegisterForm />
      </div>
    </div>
  );
}
