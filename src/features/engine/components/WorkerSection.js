import { createElement as h, useState } from "react";
import { ChevronDown, Server } from "lucide-react";
import { EngineWorkersGrid } from "./EngineWorkersGrid";

function resolveEngineColumns(engines = [], workers = []) {
  if (engines.length > 0) return engines;

  if (!workers.length) return [];

  return [
    {
      id: "antrian",
      name: "Dari antrian dokumen",
      uiStatus: workers.some(
        (worker) => worker.status === "working" || worker.status === "running",
      )
        ? "working"
        : "idle",
      workerClusterStatus: null,
      activeCount: workers.length,
      workers,
    },
  ];
}

function countActiveWorkers(engines) {
  return engines.reduce(
    (total, engine) => total + (engine.activeCount ?? 0),
    0,
  );
}

function countTotalWorkers(engines) {
  return engines.reduce(
    (total, engine) =>
      total + (engine.workerCount ?? engine.workers?.length ?? 0),
    0,
  );
}

function formatEngineWorkerTitle(engineCount, workerCount) {
  if (engineCount > 0 || workerCount > 0) {
    return `${engineCount} Engine, ${workerCount} Worker`;
  }

  return "Engine & Worker";
}

export function WorkerSection({
  engines = [],
  workers = [],
  healthStatus = null,
  engineCount,
  workerCount,
  activeWorkerCount,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const columns = resolveEngineColumns(engines, workers);
  const resolvedEngineCount = engineCount ?? columns.length;
  const resolvedWorkerCount = workerCount ?? countTotalWorkers(columns);
  const resolvedActiveWorkerCount =
    activeWorkerCount ?? countActiveWorkers(columns);

  return h(
    "div",
    {
      className:
        "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
    },
    h(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen((open) => !open),
        className:
          "flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-slate-50",
        "aria-expanded": isOpen,
      },
      h(
        "div",
        { className: "flex items-center gap-2" },
        h(Server, { className: "h-5 w-5 text-slate-600" }),
        h(
          "h2",
          { className: "text-lg font-semibold text-slate-900" },
          formatEngineWorkerTitle(resolvedEngineCount, resolvedWorkerCount),
        ),
        h(
          "span",
          { className: "text-sm text-slate-500" },
          `${resolvedActiveWorkerCount} aktif`,
        ),
      ),
      h(ChevronDown, {
        className: `h-5 w-5 shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`,
      }),
    ),
    isOpen &&
      h(
        "div",
        { className: "border-t border-slate-200 p-6" },
        h(EngineWorkersGrid, { engines: columns, healthStatus }),
      ),
  );
}
