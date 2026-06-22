import { createElement as h, useCallback, useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Cpu,
  Loader2,
  RefreshCw,
  Timer,
} from "lucide-react";
import { getEngineStatus } from "@/features/engine/api/engineApi";
import { WorkerSection } from '@/features/engine/components/WorkerSection'
import { DocumentStatusBadge } from "@/features/documents/components/DocumentStatusBadge";
import { formatDateTime } from "@/shared/utils/format";

const POLL_INTERVAL_MS = 3000;

const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50";

function getClusterStatusLabel(status) {
  switch (status) {
    case "running":
      return "Running";
    case "waiting":
      return "Waiting";
    case "idle":
    default:
      return "Idle";
  }
}

function getClusterStatusClasses(status) {
  switch (status) {
    case "running":
      return "border-primary-200 bg-primary-50 text-primary-700";
    case "waiting":
      return "border-warning-200 bg-warning-50 text-warning-700";
    case "idle":
    default:
      return "border-success-200 bg-success-50 text-success-700";
  }
}

function StatCard({ icon: Icon, label, value, hint, accentClass }) {
  return h(
    "div",
    {
      className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
    },
    h(
      "div",
      { className: "mb-3 flex items-center justify-between" },
      h("p", { className: "text-sm font-medium text-slate-500" }, label),
      h(
        "div",
        {
          className: `flex h-9 w-9 items-center justify-center rounded-lg ${accentClass}`,
        },
        h(Icon, { className: "h-4 w-4" }),
      ),
    ),
    h("p", { className: "text-2xl font-bold text-slate-900" }, value),
    hint && h("p", { className: "mt-1 text-xs text-slate-500" }, hint),
  );
}

export function EngineDashboardPage() {
  const [engineStatus, setEngineStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEngineStatus = useCallback(async () => {
    try {
      const data = await getEngineStatus();
      setEngineStatus(data);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat status worker.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEngineStatus();
  }, [loadEngineStatus]);

  useEffect(() => {
    if (!engineStatus) return;

    const shouldPoll =
      engineStatus.isRunning ||
      engineStatus.queueLength > 0 ||
      engineStatus.processingCount > 0;

    if (!shouldPoll) return;

    const interval = setInterval(
      () => void loadEngineStatus(),
      POLL_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [engineStatus, loadEngineStatus]);

  const isInitialLoading = isLoading && !engineStatus;
  const clusterStatus = engineStatus?.clusterStatus ?? engineStatus?.status;

  return h(
    "div",
    { className: "mx-auto max-w-6xl px-6 py-8" },
    h(
      "div",
      { className: "mb-8 flex items-start justify-between gap-4" },
      h(
        "div",
        null,
        h(
          "div",
          { className: "mb-2 flex items-center gap-2" },
          h(Cpu, { className: "h-6 w-6 text-primary-600" }),
          h(
            "h1",
            { className: "text-2xl font-bold text-slate-900" },
            "Engine Dashboard",
          ),
        ),
        h(
          "p",
          { className: "text-slate-500" },
          "Pantau cluster worker dan antrian pemrosesan dokumen. Hanya dapat diakses admin.",
        ),
      ),
      h(
        "button",
        {
          type: "button",
          className: btnSecondary,
          onClick: () => void loadEngineStatus(),
          disabled: isLoading,
        },
        isLoading
          ? h(Loader2, { className: "h-4 w-4 animate-spin" })
          : h(RefreshCw, { className: "h-4 w-4" }),
        "Refresh",
      ),
    ),
    error &&
      h(
        "div",
        {
          className:
            "mb-4 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700",
        },
        error,
      ),
    isInitialLoading
      ? h(
          "div",
          {
            className:
              "flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-slate-500",
          },
          h(Loader2, { className: "mr-2 h-5 w-5 animate-spin" }),
          "Memuat status worker...",
        )
      : engineStatus &&
          h(
            "div",
            { className: "space-y-6" },
            h(
              "div",
              {
                className:
                  "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
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
                    "div",
                    { className: "mt-2 flex items-center gap-3" },
                    h(
                      "span",
                      {
                        className: `inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getClusterStatusClasses(clusterStatus)}`,
                      },
                      getClusterStatusLabel(clusterStatus),
                    ),
                    engineStatus.isRunning &&
                      h(Loader2, {
                        className: "h-4 w-4 animate-spin text-primary-600",
                      }),
                  ),
                  h(
                    "p",
                    { className: "mt-2 text-sm text-slate-500" },
                    `${engineStatus.activeWorkerCount ?? 0} dari ${engineStatus.workerCount ?? engineStatus.workers?.length ?? 0} worker aktif`,
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
            ),
            h(
              "div",
              { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" },
              h(StatCard, {
                icon: Clock3,
                label: "Dalam Antrian",
                value: String(engineStatus.queueLength),
                hint: "Menunggu worker",
                accentClass: "bg-warning-50 text-warning-700",
              }),
              h(StatCard, {
                icon: Activity,
                label: "Sedang Diproses",
                value: String(engineStatus.processingCount),
                hint: "Dokumen parallel",
                accentClass: "bg-primary-50 text-primary-700",
              }),
              h(StatCard, {
                icon: Timer,
                label: "Selesai Hari Ini",
                value: String(engineStatus.processedToday),
                hint: "Dokumen done hari ini",
                accentClass: "bg-success-50 text-success-700",
              }),
              h(StatCard, {
                icon: CheckCircle2,
                label: "Total Selesai",
                value: String(engineStatus.completedTotal),
                hint:
                  engineStatus.failedTotal > 0
                    ? `${engineStatus.failedTotal} gagal`
                    : "Semua berhasil",
                accentClass: "bg-slate-100 text-slate-700",
              }),
            ),
            h(
              "div",
              {
                className:
                  "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
              },
              h(
                "h2",
                { className: "text-lg font-semibold text-slate-900" },
                "Aktivitas Terbaru",
              ),
              engineStatus.recentActivity.length > 0
                ? h(
                    "div",
                    { className: "mt-4 divide-y divide-slate-100" },
                    engineStatus.recentActivity.map((item) =>
                      h(
                        "div",
                        {
                          key: item.id,
                          className:
                            "flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0",
                        },
                        h(
                          "div",
                          { className: "min-w-0" },
                          h(
                            "p",
                            {
                              className:
                                "truncate text-sm font-medium text-slate-900",
                            },
                            item.fileName,
                          ),
                          h(
                            "p",
                            { className: "text-xs text-slate-500" },
                            formatDateTime(item.timestamp),
                            item.workerId &&
                              h(
                                "span",
                                { className: "text-slate-400" },
                                ` · ${item.workerId}`,
                              ),
                          ),
                        ),
                        h(DocumentStatusBadge, { status: item.status }),
                      ),
                    ),
                  )
                : h(
                    "p",
                    {
                      className:
                        "mt-4 rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500",
                    },
                    "Belum ada aktivitas worker.",
                  ),
            ),
            h(WorkerSection, { workers: engineStatus.workers ?? [] }),
          ),
  );
}
