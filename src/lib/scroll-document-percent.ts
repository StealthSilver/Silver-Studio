const STORAGE_KEY = "silverStudioNavScrollPercent";

export function setPendingNavScrollPercent(percent: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, String(percent));
}

export function consumePendingNavScrollPercent(): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw == null) return null;
  sessionStorage.removeItem(STORAGE_KEY);
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function scrollToDocumentPercent(
  percent: number,
  behavior: ScrollBehavior,
) {
  const root = document.documentElement;
  const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
  const clamped = Math.min(100, Math.max(0, percent));
  const top = (clamped / 100) * maxScroll;
  window.scrollTo({ top, behavior });
}
