import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <section className="w-full max-w-md space-y-4">{children}</section>
      <nav
        aria-label="Authentication"
        className="flex flex-wrap justify-center gap-4 text-sm underline"
      >
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
        <Link href="/auth/forgot-password">Forgot password</Link>
      </nav>
    </main>
  );
}
