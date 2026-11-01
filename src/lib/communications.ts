import { z } from "zod";

/** Statuses an admin may set, per inquiry type. Must stay within the DB CHECK constraint. */
export const STATUSES = {
  contact: ["new", "in_progress", "resolved"],
  quote: ["new", "in_progress", "resolved"],
  dwm_demo: ["new", "contacted", "demo_scheduled", "completed", "not_interested"],
} as const;

export type InquiryKind = keyof typeof STATUSES;

export function isAllowedStatus(type: string, status: string): boolean {
  const list = (STATUSES as Record<string, readonly string[]>)[type];
  return !!list && list.includes(status);
}

export const updateInquirySchema = z.object({
  id: z.string().uuid(),
  status: z.string().max(40).optional(),
  read: z.boolean().optional(),
  notes: z.string().max(5000).optional(),
});

export type SubscriberRow = { email: string; status: string; created_at: string; updated_at: string; unsubscribed_at: string | null };

const cell = (v: string | null) => {
  let s = v ?? "";
  // Neutralise spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** CSV export of subscribers. Never includes unsubscribe tokens or internal ids. */
export function subscribersCsv(rows: SubscriberRow[]): string {
  const head = "email,status,subscribed_at,updated_at,unsubscribed_at";
  return [head, ...rows.map((r) => [r.email, r.status, r.created_at, r.updated_at, r.unsubscribed_at].map(cell).join(","))].join("\n");
}
