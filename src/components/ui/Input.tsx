import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[0.88rem] font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={[
          "w-full px-4 py-3",
          "bg-white border rounded-[var(--radius)]",
          "font-[inherit] text-ink text-[0.96rem]",
          "outline-none transition-all duration-200",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-[var(--line-strong)] focus:border-ink focus:ring-2 focus:ring-ink/10",
          "placeholder:text-mute/70",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error && <p className="text-[0.82rem] text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
