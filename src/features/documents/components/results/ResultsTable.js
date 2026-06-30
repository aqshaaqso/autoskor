import { createElement as h } from "react";
import {
  formatNilaiRasio,
  formatNumber,
  formatSkor,
} from "@/shared/utils/format";

function getIndicatorCardStyles(status) {
  switch (status) {
    case "Hijau":
      return {
        border: "border-success-200 hover:border-success-300",
        score: "text-success-600",
      };
    case "Kuning":
      return {
        border: "border-warning-200 hover:border-warning-300",
        score: "text-warning-600",
      };
    case "Merah":
      return {
        border: "border-danger-200 hover:border-danger-300",
        score: "text-danger-600",
      };
    default:
      return {
        border: "border-slate-200 hover:border-slate-300",
        score: "text-slate-600",
      };
  }
}

function IndicatorScoreCard({ row }) {
  const styles = getIndicatorCardStyles(row.status);
  const title = `${row.aspek} - ${row.komponen}`;

  return h(
    "article",
    {
      className: `flex h-full flex-col justify-between rounded-2xl border bg-white p-5 transition-all duration-300 hover:-translate-y-1 ${styles.border}`,
      title,
    },
    h(
      "div",
      null,
      h(
        "h4",
        {
          className:
            "mb-3 line-clamp-2 text-sm font-bold leading-snug text-slate-700",
        },
        title,
      ),
      h(
        "div",
        { className: "space-y-1.5" },
        h(
          "div",
          { className: "flex justify-between text-xs" },
          h(
            "span",
            { className: "font-medium text-slate-400" },
            "Rasio Keuangan:",
          ),
          h(
            "span",
            { className: "font-bold text-slate-700" },
            row.nilaiRasio === 0
              ? "0%"
              : formatNilaiRasio(row.nilaiRasio, row.skor),
          ),
        ),
        h(
          "div",
          { className: "flex justify-between text-xs" },
          h(
            "span",
            { className: "font-medium text-slate-400" },
            "Nilai Matriks:",
          ),
          h(
            "span",
            { className: "font-bold text-slate-700" },
            `${formatNumber(row.nilai, 0)} / 100`,
          ),
        ),
      ),
    ),
    h(
      "div",
      {
        className:
          "mt-4 flex items-center justify-between border-t border-slate-100 pt-3",
      },
      h(
        "span",
        {
          className:
            "text-[10px] font-bold uppercase tracking-wider text-slate-400",
        },
        "Skor Akhir",
      ),
      h(
        "span",
        { className: `text-base font-extrabold ${styles.score}` },
        formatSkor(row.skor),
      ),
    ),
  );
}

export function ResultsTable({ detail = [] }) {
  if (detail.length === 0) return null;

  return h(
    "div",
    {
      className:
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8",
    },
    h(
      "h3",
      { className: "mb-6 text-lg font-semibold text-slate-800" },
      "Detail Penilaian Indikator",
    ),
    h(
      "div",
      { className: "grid grid-cols-2 gap-6" },
      detail.map((row, index) =>
        h(IndicatorScoreCard, {
          key: `${row.aspek}-${row.komponen}-${index}`,
          row,
        }),
      ),
    ),
  );
}
