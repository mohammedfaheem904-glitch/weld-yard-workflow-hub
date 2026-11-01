import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkAdmin, listCommunications, updateInquiry } from "@/lib/communications.functions";
import { STATUSES, subscribersCsv } from "@/lib/communications";
import { useLocale, useTr } from "@/lib/locale";
import { Logo } from "@/components/site/Logo";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated/admin/communications")({
  head: () => ({
    meta: [
      { title: "Communications | Weld Yard Admin" },
      { name: "description", content: "Internal inbox for newsletter subscribers, contact messages and DWM demo requests." },
      { property: "og:title", content: "Communications | Weld Yard Admin" },
      { property: "og:description", content: "Internal Weld Yard communications inbox." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CommunicationsPage,
});

type Data = Awaited<ReturnType<typeof listCommunications>>;
type Inquiry = Data["inquiries"][number];
type Subscriber = Data["subscribers"][number];

const LABELS: Record<string, [string, string]> = {
  new: ["New", "جديد"], in_progress: ["In progress", "قيد المعالجة"], resolved: ["Resolved", "تم الحل"],
  contacted: ["Contacted", "تم التواصل"], demo_scheduled: ["Demo scheduled", "تمت جدولة العرض"],
  completed: ["Completed", "مكتمل"], not_interested: ["Not interested", "غير مهتم"],
  active: ["Active", "نشط"], unsubscribed: ["Unsubscribed", "ألغى الاشتراك"],
  contact: ["Contact", "تواصل"], dwm_demo: ["DWM demo", "عرض DWM"], quote: ["Quote", "عرض سعر"], newsletter: ["Newsletter", "النشرة"],
};

function CommunicationsPage() {
  const tr = useTr();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchAdmin = useServerFn(checkAdmin);
  const admin = useQuery({ queryKey: ["admin-check"], queryFn: () => fetchAdmin() });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Logo />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={signOut}>{tr("Sign out", "تسجيل الخروج")}</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {admin.isPending ? (
          <p className="text-muted-foreground">{tr("Loading…", "جارٍ التحميل…")}</p>
        ) : !admin.data?.isAdmin ? (
          <div role="alert" className="border bg-card p-8">
            <h1 className="text-xl font-bold">{tr("Access denied", "الوصول مرفوض")}</h1>
            <p className="mt-2 text-muted-foreground">{tr("This area is for Weld Yard administrators only.", "هذه المنطقة مخصصة لمسؤولي Weld Yard فقط.")}</p>
          </div>
        ) : (
          <Inbox />
        )}
      </div>
    </div>
  );
}

function Inbox() {
  const tr = useTr();
  const fetchAll = useServerFn(listCommunications);
  const q = useQuery({ queryKey: ["communications"], queryFn: () => fetchAll() });
  const [selected, setSelected] = useState<Inquiry | Subscriber | null>(null);

  if (q.isPending) return <p className="text-muted-foreground">{tr("Loading…", "جارٍ التحميل…")}</p>;
  if (q.isError) return <p role="alert" className="text-destructive">{tr("Could not load communications.", "تعذر تحميل المراسلات.")}</p>;
  const { inquiries, subscribers } = q.data;
  const contacts = inquiries.filter((i) => i.inquiry_type === "contact");
  const demos = inquiries.filter((i) => i.inquiry_type === "dwm_demo");
  const current = selected && "inquiry_type" in selected ? inquiries.find((i) => i.id === selected.id) ?? null : selected;

  const cards: [string, number][] = [
    [tr("Newsletter subscribers", "مشتركو النشرة"), subscribers.filter((s) => s.status === "active").length],
    [tr("New contact messages", "رسائل تواصل جديدة"), contacts.filter((i) => i.status === "new").length],
    [tr("New DWM demo requests", "طلبات عرض DWM جديدة"), demos.filter((i) => i.status === "new").length],
    [tr("Unread messages", "رسائل غير مقروءة"), inquiries.filter((i) => !i.read_at).length],
    [tr("Total communications", "إجمالي المراسلات"), inquiries.length + subscribers.length],
  ];

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight">{tr("Communications", "المراسلات")}</h1>
      <p className="mt-1 text-muted-foreground">{tr("Newsletter subscribers and messages from the public contact form and DWM demo requests.", "مشتركو النشرة الإخبارية ورسائل نموذج التواصل وطلبات عرض DWM.")}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map(([label, n]) => (
          <div key={label} className="border border-s-4 border-s-primary bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold">{n}</p>
          </div>
        ))}
      </div>
      <Tabs defaultValue="all" className="mt-8">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="all">{tr("All", "الكل")}</TabsTrigger>
          <TabsTrigger value="newsletter">{tr("Newsletter subscribers", "مشتركو النشرة")}</TabsTrigger>
          <TabsTrigger value="contact">{tr("Contact messages", "رسائل التواصل")}</TabsTrigger>
          <TabsTrigger value="dwm">{tr("Request a DWM demo", "طلبات عرض DWM")}</TabsTrigger>
        </TabsList>
        <TabsContent value="all"><UnifiedList inquiries={inquiries} subscribers={subscribers} onOpen={setSelected} /></TabsContent>
        <TabsContent value="newsletter"><SubscriberList rows={subscribers} onOpen={setSelected} /></TabsContent>
        <TabsContent value="contact"><InquiryList rows={contacts} kind="contact" onOpen={setSelected} /></TabsContent>
        <TabsContent value="dwm"><InquiryList rows={demos} kind="dwm_demo" onOpen={setSelected} /></TabsContent>
      </Tabs>
      <Sheet open={!!current} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {current && ("inquiry_type" in current ? <InquiryDetail key={current.id} row={current} /> : <SubscriberDetail row={current} />)}
        </SheetContent>
      </Sheet>
    </>
  );
}

function useLabel() {
  const { locale } = useLocale();
  return (k: string) => (LABELS[k] ? LABELS[k][locale === "ar" ? 1 : 0] : k);
}
function useDate() {
  const { locale } = useLocale();
  return (d: string | null) => (d ? new Date(d).toLocaleString(locale === "ar" ? "ar" : "en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—");
}

function StatusBadge({ status }: { status: string }) {
  const label = useLabel();
  const strong = status === "new" || status === "active";
  return <Badge variant={strong ? "default" : "secondary"}>{label(status)}</Badge>;
}

function Toolbar({ search, setSearch, status, setStatus, statuses, sort, setSort, extra }: {
  search: string; setSearch: (s: string) => void; status: string; setStatus: (s: string) => void;
  statuses: readonly string[]; sort: "desc" | "asc"; setSort: (s: "desc" | "asc") => void; extra?: React.ReactNode;
}) {
  const tr = useTr();
  const label = useLabel();
  const sel = "h-9 border bg-background px-2 text-sm";
  return (
    <div className="my-4 flex flex-wrap items-center gap-2">
      <Input className="max-w-xs" placeholder={tr("Search…", "بحث…")} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={tr("Search", "بحث")} />
      <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)} aria-label={tr("Status", "الحالة")}>
        <option value="">{tr("All statuses", "كل الحالات")}</option>
        {statuses.map((s) => <option key={s} value={s}>{label(s)}</option>)}
      </select>
      <select className={sel} value={sort} onChange={(e) => setSort(e.target.value as "desc" | "asc")} aria-label={tr("Sort", "ترتيب")}>
        <option value="desc">{tr("Newest first", "الأحدث أولاً")}</option>
        <option value="asc">{tr("Oldest first", "الأقدم أولاً")}</option>
      </select>
      {extra}
    </div>
  );
}

function sortBy<T extends { created_at: string }>(rows: T[], dir: "desc" | "asc") {
  return [...rows].sort((a, b) => (dir === "desc" ? b.created_at.localeCompare(a.created_at) : a.created_at.localeCompare(b.created_at)));
}

function Empty() {
  const tr = useTr();
  return <p className="border bg-card p-8 text-center text-muted-foreground">{tr("Nothing here yet.", "لا يوجد شيء بعد.")}</p>;
}

function SubscriberList({ rows, onOpen }: { rows: Subscriber[]; onOpen: (s: Subscriber) => void }) {
  const tr = useTr();
  const date = useDate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const list = sortBy(rows.filter((r) => (!status || r.status === status) && r.email.includes(search.trim().toLowerCase())), sort);

  function exportCsv() {
    const blob = new Blob([subscribersCsv(list)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `weldyard-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <Toolbar {...{ search, setSearch, status, setStatus, sort, setSort }} statuses={["active", "unsubscribed"]}
        extra={<Button variant="outline" size="sm" onClick={exportCsv} disabled={!list.length}>{tr("Export CSV", "تصدير CSV")}</Button>} />
      {list.length === 0 ? <Empty /> : (
        <ul className="divide-y border bg-card">
          {list.map((s) => (
            <li key={s.id}>
              <button className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-start hover:bg-muted/60" onClick={() => onOpen(s)}>
                <span dir="ltr" className="font-medium">{s.email}</span>
                <span className="flex items-center gap-3 text-sm text-muted-foreground">{date(s.created_at)} <StatusBadge status={s.status} /></span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function InquiryList({ rows, kind, onOpen }: { rows: Inquiry[]; kind: "contact" | "dwm_demo"; onOpen: (i: Inquiry) => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const s = search.trim().toLowerCase();
  const list = sortBy(rows.filter((r) => (!status || r.status === status) &&
    (!s || [r.name, r.email, r.company, r.topic, r.message].some((v) => v?.toLowerCase().includes(s)))), sort);
  return (
    <>
      <Toolbar {...{ search, setSearch, status, setStatus, sort, setSort }} statuses={STATUSES[kind]} />
      {list.length === 0 ? <Empty /> : <ul className="divide-y border bg-card">{list.map((i) => <InquiryRow key={i.id} row={i} onOpen={onOpen} />)}</ul>}
    </>
  );
}

function InquiryRow({ row, onOpen }: { row: Inquiry; onOpen: (i: Inquiry) => void }) {
  const date = useDate();
  return (
    <li>
      <button className="w-full p-4 text-start hover:bg-muted/60" onClick={() => onOpen(row)}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-semibold">
            {!row.read_at && <span className="size-2 rounded-full bg-primary" aria-hidden />}
            {row.name}{row.company ? <span className="font-normal text-muted-foreground">· {row.company}</span> : null}
          </span>
          <span className="flex items-center gap-3 text-sm text-muted-foreground">{date(row.created_at)} <StatusBadge status={row.status} /></span>
        </div>
        <p dir="ltr" className="text-start text-sm text-muted-foreground rtl:text-end">{row.email}</p>
        {row.topic && <p className="mt-1 text-sm font-medium">{row.topic}</p>}
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{row.message}</p>
      </button>
    </li>
  );
}

function UnifiedList({ inquiries, subscribers, onOpen }: { inquiries: Inquiry[]; subscribers: Subscriber[]; onOpen: (r: Inquiry | Subscriber) => void }) {
  const tr = useTr();
  const label = useLabel();
  const date = useDate();
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const items = useMemo(() => [
    ...inquiries.map((i) => ({ key: i.id, type: i.inquiry_type, status: i.status, created_at: i.created_at, title: i.name, sub: i.email, row: i as Inquiry | Subscriber })),
    ...subscribers.map((s) => ({ key: s.id, type: "newsletter", status: s.status, created_at: s.created_at, title: s.email, sub: "", row: s as Inquiry | Subscriber })),
  ], [inquiries, subscribers]);
  const list = sortBy(items.filter((i) => (!type || i.type === type) && (!status || i.status === status) && (!from || i.created_at >= from)), sort);
  const allStatuses = [...new Set(items.map((i) => i.status))];
  const sel = "h-9 border bg-background px-2 text-sm";
  return (
    <>
      <div className="my-4 flex flex-wrap items-center gap-2">
        <select className={sel} value={type} onChange={(e) => setType(e.target.value)} aria-label={tr("Type", "النوع")}>
          <option value="">{tr("All types", "كل الأنواع")}</option>
          {["newsletter", "contact", "dwm_demo", "quote"].map((t) => <option key={t} value={t}>{label(t)}</option>)}
        </select>
        <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)} aria-label={tr("Status", "الحالة")}>
          <option value="">{tr("All statuses", "كل الحالات")}</option>
          {allStatuses.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm">{tr("From", "من")}
          <Input type="date" className="h-9 w-auto" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <select className={sel} value={sort} onChange={(e) => setSort(e.target.value as "desc" | "asc")} aria-label={tr("Sort", "ترتيب")}>
          <option value="desc">{tr("Newest first", "الأحدث أولاً")}</option>
          <option value="asc">{tr("Oldest first", "الأقدم أولاً")}</option>
        </select>
      </div>
      {list.length === 0 ? <Empty /> : (
        <ul className="divide-y border bg-card">
          {list.map((i) => (
            <li key={i.key}>
              <button className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-start hover:bg-muted/60" onClick={() => onOpen(i.row)}>
                <span className="flex items-center gap-3">
                  <Badge variant="outline">{label(i.type)}</Badge>
                  <span className="font-medium" dir={i.type === "newsletter" ? "ltr" : undefined}>{i.title}</span>
                  {i.sub && <span dir="ltr" className="text-sm text-muted-foreground">{i.sub}</span>}
                </span>
                <span className="flex items-center gap-3 text-sm text-muted-foreground">{date(i.created_at)} <StatusBadge status={i.status} /></span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Field({ k, v, ltr }: { k: string; v: string | null | undefined; ltr?: boolean }) {
  if (!v) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
      <dd dir={ltr ? "ltr" : undefined} className="whitespace-pre-wrap break-words text-start rtl:text-end">{v}</dd>
    </div>
  );
}

function SubscriberDetail({ row }: { row: Subscriber }) {
  const tr = useTr();
  const date = useDate();
  return (
    <>
      <SheetHeader><SheetTitle>{tr("Newsletter subscriber", "مشترك النشرة")}</SheetTitle></SheetHeader>
      <dl className="mt-6 space-y-4">
        <Field k={tr("Email", "البريد")} v={row.email} ltr />
        <div><StatusBadge status={row.status} /></div>
        <Field k={tr("Subscribed", "تاريخ الاشتراك")} v={date(row.created_at)} />
        <Field k={tr("Last update", "آخر تحديث")} v={date(row.updated_at)} />
        <Field k={tr("Unsubscribed", "تاريخ الإلغاء")} v={row.unsubscribed_at ? date(row.unsubscribed_at) : null} />
      </dl>
    </>
  );
}

function InquiryDetail({ row }: { row: Inquiry }) {
  const tr = useTr();
  const label = useLabel();
  const date = useDate();
  const qc = useQueryClient();
  const update = useServerFn(updateInquiry);
  const [notes, setNotes] = useState(row.admin_notes ?? "");
  const m = useMutation({
    mutationFn: (d: { status?: string; read?: boolean; notes?: string }) => update({ data: { id: row.id, ...d } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["communications"] }),
  });
  const statuses = STATUSES[row.inquiry_type as keyof typeof STATUSES] ?? [];
  const isDemo = row.inquiry_type === "dwm_demo";

  return (
    <>
      <SheetHeader><SheetTitle>{label(row.inquiry_type)} — {row.name}</SheetTitle></SheetHeader>
      <dl className="mt-6 space-y-4">
        <Field k={isDemo ? tr("Contact person", "الشخص المسؤول") : tr("Name", "الاسم")} v={row.name} />
        <Field k={tr("Company", "الشركة")} v={row.company} />
        <Field k={isDemo ? tr("Business email", "البريد المهني") : tr("Email", "البريد")} v={row.email} ltr />
        <Field k={tr("Phone", "الهاتف")} v={row.phone} ltr />
        <Field k={tr("Subject", "الموضوع")} v={row.topic} />
        <Field k={isDemo ? tr("Requirements", "المتطلبات") : tr("Message", "الرسالة")} v={row.message} />
        <Field k={tr("Source", "المصدر")} v={label(row.inquiry_type) + " " + tr("form", "نموذج")} />
        <Field k={tr("Submitted", "تاريخ الإرسال")} v={date(row.created_at)} />
      </dl>
      <div className="mt-6 space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{tr("Status", "الحالة")}</p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <Button key={s} size="sm" variant={row.status === s ? "default" : "outline"} disabled={m.isPending} onClick={() => m.mutate({ status: s })}>{label(s)}</Button>
          ))}
        </div>
        <Button size="sm" variant="secondary" disabled={m.isPending} onClick={() => m.mutate({ read: !row.read_at })}>
          {row.read_at ? tr("Mark as unread", "تعليم كغير مقروء") : tr("Mark as read", "تعليم كمقروء")}
        </Button>
      </div>
      <div className="mt-6 space-y-2">
        <label htmlFor="notes" className="text-xs uppercase tracking-wide text-muted-foreground">{tr("Internal note", "ملاحظة داخلية")}</label>
        <Textarea id="notes" rows={4} maxLength={5000} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button size="sm" disabled={m.isPending || notes === (row.admin_notes ?? "")} onClick={() => m.mutate({ notes })}>{tr("Save note", "حفظ الملاحظة")}</Button>
        {m.isError && <p role="alert" className="text-sm text-destructive">{tr("Could not save. Try again.", "تعذر الحفظ. حاول مرة أخرى.")}</p>}
      </div>
    </>
  );
}
