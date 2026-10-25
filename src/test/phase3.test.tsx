import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Logo } from "@/components/site/Logo";
import { categoryHref, safeUrl, JOURNEYS, PRODUCT_CATEGORIES, STORE_URL, DWM_URL, DWM_DEMO_PATH } from "@/lib/site";

describe("Logo", () => {
  it("falls back to the WY monogram when no logo URL is set", () => {
    render(<Logo src={null} />);
    expect(screen.getByTestId("logo-fallback")).toBeTruthy();
  });
  it("renders the official mark (decorative) beside the brand text when a safe URL is set", () => {
    const { container } = render(<Logo src="https://cdn.example.com/logo.svg" />);
    expect(screen.getByTestId("logo-official")).toBeTruthy();
    expect(container.querySelector("img")!.getAttribute("alt")).toBe("");
    expect(screen.getByText("WELD YARD").className).toContain("text-brand-wordmark");
  });
  it("falls back to the monogram when the image fails to load", () => {
    const { container } = render(<Logo src="/weld-yard-logo.png" />);
    fireEvent.error(container.querySelector("img")!);
    expect(screen.getByTestId("logo-fallback")).toBeTruthy();
  });
  it("rejects unsafe logo URLs", () => {
    render(<Logo src="javascript:alert(1)" />);
    expect(screen.getByTestId("logo-fallback")).toBeTruthy();
  });
});

describe("store category destinations", () => {
  it("all current categories link to the store home", () => {
    for (const c of PRODUCT_CATEGORIES) expect(categoryHref(c.url)).toBe(STORE_URL);
  });
  it("accepts verified https store category URLs", () => {
    expect(categoryHref("https://store.weldyard.com/product-category/safety/")).toBe("https://store.weldyard.com/product-category/safety/");
  });
  it("blocks unsafe schemes and other hosts", () => {
    for (const u of ["javascript:alert(1)", "data:text/html,x", "http://store.weldyard.com/x", "https://evil.com", "//evil.com"])
      expect(categoryHref(u)).toBe(STORE_URL);
    expect(safeUrl("javascript:alert(1)")).toBeNull();
  });
});

describe("CTA destinations", () => {
  const all = Object.fromEntries(JOURNEYS.flatMap((j) => j.actions).map((a) => [a.label, a.href]));
  it("maps each journey CTA to the right place", () => {
    expect(all["Browse Products"]).toBe(STORE_URL);
    expect(all["Request a Quote"]).toBe("/request-quote");
    expect(all["Contact Sales"]).toBe("/contact");
    expect(all["Explore Welding Engineering"]).toBe("/welding-engineering");
    expect(all["Explore QA/QC & Inspection"]).toBe("/qa-qc-inspection");
    expect(all["Request Technical Support"]).toBe("/contact");
    expect(all["Explore Weld Yard DWM"]).toBe("/dwm");
  });
  it("keeps DWM access and demo separate", () => {
    expect(all["Access DWM"]).toBe(DWM_URL);
    expect(all["Request a DWM Demo"]).toBe(DWM_DEMO_PATH);
    expect(DWM_DEMO_PATH).toBe("/request-dwm-demo");
  });
});
