import { absoluteUrl, SHARE_IMAGE_URL, SITE_NAME } from "./site";

export function seo(title: string, description: string, path: string) {
  const full = `${title} | ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const image = SHARE_IMAGE_URL
    ? [
        { property: "og:image", content: SHARE_IMAGE_URL },
        { name: "twitter:image", content: SHARE_IMAGE_URL },
      ]
    : [];
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: full },
      { name: "twitter:description", content: description },
      ...image,
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
