/**
 * Label tampilan status engine/worker (Bahasa Indonesia).
 */

export function getEngineClusterStatusLabel(status) {
  switch (status) {
    case "running":
      return "running";
    case "waiting":
      return "waiting";
    case "idle":
    default:
      return "idle";
  }
}

export function getEngineClusterStatusClasses(status) {
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

export function getWorkerStatusLabel(status) {
  switch (status) {
    case "running":
      return "running";
    case "idle":
    default:
      return "idle";
  }
}

export function getWorkerStatusBadgeClasses(status) {
  switch (status) {
    case "running":
      return "bg-primary-100 text-primary-700 border-primary-500/30";
    case "idle":
    default:
      return "bg-success-100 text-success-700 border-success-500/30";
  }
}
