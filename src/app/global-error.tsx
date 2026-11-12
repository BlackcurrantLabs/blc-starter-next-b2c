"use client";

import { useEffect } from "react";
import type { ErrorInfo } from "next/error";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, retry }: ErrorInfo) {
  useEffect(() => {
    // `error` is `unknown`: anything can be thrown, not just Error instances.
    const isError = error instanceof globalThis.Error;
    console.error("[Global Error]", {
      message: isError ? error.message : String(error),
      digest:
        typeof error === "object" && error !== null && "digest" in error
          ? String(error.digest)
          : undefined,
      stack: isError ? error.stack : undefined,
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground">
            The application encountered an unexpected error.
          </p>
          <Button onClick={() => retry()}>Retry</Button>
        </div>
      </body>
    </html>
  );
}
