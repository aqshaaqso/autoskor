import { useCallback, createElement as h, Fragment } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, AlertCircle, Loader2 } from "lucide-react";
import { useKoperasiStore } from "@/store/useKoperasiStore";
import { formatFileSize } from "@/utils/colorGrading";

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-3 py-1.5 text-base font-medium text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2";

function FilePreview({ file, onRemove, onProcess, isProcessing }) {
  return h(
    "div",
    {
      className:
        "flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm",
    },
    h(
      "div",
      { className: "flex items-center gap-3" },
      h(
        "div",
        {
          className:
            "flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100",
        },
        h(FileText, { className: "h-5 w-5 text-primary-600" }),
      ),
      h(
        "div",
        null,
        h("p", { className: "text-lg font-medium text-slate-800" }, file.name),
        h(
          "p",
          { className: "text-base text-slate-500" },
          formatFileSize(file.size),
        ),
      ),
    ),
    h(
      "div",
      { className: "flex items-center gap-2" },
      h(
        "button",
        {
          type: "button",
          className: btnGhost,
          disabled: isProcessing,
          onClick: (e) => {
            e.stopPropagation();
            onRemove();
          },
        },
        h(X, { className: "h-4 w-4" }),
        "Hapus",
      ),
      h(
        "button",
        {
          type: "button",
          className: btnPrimary,
          onClick: onProcess,
          disabled: isProcessing,
        },
        isProcessing
          ? h(Fragment, null, h(Loader2, { className: "h-4 w-4 animate-spin" }), "Memproses...")
          : "Proses Sekarang",
      ),
    ),
  );
}

export function UploadArea() {
  const {
    currentFile,
    isProcessing,
    error,
    setFile,
    clearFile,
    processFile,
    resetResults,
  } = useKoperasiStore();

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        resetResults();
      }
    },
    [setFile, resetResults],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxFiles: 1,
      multiple: false,
      disabled: isProcessing,
    });

  const dropzoneClass = isDragReject
    ? "border-danger-400 bg-danger-50"
    : isDragActive
      ? "border-primary-500 bg-primary-50"
      : "border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50";

  return h(
    "div",
    { className: "space-y-6" },
    h(
      "div",
      {
        ...getRootProps(),
        className: `relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${dropzoneClass} ${isProcessing ? "pointer-events-none opacity-80" : ""}`,
      },
      h("input", getInputProps()),
      h(
        "div",
        {
          className:
            "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100",
        },
        h(Upload, { className: "h-8 w-8 text-primary-600" }),
      ),
      h(
        "h3",
        { className: "text-xl font-semibold text-slate-800" },
        isDragActive
          ? "Lepaskan dokumen di sini..."
          : "Upload Dokumen RAT Disini",
      ),
      h(
        "p",
        { className: "mt-2 text-base text-slate-500" },
        "tarik dan lepas atau klik untuk memilih dokumen",
      ),
      h(
        "p",
        { className: "mt-4 text-sm text-slate-400" },
        "Format yang didukung: PDF (maks. 20 MB)",
      ),
    ),
    currentFile &&
      h(FilePreview, {
        file: currentFile,
        isProcessing,
        onRemove: () => {
          if (isProcessing) return;
          clearFile();
          resetResults();
        },
        onProcess: () => void processFile(),
      }),
    error &&
      h(
        "div",
        {
          className:
            "flex items-start gap-3 rounded-lg border border-danger-200 bg-danger-50 p-4",
        },
        h(AlertCircle, {
          className: "mt-0.5 h-5 w-5 shrink-0 text-danger-600",
        }),
        h(
          "div",
          null,
          h(
            "p",
            { className: "font-medium text-danger-800" },
            "Terjadi Kesalahan",
          ),
          h("p", { className: "mt-1 text-sm text-danger-600" }, error),
        ),
      ),
  );
}
