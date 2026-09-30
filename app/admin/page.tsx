"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AdminSessionResponse = {
  authenticated?: boolean;
  user?: {
    id?: string;
    email?: string;
  };
};

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const data = (await response.json().catch(() => null)) as AdminSessionResponse | null;

        if (!isActive) {
          return;
        }

        if (!response.ok || data?.authenticated !== true) {
          router.replace("/admin/login");
          return;
        }

        setEmail(data?.user?.email ?? "");
      } catch {
        router.replace("/admin/login");
        return;
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

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        router.replace("/admin/login");
        return;
      }

      router.replace("/admin/login");
    } catch {
      router.replace("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 text-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
            <span className="text-sm font-medium text-slate-600">Checking session...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  PowerWave AV
                </div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin Dashboard</h1>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </header>

          <section className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 sm:px-5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700">Signed in</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{email || "Admin"}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/admin/repairs"
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50"
              >
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-lg font-semibold text-sky-700">
                  R
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Repair management</h2>
                <p className="mt-2 text-sm text-slate-600">View customer repair requests and ticket details.</p>
              </Link>

              <Link
                href="/admin/products"
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50"
              >
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-lg font-semibold text-sky-700">
                  P
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Product management</h2>
                <p className="mt-2 text-sm text-slate-600">Manage product content and configuration.</p>
              </Link>

              <Link
                href="/admin/categories"
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50"
              >
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-lg font-semibold text-sky-700">
                  C
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Category management</h2>
                <p className="mt-2 text-sm text-slate-600">Organize product categories and taxonomy.</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
