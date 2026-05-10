"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useSplashGateActive } from "@/context/splash-interactive-context";
import { SITE_AMBIENT_MUSIC_SRC } from "@/lib/home-load-readiness";

type AmbientMusicContextValue = {
  musicOn: boolean;
  /** True while `<audio>` is actively playing (`play`/`pause` events — wave UI follows this). */
  audioPlaying: boolean;
  toggleMusic: () => void;
};

const AmbientMusicContext = createContext<AmbientMusicContextValue | null>(
  null,
);

/** Audible envelope when playback is allowed (start, loop wrap, returning to tab, unmute). */
const FADE_IN_MS = 3000;
/** So each repeat eases down before the loop boundary (pairs with fade-in after seek). */
const LOOP_TAIL_FADE_MS = 900;
/** Tab / document hidden — gentle fade before pause. */
const LEAVE_FADE_OUT_MS = 850;
/** User muted — slightly snappier fade. */
const MUTE_FADE_OUT_MS = 650;

function cancelRaf(id: number | null) {
  if (id != null) cancelAnimationFrame(id);
}

export function AmbientMusicProvider({ children }: { children: ReactNode }) {
  const splashGateActive = useSplashGateActive();
  const splashGateActiveRef = useRef(splashGateActive);
  splashGateActiveRef.current = splashGateActive;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRafRef = useRef<number | null>(null);
  const segmentStartRef = useRef<number | null>(null);
  const transitionAbortRef = useRef<AbortController | null>(null);

  const beginPlayRef = useRef<(fromLoop?: boolean) => Promise<void>>(async () => {});
  const fadeOutPauseRef =
    useRef<(durationMs: number) => Promise<void>>(async () => {});

  const musicOnRef = useRef(true);
  const [musicOn, setMusicOn] = useState(true);
  musicOnRef.current = musicOn;

  const [audioPlaying, setAudioPlaying] = useState(false);

  const abortTransition = useCallback(() => {
    transitionAbortRef.current?.abort();
    transitionAbortRef.current = null;
  }, []);

  const stopVolumeLoop = useCallback(() => {
    cancelRaf(volumeRafRef.current);
    volumeRafRef.current = null;
  }, []);

  const runVolumeWhilePlaying = useCallback(() => {
    stopVolumeLoop();
    const tick = () => {
      const audio = audioRef.current;
      if (!audio || audio.paused) {
        stopVolumeLoop();
        return;
      }

      const now = performance.now();
      const dur = audio.duration;
      const t = audio.currentTime;

      let segmentFade = 1;
      if (segmentStartRef.current != null) {
        segmentFade = Math.min(1, (now - segmentStartRef.current) / FADE_IN_MS);
      }

      let tailFade = 1;
      if (
        Number.isFinite(dur) &&
        dur > 0 &&
        dur - t < LOOP_TAIL_FADE_MS / 1000
      ) {
        tailFade = Math.max(0, (dur - t) / (LOOP_TAIL_FADE_MS / 1000));
      }

      audio.volume = Math.max(0, Math.min(1, segmentFade * tailFade));
      volumeRafRef.current = requestAnimationFrame(tick);
    };
    volumeRafRef.current = requestAnimationFrame(tick);
  }, [stopVolumeLoop]);

  const fadeVolumeLinear = useCallback(
    (
      audio: HTMLAudioElement,
      from: number,
      to: number,
      durationMs: number,
      signal: AbortSignal,
    ): Promise<void> => {
      return new Promise((resolve) => {
        const start = performance.now();
        const step = () => {
          if (signal.aborted) {
            resolve();
            return;
          }
          const e = Math.min(1, (performance.now() - start) / durationMs);
          audio.volume = from + (to - from) * e;
          if (e < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(step);
      });
    },
    [],
  );

  const fadeOutAndPause = useCallback(
    async (durationMs: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      abortTransition();
      stopVolumeLoop();

      if (audio.paused && audio.volume === 0) return;

      const ac = new AbortController();
      transitionAbortRef.current = ac;

      const fromVol = audio.paused ? 0 : audio.volume;
      await fadeVolumeLinear(audio, fromVol, 0, durationMs, ac.signal);
      audio.pause();

      if (!ac.signal.aborted) {
        transitionAbortRef.current = null;
      }
    },
    [abortTransition, fadeVolumeLinear, stopVolumeLoop],
  );

  fadeOutPauseRef.current = fadeOutAndPause;

  const beginPlayWithFadeIn = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    abortTransition();
    stopVolumeLoop();

    /* Avoid resetting a running stream when the visibility effect re-syncs */
    if (!audio.paused) {
      if (volumeRafRef.current == null) runVolumeWhilePlaying();
      return;
    }

    segmentStartRef.current = performance.now();
    audio.volume = 0;

    try {
      await audio.play();
    } catch {
      segmentStartRef.current = null;
      return;
    }

    runVolumeWhilePlaying();
  }, [abortTransition, runVolumeWhilePlaying, stopVolumeLoop]);

  beginPlayRef.current = async (fromLoop = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fromLoop) {
      abortTransition();
      stopVolumeLoop();
      audio.currentTime = 0;
      segmentStartRef.current = performance.now();
      audio.volume = 0;
      try {
        await audio.play();
      } catch {
        segmentStartRef.current = null;
        return;
      }
      runVolumeWhilePlaying();
      return;
    }

    await beginPlayWithFadeIn();
  };

  useEffect(() => {
    const audio = new Audio(SITE_AMBIENT_MUSIC_SRC);
    audio.loop = false;
    audio.preload = "auto";
    audioRef.current = audio;

    const syncPlayingFlag = () => {
      setAudioPlaying(!audio.paused);
    };

    const onEnded = () => {
      void beginPlayRef.current(true);
    };

    audio.addEventListener("play", syncPlayingFlag);
    audio.addEventListener("playing", syncPlayingFlag);
    audio.addEventListener("pause", syncPlayingFlag);

    audio.addEventListener("ended", onEnded);

    /**
     * Aim: play on load and keep playing until the tab is hidden or the navbar
     * pause control turns `musicOff`. Autoplay is often blocked until `canplay*` or the
     * first input — those paths retry without adding other pause triggers.
     */
    const resumeIfEligible = () => {
      if (splashGateActiveRef.current) return;
      if (!musicOnRef.current || document.visibilityState !== "visible") return;
      if (!audioRef.current || !audio.paused) return;
      void beginPlayRef.current(false);
    };

    audio.addEventListener("loadeddata", resumeIfEligible);
    audio.addEventListener("canplaythrough", resumeIfEligible);

    window.addEventListener("pageshow", resumeIfEligible);

    const gestureOpts = { capture: true, passive: true } as const;
    document.addEventListener("pointerdown", resumeIfEligible, gestureOpts);
    window.addEventListener("touchstart", resumeIfEligible, gestureOpts);

    return () => {
      audio.removeEventListener("loadeddata", resumeIfEligible);
      audio.removeEventListener("canplaythrough", resumeIfEligible);
      window.removeEventListener("pageshow", resumeIfEligible);
      document.removeEventListener("pointerdown", resumeIfEligible, gestureOpts.capture);
      window.removeEventListener("touchstart", resumeIfEligible, gestureOpts.capture);

      audio.removeEventListener("play", syncPlayingFlag);
      audio.removeEventListener("playing", syncPlayingFlag);
      audio.removeEventListener("pause", syncPlayingFlag);
      audio.removeEventListener("ended", onEnded);
      setAudioPlaying(false);
      abortTransition();
      stopVolumeLoop();
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [abortTransition, stopVolumeLoop]);

  useEffect(() => {
    const syncPlaybackIntent = () => {
      /** Pause while home splash is up; otherwise respect mute + tab visibility. */
      const wantsSound =
        musicOnRef.current &&
        document.visibilityState === "visible" &&
        !splashGateActive;

      if (wantsSound) {
        void beginPlayRef.current(false);
      } else {
        const ms = musicOnRef.current
          ? LEAVE_FADE_OUT_MS
          : MUTE_FADE_OUT_MS;
        void fadeOutPauseRef.current(ms);
      }
    };

    syncPlaybackIntent();
    document.addEventListener("visibilitychange", syncPlaybackIntent);
    window.addEventListener("pageshow", syncPlaybackIntent);
    return () => {
      document.removeEventListener("visibilitychange", syncPlaybackIntent);
      window.removeEventListener("pageshow", syncPlaybackIntent);
    };
  }, [musicOn, splashGateActive]);

  const toggleMusic = useCallback(() => {
    setMusicOn((v) => !v);
  }, []);

  const value = useMemo(
    () => ({ musicOn, audioPlaying, toggleMusic }),
    [audioPlaying, musicOn, toggleMusic],
  );

  return (
    <AmbientMusicContext.Provider value={value}>
      {children}
    </AmbientMusicContext.Provider>
  );
}

export function useAmbientMusic(): AmbientMusicContextValue {
  const ctx = useContext(AmbientMusicContext);
  if (!ctx) {
    throw new Error("useAmbientMusic must be used within AmbientMusicProvider");
  }
  return ctx;
}
