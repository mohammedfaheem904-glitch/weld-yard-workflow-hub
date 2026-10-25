import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "@/routeTree.gen";
import { PUBLIC_PATHS, SHARE_IMAGE_URL, LOGO_IMAGE_URL, absoluteUrl } from "@/lib/site";

// PNG width/height live in the IHDR chunk at bytes 16-23.
function pngSize(path: string) {
  const b = readFileSync(path);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

describe("brand assets", () => {
  it("share image is exactly 1200x630", () => expect(pngSize("public/og-image.png")).toEqual({ w: 1200, h: 630 }));
  it("favicon is exactly 64x64", () => expect(pngSize("public/favicon.png")).toEqual({ w: 64, h: 64 }));
  it("logo config points at an existing public file", () => {
    expect(LOGO_IMAGE_URL).toBe("/weld-yard-logo.png");
    expect(existsSync(`public${LOGO_IMAGE_URL}`)).toBe(true);
  });
  it("share image URL is the production path", () => expect(SHARE_IMAGE_URL).toBe("https://www.weldyard.com/og-image.png"));

  it("root declares the PNG favicon", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const head = (router.routesById["__root__"] as any).options.head({});
    expect(head.links).toContainEqual({ rel: "icon", href: "/favicon.png", type: "image/png" });
    expect(head.meta.some((m: any) => m.property === "og:image")).toBe(false);
  });

  it("all 11 routes emit og:image and twitter:image with canonical intact", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const p of PUBLIC_PATHS) {
      const leaf = router.matchRoutes(p).at(-1)!;
      const head = (router.routesById[leaf.routeId as keyof typeof router.routesById] as any).options.head({});
      expect(head.meta.find((m: any) => m.property === "og:image")?.content).toBe("https://www.weldyard.com/og-image.png");
      expect(head.meta.find((m: any) => m.name === "twitter:image")?.content).toBe("https://www.weldyard.com/og-image.png");
      expect(head.links).toEqual([{ rel: "canonical", href: absoluteUrl(p) }]);
    }
  });
});
