import { z } from "zod";

/** Allowed inquiry types — must match the database CHECK constraint. */
export const INQUIRY_TYPES = ["contact", "quote", "dwm_demo"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

/** Field limits — must match the database CHECK constraints on public.inquiries. */
export const LIMITS = { name: 120, email: 255, company: 160, phone: 40, topic: 120, message: 3000 } as const;

const opt = (max: number) => z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));

/** Server-side schema: trusted boundary, independent of the browser form. */
export const serverInquirySchema = z.object({
  inquiryType: z.enum(INQUIRY_TYPES),
  name: z.string().trim().min(1).max(LIMITS.name),
  email: z.string().trim().toLowerCase().max(LIMITS.email).email(),
  company: opt(LIMITS.company),
  phone: opt(LIMITS.phone),
  topic: opt(LIMITS.topic),
  message: z.string().trim().min(1).max(LIMITS.message),
  idempotencyKey: z.string().uuid(),
  /** Bot trap: must stay empty for genuine visitors. */
  hp: z.string().max(500).optional().transform((v) => !!v && v.trim().length > 0),
});
export type ServerInquiryInput = z.infer<typeof serverInquirySchema>;

export type SubmitInquiryResult = { ok: true } | { ok: false; error: "invalid" | "unavailable" };
