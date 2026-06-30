import { createElement as h } from "react";
import { formatDateTime } from "@/shared/utils/format";

export function ClusterStatusPanel({ engineStatus }) {
  return h(
    "div",
    {
      className: "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
    },
    h(
      "div",
      {
        className:
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
      },
      h(
        "div",
        null,
        h(
          "p",
          { className: "text-sm font-medium text-slate-500" },
          "Status Worker",
        ),
        h(
          "p",
          { className: "mt-2 text-sm text-slate-700" },
          h(
            "span",
            { className: "font-semibold text-slate-900" },
            `${engineStatus.workerCount ?? engineStatus.workers?.length ?? 0} dari ${engineStatus.activeWorkerCount ?? 0}`,
          ),
          " worker aktif",
        ),
      ),
      h(
        "div",
        { className: "text-sm text-slate-500" },
        h(
          "p",
          null,
          "Aktivitas terakhir: ",
          h(
            "span",
            { className: "font-medium text-slate-700" },
            formatDateTime(engineStatus.lastActivityAt),
          ),
        ),
        h(
          "p",
          { className: "mt-1" },
          "Rata-rata proses: ",
          h(
            "span",
            { className: "font-medium text-slate-700" },
            `${Math.round(engineStatus.averageProcessingMs / 1000)} detik / dokumen`,
          ),
        ),
      ),
    ),
  );
}
