import { logger } from "@/lib/logger";

export async function onRequestError(
  error: Error & { digest?: string },
  request: { path: string; method: string },
  context: { routeType: string }
) {
  logger.error("request_error", {
    message: error.message,
    digest: error.digest,
    stack: error.stack,
    path: request.path,
    method: request.method,
    routeType: context.routeType,
  });
}
