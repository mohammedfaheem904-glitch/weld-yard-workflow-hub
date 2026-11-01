import { describe, it, expect } from "vitest";
import { isAllowedStatus, subscribersCsv } from "@/lib/communications";

describe("communications rules", () => {
  it("DWM demo statuses", () => {
    for (const s of ["new", "contacted", "demo_scheduled", "completed", "not_interested"]) expect(isAllowedStatus("dwm_demo", s)).toBe(true);
    expect(isAllowedStatus("dwm_demo", "resolved")).toBe(false);
  });
  it("quote statuses are the six quote stages, independent of contact", () => {
    for (const s of ["new", "under_review", "quotation_in_preparation", "quotation_sent", "won", "lost"]) expect(isAllowedStatus("quote", s)).toBe(true);
    expect(isAllowedStatus("quote", "resolved")).toBe(false);
    expect(isAllowedStatus("contact", "won")).toBe(false);
    expect(isAllowedStatus("dwm_demo", "quotation_sent")).toBe(false);
  });
  it("contact statuses", () => {
    for (const s of ["new", "in_progress", "resolved"]) expect(isAllowedStatus("contact", s)).toBe(true);
    expect(isAllowedStatus("contact", "demo_scheduled")).toBe(false);
    expect(isAllowedStatus("newsletter", "new")).toBe(false);
  });
  it("CSV export never contains unsubscribe tokens", () => {
    const row = { email: "a@b.com", status: "active", created_at: "x", updated_at: "y", unsubscribed_at: null, unsubscribe_token: "SECRET-TOKEN" };
    const csv = subscribersCsv([row]);
    expect(csv).not.toContain("SECRET-TOKEN");
    expect(csv.split("\n")[0]).toBe("email,status,subscribed_at,updated_at,unsubscribed_at");
  });
  it("CSV neutralises formula injection", () => {
    expect(subscribersCsv([{ email: "=cmd()", status: "active", created_at: "", updated_at: "", unsubscribed_at: null }])).toContain("'=cmd()");
  });
});
