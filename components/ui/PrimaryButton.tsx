"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export default function PrimaryButton({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        "bg-brand hover:bg-brand-hover text-white",
        "font-semibold",
        "rounded-xl",
        "px-5 py-3",
        "transition-all duration-200 ease-smooth",
        "shadow-card hover:shadow-soft",
        "active:scale-[0.98]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
