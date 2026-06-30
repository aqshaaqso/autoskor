import { createElement as h } from "react";
import { formatDateTime } from "@/shared/utils/format";

export function ClusterStatusPanel({ engineStatus }) {
  const engineCount =
    engineStatus.engineTotals?.total ?? engineStatus.engines?.length ?? 0;
  const activeWorkerCount =
    engineStatus.activeWorkerCount ?? engineStatus.workerCount ?? 0;
  const workerCount = engineStatus.workerCount ?? activeWorkerCount;

  // Helper untuk format waktu proses
  const formatProcessingTime = (ms) => {
    if (!ms) return "0 detik";

    const minutes = ms / 60000;

    if (minutes < 1) {
      const seconds = Math.round(ms / 1000);
      return `${seconds} detik`;
    } else if (minutes < 60) {
      return `${minutes.toFixed(1)} menit`;
    } else {
      return `${Math.round(minutes)} menit`;
    }
  };

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
          "Status Engine",
        ),
        h(
          "p",
          { className: "mt-2 text-sm text-slate-700" },
          h(
            "span",
            { className: "font-semibold text-slate-900" },
            `${engineCount}`,
          ),
          " engine, ",
          h(
            "span",
            { className: "font-semibold text-slate-900" },
            `${activeWorkerCount}`,
          ),
          ` dari ${workerCount} worker aktif`,
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
            `${formatProcessingTime(engineStatus.averageProcessingMs)} / dokumen`,
          ),
        ),
      ),
    ),
  );
}


