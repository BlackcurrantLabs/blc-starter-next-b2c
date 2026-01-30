"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
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
          <Button onClick={reset}>Retry</Button>
        </div>
      </body>
    </html>
  );
}
