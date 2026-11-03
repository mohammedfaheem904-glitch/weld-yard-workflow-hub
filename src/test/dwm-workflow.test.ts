import { describe, expect, it } from "vitest";
import { DWM_INIT_ACTIVITIES, DWM_STAGES } from "@/routes/dwm";

describe("official DWM workflow", () => {
  it("starts with the three Project Initialization activities in order", () => {
    expect(DWM_INIT_ACTIVITIES.map((a) => a.en)).toEqual(["ITP", "Materials Receiving", "Drawing Approval"]);
  });
  it("lists the stages in the exact official order", () => {
    expect(DWM_STAGES.map((s) => s.en)).toEqual(["pWPS", "PQR", "WPS", "WPQ", "WELD LOG", "INSPECTION", "NCR", "TURNOVER & HANDOVER", "CLOSED"]);
  });
});
