import { createElement as h } from "react";
import { formatDateTime } from "@/shared/utils/format";

export function ClusterStatusPanel({ engineStatus }) {
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
          "Status Worker",
        ),
        h(
          "p",
          { className: "mt-2 text-sm text-slate-700" },
          h(
            "span",
            { className: "font-semibold text-slate-900" },
            `${engineStatus.activeWorkerCount ?? engineStatus.workerCount ?? 0}`,
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
            `${formatProcessingTime(engineStatus.averageProcessingMs)} / dokumen`,
          ),
        ),
      ),
    ),
  );
}


