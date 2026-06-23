import { createElement as h, useEffect } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { useAuthStore } from '@/features/auth'
import { useDocumentStore } from '../store/useDocumentStore'
import { DocumentTable } from '../components/DocumentTable'

const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50";

export function QueuePage() {
  const isAdmin = useAuthStore((state) => state.user?.role === "admin");
  const { queueDocuments, isLoadingQueue, listError, fetchQueueDocuments } =
    useDocumentStore();

  useEffect(() => {
    void fetchQueueDocuments();
  }, [fetchQueueDocuments]);

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
          "h1",
          { className: "text-2xl font-bold text-slate-900" },
          "Antrian Dokumen",
        ),
        h(
          "p",
          { className: "mt-2 text-slate-500" },
          "Dokumen yang sudah diupload dan menunggu atau sedang diproses oleh worker.",
        ),
      ),
      h(
        "button",
        {
          type: "button",
          className: btnSecondary,
          onClick: () => void fetchQueueDocuments(),
          disabled: isLoadingQueue,
        },
        isLoadingQueue
          ? h(Loader2, { className: "h-4 w-4 animate-spin" })
          : h(RefreshCw, { className: "h-4 w-4" }),
        "Refresh",
      ),
    ),
    listError &&
      h(
        "div",
        {
          className:
            "mb-4 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700",
        },
        listError,
      ),
    isLoadingQueue && queueDocuments.length === 0
      ? h(
          "div",
          {
            className: "flex items-center justify-center py-16 text-slate-500",
          },
          h(Loader2, { className: "mr-2 h-5 w-5 animate-spin" }),
          "Memuat antrian...",
        )
      : h(DocumentTable, {
          documents: queueDocuments,
          showWorker: true,
          showUploader: isAdmin,
          emptyMessage: "Belum ada dokumen dalam antrian.",
        }),
  );
}
