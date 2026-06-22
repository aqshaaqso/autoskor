import { createElement as h } from "react";
import { UploadArea } from "@/features/upload/components/UploadArea";

export function UploadPage() {
  return h(
    "div",
    { className: "mx-auto max-w-5xl px-6 py-8" },
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
        "Unggah dokumen RAT (PDF/DOCX), maksimal 20 MB per file. Preview dibuka di tab browser baru.",
      ),
    ),
    h(UploadArea),
  );
}
