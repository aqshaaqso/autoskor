import { createElement as h } from "react";
import { getPredikatClasses } from "@/shared/utils/colorGrading";
import { getCooperativeGeneralInfo } from "@/shared/utils/extractedIndicators";
import { formatSkor } from "@/shared/utils/format";

function PartialScoreMetric({
  label,
  value,
  valueClassName = "text-slate-800",
  isLast = false,
}) {
  return h(
    "div",
    {
      className: isLast ? "" : "border-b border-slate-200/80 pb-3",
    },
    h(
      "p",
      {
        className: "text-xs font-medium uppercase tracking-wide text-slate-400",
      },
      label,
    ),
    h(
      "p",
      {
        className: `mt-1 text-sm font-semibold leading-snug ${valueClassName}`,
      },
      value,
    ),
  );
}

export function ScoreSummary({ results, extractedIndicators }) {
  const predikatClass = getPredikatClasses(results.predikat);
  const bobotParsial = results.bobotDapatDihitung ?? 85;
  const cooperativeInfo = getCooperativeGeneralInfo(extractedIndicators);
  const detail = results.detail ?? [];
  const scoredIndicatorCount = detail.filter(
    (row) => Number(row.skor ?? 0) > 0,
  ).length;
  const totalIndicatorCount = detail.length;

  return h(
    "div",
    { className: "rounded-xl border border-slate-200 bg-white p-6 shadow-sm" },
    h(
      "h3",
      { className: "mb-4 text-lg font-semibold text-slate-800" },
      "Ringkasan Penilaian",
    ),
    h(
      "div",
      { className: "grid gap-4 sm:grid-cols-3" },
      h(
        "div",
        { className: "rounded-lg bg-slate-50 p-4" },
        h(
          "p",
          {
            className: "mb-3 text-center text-sm font-medium text-slate-500",
          },
          "Informasi Umum Koperasi",
        ),
        h(
          "div",
          { className: "space-y-3" },
          cooperativeInfo.length > 0
            ? cooperativeInfo.map((item, index) =>
                h(
                  "div",
                  {
                    key: item.label,
                    className: `${
                      index < cooperativeInfo.length - 1
                        ? "border-b border-slate-200/80 pb-3"
                        : ""
                    }`,
                  },
                  h(
                    "p",
                    {
                      className:
                        "text-xs font-medium uppercase tracking-wide text-slate-400",
                    },
                    item.label,
                  ),
                  h(
                    "p",
                    {
                      className: `mt-1 text-sm font-semibold leading-snug ${
                        item.displayValue === "-"
                          ? "text-slate-400"
                          : "text-slate-800"
                      }`,
                    },
                    item.displayValue,
                  ),
                ),
              )
            : h(
                "p",
                { className: "text-center text-sm text-slate-400" },
                "Data informasi umum belum tersedia.",
              ),
        ),
      ),
      h(
        "div",
        { className: "rounded-lg bg-slate-50 p-4" },
        h(
          "p",
          {
            className: "mb-3 text-center text-sm font-medium text-slate-500",
          },
          "Skor Parsial (Dapat Dihitung)",
        ),
        h(
          "div",
          { className: "space-y-3" },
          h(PartialScoreMetric, {
            label: "Skor Diperoleh",
            value: formatSkor(results.totalSkorParsial),
          }),
          h(PartialScoreMetric, {
            label: "Bobot Maksimal",
            value: String(bobotParsial),
          }),
          h(PartialScoreMetric, {
            label: "Indikator Terhitung",
            value:
              totalIndicatorCount > 0
                ? `${scoredIndicatorCount} dari ${totalIndicatorCount} indikator`
                : "-",
            valueClassName:
              scoredIndicatorCount > 0 ? "text-slate-800" : "text-slate-400",
            isLast: true,
          }),
        ),
      ),
      h(
        "div",
        {
          className:
            "flex flex-col items-center justify-center rounded-lg bg-slate-50 p-4",
        },
        h(
          "p",
          { className: "text-sm font-medium text-slate-500" },
          "Predikat Kesehatan",
        ),
        h(
          "span",
          {
            className: `mt-2 rounded-full px-6 py-2 text-lg font-bold tracking-wide ${predikatClass}`,
          },
          results.predikat,
        ),
      ),
    ),
    results.tidakDapatDihitung &&
      h(
        "p",
        { className: "mt-4 text-xs text-slate-500" },
        `Aspek Manajemen (${results.tidakDapatDihitung.bobot} bobot) tidak dihitung karena data non-keuangan tidak tersedia dalam dokumen.`,
      ),
  );
}
