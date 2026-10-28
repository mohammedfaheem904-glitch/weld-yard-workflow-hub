import { createServerFn } from "@tanstack/react-start";
import type { SubmitInquiryResult } from "./inquiry-schema";

/** Public form endpoint. Validation, bot check and rate limiting happen server-side. */
export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }): Promise<SubmitInquiryResult> => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const { persistInquiry, clientBucket, rateLimitConfig } = await import("./inquiry.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const env = process.env as Record<string, string | undefined>;
    const bucket = await clientBucket(getRequestHeader("cf-connecting-ip"), env["INQUIRY_RATE_LIMIT_SALT"] ?? "weldyard-inquiry");
    return persistInquiry(data, supabaseAdmin as never, { bucket, limit: rateLimitConfig(env) });
  });
