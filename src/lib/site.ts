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

// Each item carries an optional `ar` override; use loc(item, locale) to read it.
export const BUSINESS_AREAS = [
  {
    n: "01",
    title: "Welding Products",
    to: "/products",
    body: "Consumables, equipment, accessories and safety gear — supplied through the Weld Yard online store.",
    ar: { title: "منتجات اللحام", body: "مواد اللحام الاستهلاكية والمعدات والملحقات ومعدات السلامة — متوفرة عبر متجر Weld Yard الإلكتروني." },
  },
  {
    n: "02",
    title: "Welding Engineering",
    to: "/welding-engineering",
    body: "Procedure development, welder qualification support and technical guidance for your fabrication work.",
    ar: { title: "هندسة اللحام", body: "إعداد إجراءات اللحام ودعم تأهيل اللحّامين والإرشاد الفني لأعمال التصنيع لديكم." },
  },
  {
    n: "03",
    title: "QA/QC & Inspection",
    to: "/qa-qc-inspection",
    body: "Weld inspection, quality control support and structured documentation from fit-up to final acceptance.",
    ar: { title: "ضمان الجودة / مراقبة الجودة (QA/QC) والفحص", body: "فحص اللحامات ودعم مراقبة الجودة وتوثيق منظم من مرحلة التجميع حتى القبول النهائي." },
  },
  {
    n: "04",
    title: "Digital Welding Management",
    to: "/dwm",
    body: "Weld Yard DWM brings welders, joints, inspections and quality records into one digital workspace.",
    ar: { title: "الإدارة الرقمية للحام", body: "يجمع Weld Yard DWM اللحّامين والوصلات والفحوصات وسجلات الجودة في مساحة عمل رقمية واحدة." },
  },
];

export const LIFECYCLE = [
  "Material",
  "Engineering",
  "Welder Qualification",
  "Welding",
  "Inspection",
  "Quality Documentation",
  "Handover",
] as const;

export const LIFECYCLE_AR = [
  "المواد",
  "الهندسة",
  "تأهيل اللحّامين",
  "اللحام",
  "الفحص",
  "توثيق الجودة",
  "التسليم",
] as const;

export const INDUSTRIES = [
  { name: "Oil & Gas", body: "Piping, pipelines and pressure-containing systems where weld integrity and traceability matter.", ar: { name: "النفط والغاز", body: "الأنابيب وخطوط الأنابيب والأنظمة الحاوية للضغط حيث تُعد سلامة اللحام وإمكانية تتبعه أمراً أساسياً." } },
  { name: "Petrochemical & Process", body: "Process plant fabrication, shutdowns and maintenance welding.", ar: { name: "البتروكيماويات والصناعات التحويلية", body: "تصنيع المصانع التحويلية وأعمال التوقف الدوري ولحام الصيانة." } },
  { name: "Power & Utilities", body: "Boilers, pressure parts and plant maintenance work.", ar: { name: "الطاقة والمرافق", body: "الغلايات وأجزاء الضغط وأعمال صيانة المحطات." } },
  { name: "Structural Steel & Construction", body: "Buildings, bridges and heavy steel structures.", ar: { name: "الهياكل الفولاذية والإنشاءات", body: "المباني والجسور والهياكل الفولاذية الثقيلة." } },
  { name: "Fabrication Workshops", body: "Shops that need dependable supply, procedures and quality records.", ar: { name: "ورش التصنيع", body: "الورش التي تحتاج إلى توريد موثوق وإجراءات وسجلات جودة." } },
  { name: "Marine & Offshore", body: "Shipyard, repair and offshore fabrication activities.", ar: { name: "القطاع البحري والبحري المفتوح", body: "أحواض السفن وأعمال الإصلاح والتصنيع في المنشآت البحرية." } },
  { name: "Water & Infrastructure", body: "Tanks, pipelines and municipal infrastructure projects.", ar: { name: "المياه والبنية التحتية", body: "الخزانات وخطوط الأنابيب ومشاريع البنية التحتية البلدية." } },
  { name: "Manufacturing & Maintenance", body: "Equipment manufacturing and plant maintenance teams.", ar: { name: "التصنيع والصيانة", body: "فرق تصنيع المعدات وصيانة المصانع." } },
];

// Optional `url`: add verified store category URLs here; unset entries link to the store home.
export const PRODUCT_CATEGORIES: { name: string; body: string; url?: string; ar?: { name: string; body: string } }[] = [
  { name: "Welding Consumables", body: "Electrodes, filler wires, TIG rods and fluxes for common processes and materials.", ar: { name: "مواد اللحام الاستهلاكية", body: "أقطاب وأسلاك حشو وقضبان TIG ومساعدات صهر للعمليات والمواد الشائعة." } },
  { name: "Welding Machines & Equipment", body: "Power sources and equipment for MMA, MIG/MAG and TIG applications.", ar: { name: "ماكينات ومعدات اللحام", body: "مصادر طاقة ومعدات لتطبيقات MMA وMIG/MAG وTIG." } },
  { name: "Torches & Accessories", body: "Torches, cables, clamps, holders and consumable spare parts.", ar: { name: "المشاعل والملحقات", body: "مشاعل وكابلات ومشابك وحوامل وقطع غيار استهلاكية." } },
  { name: "Safety & PPE", body: "Helmets, gloves, protective clothing and fume protection.", ar: { name: "السلامة ومعدات الوقاية الشخصية", body: "خوذات وقفازات وملابس واقية وحماية من الأدخنة." } },
  { name: "Inspection Tools", body: "Weld gauges and tools that support visual and dimensional checks.", ar: { name: "أدوات الفحص", body: "مقاييس لحام وأدوات تدعم الفحص البصري وفحص الأبعاد." } },
  { name: "Workshop Essentials", body: "Abrasives, preparation tools and everyday shop-floor supplies.", ar: { name: "مستلزمات الورشة", body: "مواد كاشطة وأدوات تحضير ومستلزمات يومية لأرضية الورشة." } },
];

export const DWM_FEATURES = [
  { title: "Welder qualification tracking", body: "Keep welder records and qualification status visible and up to date.", ar: { title: "متابعة تأهيل اللحّامين", body: "اجعل سجلات اللحّامين وحالة تأهيلهم واضحة ومحدّثة." } },
  { title: "Weld & joint traceability", body: "Link each joint to its welder, procedure and inspection results.", ar: { title: "تتبع اللحامات والوصلات", body: "اربط كل وصلة باللحّام والإجراء ونتائج الفحص الخاصة بها." } },
  { title: "Inspection management", body: "Plan, record and follow up inspection activities in one place.", ar: { title: "إدارة الفحص", body: "خطّط لأنشطة الفحص وسجّلها وتابعها في مكان واحد." } },
  { title: "Quality documentation", body: "Build organised quality records as work progresses, ready for handover.", ar: { title: "توثيق الجودة", body: "أنشئ سجلات جودة منظمة مع تقدم العمل، جاهزة للتسليم." } },
  { title: "Project visibility", body: "See progress and open quality items across projects and teams.", ar: { title: "رؤية شاملة للمشاريع", body: "اطّلع على التقدم وبنود الجودة المفتوحة عبر المشاريع والفرق." } },
  { title: "Fewer paper trails", body: "Replace scattered spreadsheets and paper forms with structured digital data.", ar: { title: "أوراق أقل", body: "استبدل جداول البيانات المتفرقة والنماذج الورقية ببيانات رقمية منظمة." } },
];

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

// Official 1200x630 share image (absolute production URL; file lives at public/og-image.png).
export const SHARE_IMAGE_URL: string | null = "https://www.weldyard.com/og-image.png";

// Official logo mark (file lives at public/weld-yard-logo.png). Null keeps the WY monogram fallback.
export const LOGO_IMAGE_URL: string | null = "/weld-yard-logo.png";

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

export type JourneyAction = { label: string; labelAr: string; href: string; external?: boolean };
export const JOURNEYS: { audience: string; body: string; ar: { audience: string; body: string }; actions: JourneyAction[] }[] = [
  {
    audience: "Procurement teams",
    body: "Source consumables, equipment and safety products, or request pricing for project volumes.",
    ar: { audience: "فرق المشتريات", body: "احصل على المواد الاستهلاكية والمعدات ومنتجات السلامة، أو اطلب أسعاراً لكميات المشاريع." },
    actions: [
      { label: "Browse Products", labelAr: "تصفح المنتجات", href: STORE_URL, external: true },
      { label: "Request a Quote", labelAr: "طلب عرض سعر", href: "/request-quote" },
      { label: "Contact Sales", labelAr: "تواصل مع المبيعات", href: "/contact" },
    ],
  },
  {
    audience: "Engineering & QA/QC teams",
    body: "Get support with procedures, qualification, inspection and quality documentation.",
    ar: { audience: "فرق الهندسة وضمان/مراقبة الجودة (QA/QC)", body: "احصل على الدعم في الإجراءات والتأهيل والفحص وتوثيق الجودة." },
    actions: [
      { label: "Explore Welding Engineering", labelAr: "استكشف هندسة اللحام", href: "/welding-engineering" },
      { label: "Explore QA/QC & Inspection", labelAr: "استكشف QA/QC والفحص", href: "/qa-qc-inspection" },
      { label: "Request Technical Support", labelAr: "طلب دعم فني", href: "/contact" },
    ],
  },
  {
    audience: "Digital & project management teams",
    body: "Digitise welder, joint and inspection records across your projects.",
    ar: { audience: "فرق التحول الرقمي وإدارة المشاريع", body: "حوّل سجلات اللحّامين والوصلات والفحص إلى سجلات رقمية عبر مشاريعك." },
    actions: [
      { label: "Explore Weld Yard DWM", labelAr: "استكشف Weld Yard DWM", href: "/dwm" },
      { label: DWM_DEMO_LABEL, labelAr: "طلب عرض تجريبي لـ DWM", href: DWM_DEMO_PATH },
      { label: DWM_ACCESS_LABEL, labelAr: "الدخول إلى DWM", href: DWM_URL, external: true },
    ],
  },
];
