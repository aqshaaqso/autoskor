import { createElement as h, Fragment } from "react";
import { RotateCcw } from "lucide-react";
import { UploadArea } from "@/components/UploadArea";
import { ProcessingLoader } from "@/components/ProcessingLoader";
import { ResultsTable } from "@/components/ResultsTable";
import { ScoreSummary } from "@/components/ScoreSummary";
import { TidakDapatDihitungPanel } from "@/components/NonProcessAble";
import { useKoperasiStore } from "@/store/useKoperasiStore";

const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2";

export default function App() {
  const { isProcessing, results, resetResults, clearFile } = useKoperasiStore();

  const handleNewUpload = () => {
    resetResults();
    clearFile();
  };

  return h(
    "div",
    { className: "min-h-screen" },
    h(
      "header",
      {
        className: "border-b border-slate-200 bg-white shadow-sm",
      },
      h(
        "div",
        { className: "mx-auto flex max-w-7xl items-center gap-3 px-6 py-4" },
        h(
          "div",
          {
            className:
              "flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white",
          },
          "AS",
        ),
        h(
          "div",
          null,
          h(
            "p",
            { className: "text-sm font-semibold text-slate-900" },
            "Auto-Skor",
          ),
          h(
            "p",
            { className: "text-xs text-slate-500" },
            "Penilaian Kesehatan Koperasi Based on RAT",
          ),
        ),
      ),
    ),
    h(
      "main",
      { className: "mx-auto max-w-7xl px-6 py-8" },
      h(
        "div",
        { className: "mb-8" },
        h(
          "h1",
          { className: "text-2xl font-bold text-slate-900" },
          "Upload Dokumen RAT",
        ),
        h(
          "p",
          { className: "mt-2 text-slate-500" },
          "Unggah dokumen hasil rapat anggota tahunan untuk menghitung skor kesehatan koperasi.",
        ),
      ),
      isProcessing
        ? h(ProcessingLoader)
        : h(
            Fragment,
            null,
            h(UploadArea),
            results &&
              h(
                "div",
                { className: "mt-10 space-y-6" },
                h(
                  "div",
                  { className: "flex items-center justify-between" },
                  h(
                    "h2",
                    { className: "text-xl font-semibold text-slate-800" },
                    "Hasil Penilaian",
                  ),
                  h(
                    "button",
                    {
                      type: "button",
                      className: btnSecondary,
                      onClick: handleNewUpload,
                    },
                    h(RotateCcw, { className: "h-4 w-4" }),
                    "Upload Baru",
                  ),
                ),
                h(ScoreSummary, { results }),
                h(
                  "div",
                  {
                    className:
                      "grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start",
                  },
                  h(ResultsTable, { detail: results.detail }),
                  h(TidakDapatDihitungPanel, {
                    data: results.tidakDapatDihitung,
                  }),
                ),
              ),
          ),
    ),
  );
}
