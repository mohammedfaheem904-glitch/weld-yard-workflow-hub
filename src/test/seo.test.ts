import { describe, expect, it } from "vitest";
import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "@/routeTree.gen";
import { PUBLIC_PATHS, absoluteUrl } from "@/lib/site";
import { buildSitemap } from "@/lib/sitemap";

describe("SEO", () => {
  it("lists exactly 11 public pages", () => expect(PUBLIC_PATHS.length).toBe(11));

  it("canonical URLs use www.weldyard.com without trailing slashes", () => {
    expect(absoluteUrl("/")).toBe("https://www.weldyard.com/");
    expect(absoluteUrl("/about")).toBe("https://www.weldyard.com/about");
  });

  it("every page has a unique title and self-referencing canonical", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const titles = new Set<string>();
    const descs = new Set<string>();
    for (const p of PUBLIC_PATHS) {
      const leaf = router.matchRoutes(p).at(-1)!;
      const route = router.routesById[leaf.routeId as keyof typeof router.routesById] as any;
      const head = route.options.head({});
      titles.add(head.meta.find((m: any) => m.title).title);
      descs.add(head.meta.find((m: any) => m.name === "description").content);
      expect(head.links).toEqual([{ rel: "canonical", href: absoluteUrl(p) }]);
      expect(head.meta.find((m: any) => m.property === "og:url").content).toBe(absoluteUrl(p));
    }
    expect(titles.size).toBe(11);
    expect(descs.size).toBe(11);
  });

  it("sitemap contains all 11 production URLs and no preview domains", () => {
    const xml = buildSitemap();
    expect(xml.match(/<loc>/g)?.length).toBe(11);
    expect(xml).not.toMatch(/lovable/);
  });
});
