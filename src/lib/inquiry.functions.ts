import { createServerFn } from "@tanstack/react-start";
import type { SubmitInquiryResult } from "./inquiry-schema";

/** Public form endpoint. Validation happens inside persistInquiry (server-side). */
export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }): Promise<SubmitInquiryResult> => {
    const { persistInquiry } = await import("./inquiry.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    return persistInquiry(data, supabaseAdmin as never);
  });
