import { env } from "@/lib/env";

type LogLevel = "debug" | "info" | "warn" | "error";

function writeLog(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    service: "blc-stack",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const logger = level === "debug" ? console.debug : console[level];
  logger(JSON.stringify(payload));
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    writeLog("debug", message, meta);
  },
  info(message: string, meta?: Record<string, unknown>) {
    writeLog("info", message, meta);
  },
  warn(message: string, meta?: Record<string, unknown>) {
    writeLog("warn", message, meta);
  },
  error(message: string, meta?: Record<string, unknown>) {
    writeLog("error", message, meta);
  },
};
