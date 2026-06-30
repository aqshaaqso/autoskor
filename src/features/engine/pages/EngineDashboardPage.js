import { createElement as h } from "react";
import { Cpu, Loader2, RefreshCw } from "lucide-react";
import { useEngineStatus } from "../hooks/useEngineStatus";
import { WorkerSection } from "../components/WorkerSection";
import { ClusterStatusPanel } from "../components/ClusterStatusPanel";
import { EngineStatsGrid } from "../components/EngineStatsGrid";
import { RecentActivityList } from "../components/RecentActivityList";

const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50";

export function EngineDashboardPage() {
  const { engineStatus, isLoading, error, loadEngineStatus, isInitialLoading } =
    useEngineStatus();

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
          "Pantau worker dan antrian pemrosesan dokumen.",
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
        "Muat Ulang",
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

    engineStatus?.engineApiUnavailable &&
      h(
        "div",
        {
          className:
            "mb-4 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-800",
        },
        "Status engine tidak tersedia. Menampilkan data dari antrian dokumen saja.",
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
            h(ClusterStatusPanel, { engineStatus }),
            // WorkerSection dipindahkan ke sini (setelah ClusterStatusPanel)
            h(WorkerSection, {
              engines: engineStatus.engines ?? [],
              workers: engineStatus.workers ?? [],
              healthStatus: engineStatus.healthStatus ?? null,
              engineCount:
                engineStatus.engineTotals?.total ??
                engineStatus.engines?.length ??
                0,
              workerCount: engineStatus.workerCount ?? 0,
              activeWorkerCount: engineStatus.activeWorkerCount ?? 0,
            }),
            h(EngineStatsGrid, { engineStatus }),
            h(RecentActivityList, { items: engineStatus.recentActivity }),
          ),
  );
}
