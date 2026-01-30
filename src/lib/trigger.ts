import { configure, envvars, queues, runs, schedules } from "@trigger.dev/sdk";
import { env } from "@/lib/env";

configure({
  secretKey: env.TRIGGER_SECRET_KEY,
});

export const triggerClient = {
  envvars,
  queues,
  runs,
  schedules,
};
