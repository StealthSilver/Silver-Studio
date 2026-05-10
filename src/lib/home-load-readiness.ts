/**
 * Tracks first-paint readiness for the home splash: window load, webfonts,
 * ambient music buffer, and all in-document `<img>` sources (handles late hydration).
 */

export const SITE_AMBIENT_MUSIC_SRC = "/music.mp3" as const;

export type HomeReadyTick = {
  /** Overall progress in 0–1 range (weighted across gates). */
  progress01: number;
  /** True when window load + fonts + music + every img is complete (or timed out where noted). */
  ready: boolean;
};

function normalizeImgList(): HTMLImageElement[] {
  return Array.from(document.querySelectorAll("img")).filter((img) => {
    const raw = (img.currentSrc || img.src || "").trim();
    return raw.length > 0;
  });
}

/**
 * Lazy / below-fold images often stay `complete === false` until scroll.
 * Splash should block on resource load and hero-critical images, not on every deferred `<img>`.
 */
function imageCountsAsReady(img: HTMLImageElement): boolean {
  if (img.loading === "lazy") return true;
  if (img.complete) return true;
  return false;
}

function getImageFraction(): number {
  const imgs = normalizeImgList();
  if (imgs.length === 0) return 1;
  let ready = 0;
  for (const img of imgs) {
    if (imageCountsAsReady(img)) ready += 1;
  }
  return ready / imgs.length;
}

/**
 * Dedicated preload — separate from navbar audio so we can gate the splash on `canplaythrough`.
 * Downloads are typically served from HTTP cache alongside `AmbientMusicProvider`.
 */
export function preloadAmbientMusicForSplash(): Promise<void> {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    audio.preload = "auto";
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(failSafe);
      resolve();
    };

    const failSafe = window.setTimeout(finish, 25_000);

    /** Safari / strict autoplay contexts may never fire `canplaythrough` for a cold buffer. */
    audio.addEventListener("canplaythrough", finish, { once: true });
    audio.addEventListener("canplay", finish, { once: true });
    audio.addEventListener("loadeddata", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });

    audio.src = SITE_AMBIENT_MUSIC_SRC;
    audio.load();
  });
}

function computeProgress01(state: {
  window: boolean;
  fonts: boolean;
  music: boolean;
  imageFraction: number;
}): number {
  const w = state.window ? 1 : 0;
  const f = state.fonts ? 1 : 0;
  const m = state.music ? 1 : 0;
  const i = state.imageFraction;
  return w * 0.25 + f * 0.25 + m * 0.25 + i * 0.25;
}

/**
 * Emits progress until disposed. `ready` requires all four gates (images at 100%).
 */
export function subscribeHomeReady(onTick: (tick: HomeReadyTick) => void): () => void {
  let disposed = false;

  const gates = {
    window: document.readyState === "complete",
    fonts: false,
    music: false,
    imageFraction: getImageFraction(),
  };

  const emit = () => {
    if (disposed) return;
    const progress01 = computeProgress01(gates);
    const ready =
      gates.window && gates.fonts && gates.music && gates.imageFraction >= 0.999;
    onTick({ progress01, ready });
  };

  const measureImages = () => {
    gates.imageFraction = getImageFraction();
    emit();
  };

  let raf = 0;
  const scheduleMeasure = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(measureImages);
  };

  void document.fonts.ready.then(() => {
    if (disposed) return;
    gates.fonts = true;
    emit();
  });

  const onWindowLoad = () => {
    if (disposed) return;
    gates.window = true;
    emit();
  };
  if (gates.window) onWindowLoad();
  else window.addEventListener("load", onWindowLoad, { once: true });

  void preloadAmbientMusicForSplash().then(() => {
    if (disposed) return;
    gates.music = true;
    emit();
  });

  const mo =
    typeof document.body !== "undefined"
      ? new MutationObserver(() => scheduleMeasure())
      : null;
  if (document.body && mo) {
    mo.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src", "srcset"],
    });
  }

  document.addEventListener("load", scheduleMeasure, true);

  const poll = window.setInterval(measureImages, 200);

  emit();
  scheduleMeasure();

  return () => {
    disposed = true;
    window.removeEventListener("load", onWindowLoad);
    document.removeEventListener("load", scheduleMeasure, true);
    mo?.disconnect();
    window.clearInterval(poll);
    cancelAnimationFrame(raf);
  };
}
