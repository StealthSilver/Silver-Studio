"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";

import { BookingCalEmbed } from "@/components/booking-cal-embed";
import { cn } from "@/lib/utils";

type BookingModalContextValue = {
  openBooking: () => void;
  closeBooking: () => void;
  isOpen: boolean;
};

const BookingModalContext = createContext<BookingModalContextValue | null>(
  null,
);

function shouldUseBookingModal(e: SyntheticEvent): boolean {
  const ne = e.nativeEvent as MouseEvent;
  if (ne.defaultPrevented) return false;
  if (ne.button !== 0) return false;
  if (ne.metaKey || ne.ctrlKey || ne.shiftKey || ne.altKey) return false;
  return true;
}

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBooking();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeBooking]);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();
  }, [isOpen]);

  const modal =
    mounted &&
    isOpen &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
        role="presentation"
      >
        <button
          type="button"
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          aria-label="Close booking"
          onClick={closeBooking}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn(
            "relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-[4px] border border-border bg-background shadow-2xl",
            "sm:mx-4 sm:rounded-[4px]",
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-5">
            <h2 id={titleId} className="text-sm font-semibold tracking-wide">
              Book a call
            </h2>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeBooking}
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-[4px] border border-border bg-secondary px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Close
            </button>
          </div>
          <BookingCalEmbed />
        </div>
      </div>,
      document.body,
    );

  return (
    <BookingModalContext.Provider
      value={{ openBooking, closeBooking, isOpen }}
    >
      {children}
      {modal}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal(): BookingModalContextValue {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used within BookingModalProvider");
  }
  return ctx;
}

/** Safe for optional wiring in shared UI when provider might be absent. */
export function useBookingModalOptional(): BookingModalContextValue | null {
  return useContext(BookingModalContext);
}

export { shouldUseBookingModal };
