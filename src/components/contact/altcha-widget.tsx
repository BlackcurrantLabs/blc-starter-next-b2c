"use client";

import { useEffect, useRef } from "react";
// Registers <altcha-widget> in React's JSX types (type-only, no runtime import).
import type {} from "altcha/types/react";

type AltchaWidgetProps = {
  onVerifiedAction: (payload: string) => void;
};

export function AltchaWidget({ onVerifiedAction }: AltchaWidgetProps) {
  const widgetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    import("altcha");
  }, []);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) return;

    const handleVerified = (event: Event) => {
      const detail = (event as CustomEvent<{ payload?: string }>).detail;
      if (detail?.payload) {
        onVerifiedAction(detail.payload);
      }
    };

    widget.addEventListener("verified", handleVerified);
    return () => widget.removeEventListener("verified", handleVerified);
  }, [onVerifiedAction]);

  return (
    <altcha-widget
      ref={widgetRef}
      challenge="/api/altcha-challenge"
      name="altcha"
      auto="onsubmit"
    />
  );
}
