import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 py-20 text-slate-900">
      <div className="max-w-2xl rounded-[2rem] border border-[var(--color-border)] bg-white p-10 shadow-sm text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">The page you are looking for is not available.</h1>
        <p className="mt-4 text-lg text-[var(--color-muted)]">It may have moved, or you may have entered the wrong address. Let’s get you back to the main site.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#105cda]">Back home <ArrowRight size={18} /></Link>
          <Link href="/contact" className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">Contact us</Link>
        </div>
      </div>
    </div>
  );
}
