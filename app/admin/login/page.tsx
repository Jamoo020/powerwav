"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const data = await response.json().catch(() => null);

        if (!isActive) {
          return;
        }

        if (response.ok && data?.authenticated === true) {
          router.replace("/admin");
        }
      } catch {
        // Ignore session-check failures and allow the user to sign in.
      } finally {
        if (isActive) {
          setIsCheckingSession(false);
        }
      }
    }

    void checkSession();

    return () => {
      isActive = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => ({ ok: false, message: "Authentication failed." }));

      if (!response.ok || data?.ok === false) {
        setError("Invalid email or password.");
        return;
      }

      router.replace("/admin");
    } catch {
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
            <span className="text-sm font-medium text-slate-300">Checking session...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-sm sm:p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            PowerWave AV
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Admin Access</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your AV operations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              placeholder="name@powerwaveav.com"
              disabled={isLoading}
              aria-label="Email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              placeholder="••••••••"
              disabled={isLoading}
              aria-label="Password"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200" role="alert">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-sky-500/70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/60 border-t-transparent" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
