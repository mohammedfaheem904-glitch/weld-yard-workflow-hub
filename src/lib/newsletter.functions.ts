import { createServerFn } from "@tanstack/react-start";
import type { NewsletterResult } from "./newsletter.server";

/** Public newsletter endpoint. Stores subscriptions only; no email is sent. */
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }): Promise<NewsletterResult> => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const { clientBucket, rateLimitConfig } = await import("./inquiry.server");
    const { persistSubscription } = await import("./newsletter.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const env = process.env as Record<string, string | undefined>;
    const bucket = await clientBucket(getRequestHeader("cf-connecting-ip"), env["INQUIRY_RATE_LIMIT_SALT"] ?? "weldyard-inquiry");
    return persistSubscription(data, supabaseAdmin as never, { bucket, limit: rateLimitConfig(env) });
  });
