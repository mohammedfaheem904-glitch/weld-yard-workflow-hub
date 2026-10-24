// External destinations. These systems are separate apps — never rebuilt here.
export const STORE_URL = "https://store.weldyard.com";
export const DWM_URL = "https://dwm.weldyard.com";
export const SITE_NAME = "Weld Yard";
export const TAGLINE = "Weld Yard — Integrated Welding Solutions";
export const SUPPORTING = "Products. Engineering. Inspection. Digital Welding Management.";

export type NavItem = { key: NavKey; to: string };
export type NavKey = "home" | "solutions" | "products" | "dwm" | "industries" | "about" | "contact";

export const NAV: NavItem[] = [
  { key: "home", to: "/" },
  { key: "solutions", to: "/solutions" },
  { key: "products", to: "/products" },
  { key: "dwm", to: "/dwm" },
  { key: "industries", to: "/industries" },
  { key: "about", to: "/about" },
  { key: "contact", to: "/contact" },
];

export const BUSINESS_AREAS = [
  {
    n: "01",
    title: "Welding Products",
    to: "/products",
    body: "Consumables, equipment, accessories and safety gear — supplied through the Weld Yard online store.",
  },
  {
    n: "02",
    title: "Welding Engineering",
    to: "/welding-engineering",
    body: "Procedure development, welder qualification support and technical guidance for your fabrication work.",
  },
  {
    n: "03",
    title: "QA/QC & Inspection",
    to: "/qa-qc-inspection",
    body: "Weld inspection, quality control support and structured documentation from fit-up to final acceptance.",
  },
  {
    n: "04",
    title: "Digital Welding Management",
    to: "/dwm",
    body: "Weld Yard DWM brings welders, joints, inspections and quality records into one digital workspace.",
  },
] as const;

export const LIFECYCLE = [
  "Material",
  "Engineering",
  "Welder Qualification",
  "Welding",
  "Inspection",
  "Quality Documentation",
  "Handover",
] as const;

export const INDUSTRIES = [
  { name: "Oil & Gas", body: "Piping, pipelines and pressure-containing systems where weld integrity and traceability matter." },
  { name: "Petrochemical & Process", body: "Process plant fabrication, shutdowns and maintenance welding." },
  { name: "Power & Utilities", body: "Boilers, pressure parts and plant maintenance work." },
  { name: "Structural Steel & Construction", body: "Buildings, bridges and heavy steel structures." },
  { name: "Fabrication Workshops", body: "Shops that need dependable supply, procedures and quality records." },
  { name: "Marine & Offshore", body: "Shipyard, repair and offshore fabrication activities." },
  { name: "Water & Infrastructure", body: "Tanks, pipelines and municipal infrastructure projects." },
  { name: "Manufacturing & Maintenance", body: "Equipment manufacturing and plant maintenance teams." },
] as const;

// Optional `url`: add verified store category URLs here; unset entries link to the store home.
export const PRODUCT_CATEGORIES: { name: string; body: string; url?: string }[] = [
  { name: "Welding Consumables", body: "Electrodes, filler wires, TIG rods and fluxes for common processes and materials." },
  { name: "Welding Machines & Equipment", body: "Power sources and equipment for MMA, MIG/MAG and TIG applications." },
  { name: "Torches & Accessories", body: "Torches, cables, clamps, holders and consumable spare parts." },
  { name: "Safety & PPE", body: "Helmets, gloves, protective clothing and fume protection." },
  { name: "Inspection Tools", body: "Weld gauges and tools that support visual and dimensional checks." },
  { name: "Workshop Essentials", body: "Abrasives, preparation tools and everyday shop-floor supplies." },
] as const;

export const DWM_FEATURES = [
  { title: "Welder qualification tracking", body: "Keep welder records and qualification status visible and up to date." },
  { title: "Weld & joint traceability", body: "Link each joint to its welder, procedure and inspection results." },
  { title: "Inspection management", body: "Plan, record and follow up inspection activities in one place." },
  { title: "Quality documentation", body: "Build organised quality records as work progresses, ready for handover." },
  { title: "Project visibility", body: "See progress and open quality items across projects and teams." },
  { title: "Fewer paper trails", body: "Replace scattered spreadsheets and paper forms with structured digital data." },
] as const;

// Final production origin — the single source for canonical, og:url and sitemap URLs.
export const SITE_URL = "https://www.weldyard.com";

// Public, indexable pages (no trailing slashes). Sitemap and tests read this list.
export const PUBLIC_PATHS = [
  "/",
  "/solutions",
  "/products",
  "/welding-engineering",
  "/qa-qc-inspection",
  "/dwm",
  "/industries",
  "/about",
  "/contact",
  "/request-quote",
  "/request-dwm-demo",
] as const;

export function absoluteUrl(path: string) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path.replace(/\/+$/, "")}`;
}

// Official contact details. Leave null until Weld Yard supplies verified values;
// the footer only shows fields that are filled in. Never add placeholder data.
export const CONTACT: {
  email: string | null;
  phone: string | null;
  address: string | null;
  registration: string | null;
} = {
  email: null,
  phone: null,
  address: null,
  registration: null,
};

// Official 1200x630 share image (absolute URL). Null until an approved brand asset exists.
export const SHARE_IMAGE_URL: string | null = null;

// Official logo (absolute https URL or bundled asset URL). Null keeps the WY monogram fallback.
export const LOGO_IMAGE_URL: string | null = null;

// Allow only https URLs (or same-site relative paths). Blocks javascript:, data:, http:, etc.
export function safeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const v = url.trim();
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  try {
    return new URL(v).protocol === "https:" ? v : null;
  } catch {
    return null;
  }
}

// Store category destination: verified category URL on the store host, else the store home.
export function categoryHref(url?: string | null): string {
  const safe = safeUrl(url);
  if (safe && safe.startsWith("https://store.weldyard.com")) return safe;
  return STORE_URL;
}

// DWM CTA labels — existing users vs prospective customers. Keep them distinct.
export const DWM_ACCESS_LABEL = "Access DWM";
export const DWM_DEMO_LABEL = "Request a DWM Demo";
export const DWM_DEMO_PATH = "/request-dwm-demo";

export type JourneyAction = { label: string; href: string; external?: boolean };
export const JOURNEYS: { audience: string; body: string; actions: JourneyAction[] }[] = [
  {
    audience: "Procurement teams",
    body: "Source consumables, equipment and safety products, or request pricing for project volumes.",
    actions: [
      { label: "Browse Products", href: STORE_URL, external: true },
      { label: "Request a Quote", href: "/request-quote" },
      { label: "Contact Sales", href: "/contact" },
    ],
  },
  {
    audience: "Engineering & QA/QC teams",
    body: "Get support with procedures, qualification, inspection and quality documentation.",
    actions: [
      { label: "Explore Welding Engineering", href: "/welding-engineering" },
      { label: "Explore QA/QC & Inspection", href: "/qa-qc-inspection" },
      { label: "Request Technical Support", href: "/contact" },
    ],
  },
  {
    audience: "Digital & project management teams",
    body: "Digitise welder, joint and inspection records across your projects.",
    actions: [
      { label: "Explore Weld Yard DWM", href: "/dwm" },
      { label: DWM_DEMO_LABEL, href: DWM_DEMO_PATH },
      { label: DWM_ACCESS_LABEL, href: DWM_URL, external: true },
    ],
  },
];
