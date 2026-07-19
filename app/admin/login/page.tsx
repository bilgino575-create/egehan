"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Lock, LogIn, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="glass w-full max-w-sm rounded-3xl p-8 shadow-2xl">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-orange-500 text-lg font-extrabold text-navy-950">
          EL
        </span>
        <h1 className="text-xl font-extrabold text-navy-950 dark:text-white">
          Egehan Admin Panel
        </h1>
        <p className="text-sm text-muted">Devam etmek için giriş yapın</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55">
            E-posta
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-navy-900/40 dark:text-white/35" aria-hidden="true" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-navy-950/15 bg-white py-3 pl-10 pr-4 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/55">
            Şifre
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-navy-900/40 dark:text-white/35" aria-hidden="true" />
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-navy-950/15 bg-white py-3 pl-10 pr-4 text-sm text-navy-950 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-bold text-navy-950 shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-400 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
          ) : (
            <LogIn className="size-4.5" aria-hidden="true" />
          )}
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy-50 px-4 dark:bg-deep-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(75%_60%_at_50%_35%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 right-[-10%] -z-10 size-[480px] rounded-full bg-orange-500/15 blur-3xl dark:bg-orange-500/10"
      />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
