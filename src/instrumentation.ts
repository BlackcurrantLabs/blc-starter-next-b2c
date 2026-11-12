import type { Instrumentation } from "next";

import { logger } from "@/lib/logger";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  // `error` is `unknown`: anything can be thrown, not just Error instances.
  const isError = error instanceof Error;
  logger.error("request_error", {
    message: isError ? error.message : String(error),
    digest:
      typeof error === "object" && error !== null && "digest" in error
        ? String(error.digest)
        : undefined,
    stack: isError ? error.stack : undefined,
    path: request.path,
    method: request.method,
    routeType: context.routeType,
  });
};
