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

export const PRODUCT_CATEGORIES = [
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
