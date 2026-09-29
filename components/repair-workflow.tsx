import { CheckCircle } from "@/components/icons";

export const repairStages = [
  "Request Received",
  "Appointment Scheduled",
  "Device Received",
  "Diagnosis + Quote",
  "Awaiting Customer Approval",
  "Awaiting Parts",
  "Repair In Progress",
  "Testing / Quality Check",
  "Ready for Collection",
  "Completed",
] as const;

export function RepairWorkflow({ currentStage }: { currentStage?: number }) {
  if (currentStage === undefined) {
    return (
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {repairStages.map((stage, index) => (
          <li key={stage} className="flex min-h-24 items-start gap-3 rounded-xl border border-[var(--color-border)] bg-white p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-semibold text-[var(--color-primary)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="pt-1 text-sm font-medium leading-5 text-slate-800">{stage}</span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="space-y-0">
      {repairStages.map((stage, index) => {
        const complete = index < currentStage;
        const current = index === currentStage;

        return (
          <li key={stage} className="relative flex min-h-14 gap-4 pb-4 last:min-h-0 last:pb-0">
            {index < repairStages.length - 1 ? (
              <span className={`absolute bottom-0 left-[13px] top-7 border-l-2 ${complete ? "border-[var(--color-primary)]/50" : "border-slate-200"}`} aria-hidden="true" />
            ) : null}
            <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${complete ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : current ? "border-[var(--color-primary)] bg-white text-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/10" : "border-slate-300 bg-white text-slate-400"}`}>
              {complete ? <CheckCircle size={17} /> : <span className="h-2 w-2 rounded-full bg-current" />}
            </span>
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pt-0.5">
              <span className={`text-sm ${current ? "font-semibold text-slate-950" : complete ? "font-medium text-slate-700" : "text-slate-500"}`}>{stage}</span>
              {current ? <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">Current status</span> : null}
              {complete ? <span className="text-xs font-medium text-slate-500">Complete</span> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}