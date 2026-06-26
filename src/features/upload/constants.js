export const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

export function getQueueStatusLabel(status) {
  switch (status) {
    case "pending":
      return "pending";
    case "uploading":
      return "uploading";
    case "failed":
      return "failed";
    default:
      return status;
  }
}

export function getQueueStatusClasses(status) {
  switch (status) {
    case "pending":
      return "bg-warning-100 text-warning-700 border-warning-500/30";
    case "uploading":
      return "bg-primary-100 text-primary-700 border-primary-500/30";
    case "failed":
      return "bg-danger-100 text-danger-700 border-danger-500/30";
    default:
      return "bg-slate-100 text-slate-600 border-slate-300";
  }
}
