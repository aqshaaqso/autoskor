import { createElement as h } from "react";
import { Loader2 } from "lucide-react";
import { isEngineWorkingStatus } from "@/shared/utils/engineStatusLabels";
import {
  getClusterStatusClasses,
  getClusterStatusLabel,
} from "../utils/clusterStatus";

function getEngineCardStyles(status) {
  switch (status) {
    case "working":
    case "running":
      return {
        border: "border-primary-200 hover:border-primary-300",
        accent: "text-primary-600",
      };
    case "busy":
    case "stop":
    case "stopped":
      return {
        border: "border-danger-200 hover:border-danger-300",
        accent: "text-danger-600",
      };
    case "waiting":
      return {
        border: "border-warning-200 hover:border-warning-300",
        accent: "text-warning-600",
      };
    default:
      return {
        border: "border-success-200 hover:border-success-300",
        accent: "text-success-600",
      };
  }
}

function WorkerRow({ worker }) {
  const jobName = worker.currentDocument?.fileName;

  return h(
    "div",
    {
      className:
        "rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5",
    },
    h(
      "p",
      { className: "truncate text-sm font-semibold text-slate-800" },
      worker.name,
    ),
  );
}

export function EngineColumnCard({ engine }) {
  const styles = getEngineCardStyles(engine.uiStatus);
  const workers = engine.workers ?? [];
  const activeWorkerCount = engine.activeCount ?? 0;

  return h(
    "article",
    {
      className: `flex h-full flex-col rounded-2xl border bg-white p-5 transition-all duration-300 hover:-translate-y-1 ${styles.border}`,
    },
    h(
      "div",
      { className: "mb-4 border-b border-slate-100 pb-4" },
      h(
        "div",
        { className: "flex items-start justify-between gap-3" },
        h(
          "div",
          { className: "min-w-0" },
          h(
            "h4",
            {
              className:
                "truncate text-base font-bold leading-snug text-slate-800",
            },
            engine.name,
          ),
          h(
            "p",
            { className: "mt-1 text-xs text-slate-500" },
            engine.workerClusterStatus
              ? `Cluster ${engine.workerClusterStatus}`
              : "Cluster engine",
          ),
        ),
        h(
          "span",
          {
            className: `inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getClusterStatusClasses(engine.uiStatus)}`,
          },
          isEngineWorkingStatus(engine.uiStatus) &&
            h(Loader2, { className: "h-3 w-3 animate-spin" }),
          getClusterStatusLabel(engine.uiStatus),
        ),
      ),
      h(
        "p",
        { className: `mt-3 text-sm font-semibold ${styles.accent}` },
        `${activeWorkerCount} dari ${engine.workerCount ?? workers.length} worker aktif`,
      ),
    ),
    workers.length > 0
      ? h(
          "div",
          { className: "space-y-2" },
          workers.map((worker) => h(WorkerRow, { key: worker.id, worker })),
        )
      : h(
          "p",
          {
            className:
              "rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500",
          },
          "Belum ada worker aktif.",
        ),
  );
}
