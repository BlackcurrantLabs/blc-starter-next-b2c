"use client";

import { useEffect } from "react";
import type { ErrorInfo } from "next/error";
import { Button } from "@/components/ui/button";

export default function Error({ error, retry }: ErrorInfo) {
  useEffect(() => {
    // `error` is `unknown`: anything can be thrown, not just Error instances.
    const isError = error instanceof globalThis.Error;
    console.error("[App Error]", {
      message: isError ? error.message : String(error),
      digest:
        typeof error === "object" && error !== null && "digest" in error
          ? String(error.digest)
          : undefined,
      stack: isError ? error.stack : undefined,
    });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground">
        We ran into an unexpected error. Please try again.
      </p>
      <Button onClick={() => retry()}>Retry</Button>
    </div>
  );
}
