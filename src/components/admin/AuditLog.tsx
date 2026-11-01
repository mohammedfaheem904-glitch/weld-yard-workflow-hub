import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAuditLogs } from "@/lib/communications.functions";
import { formatAdminDateTime } from "@/lib/communications";
import { useLocale, useTr } from "@/lib/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Log = Awaited<ReturnType<typeof listAuditLogs>>["logs"][number];

const ACTIONS: Record<string, [string, string]> = {
  sign_in: ["Signed in", "تسجيل الدخول"], sign_out: ["Signed out", "تسجيل الخروج"],
  status_change: ["Status changed", "تغيير الحالة"], mark_read: ["Marked read", "تعليم كمقروء"],
  mark_unread: ["Marked unread", "تعليم كغير مقروء"], note_created: ["Note added", "إضافة ملاحظة"],
  note_updated: ["Note updated", "تحديث ملاحظة"], newsletter_export: ["Subscribers exported", "تصدير المشتركين"],
};
const TYPES: Record<string, [string, string]> = {
  auth: ["Account", "الحساب"], newsletter: ["Newsletter", "النشرة"], contact: ["Contact", "تواصل"],
  dwm_demo: ["DWM demo", "عرض DWM"], quote: ["Quote", "عرض سعر"],
};
const PAGE = 25;

const show = (v: unknown) => (v == null ? "—" : typeof v === "object" ? Object.entries(v as object).map(([k, x]) => `${k}: ${x ?? "—"}`).join("\n") : String(v));

export function AuditLog() {
  const tr = useTr();
  const { locale } = useLocale();
  const L = (m: Record<string, [string, string]>, k: string) => (m[k] ? m[k][locale === "ar" ? 1 : 0] : k);
  const date = (d: string) => formatAdminDateTime(d, locale === "ar" ? "ar" : "en");
  const fetchLogs = useServerFn(listAuditLogs);
  const q = useQuery({ queryKey: ["audit-logs"], queryFn: () => fetchLogs() });
  const [search, setSearch] = useState("");
  const [actor, setActor] = useState("");
  const [action, setAction] = useState("");
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<Log | null>(null);
  const logs = q.data?.logs ?? [];
  const actors = useMemo(() => [...new Map(logs.map((l) => [l.actor_user_id, l.actor_email ?? l.actor_user_id])).entries()], [logs]);
  const s = search.trim().toLowerCase();
  const list = logs
    .filter((l) => (!actor || l.actor_user_id === actor) && (!action || l.action === action) && (!type || l.entity_type === type) &&
      (!from || l.created_at >= from) && (!to || l.created_at.slice(0, 10) <= to) &&
      (!s || [l.actor_email, l.action, l.entity_id, JSON.stringify(l.old_values), JSON.stringify(l.new_values)].some((v) => v?.toLowerCase().includes(s))))
    .sort((a, b) => (sort === "desc" ? b.created_at.localeCompare(a.created_at) : a.created_at.localeCompare(b.created_at)));
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const cur = Math.min(page, pages - 1);
  const rows = list.slice(cur * PAGE, cur * PAGE + PAGE);
  const sel = "h-9 border bg-background px-2 text-sm";
  const reset = <T,>(f: (v: T) => void) => (v: T) => { f(v); setPage(0); };

  if (q.isPending) return <p className="my-4 text-muted-foreground">{tr("Loading…", "جارٍ التحميل…")}</p>;
  if (q.isError) return <p role="alert" className="my-4 text-destructive">{tr("Could not load the audit log.", "تعذر تحميل سجل التدقيق.")}</p>;

  return (
    <>
      <div className="my-4 flex flex-wrap items-center gap-2">
        <Input className="max-w-xs" placeholder={tr("Search…", "بحث…")} value={search} onChange={(e) => reset(setSearch)(e.target.value)} aria-label={tr("Search", "بحث")} />
        <select className={sel} value={actor} onChange={(e) => reset(setActor)(e.target.value)} aria-label={tr("Admin", "المسؤول")}>
          <option value="">{tr("All admins", "كل المسؤولين")}</option>
          {actors.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
        <select className={sel} value={action} onChange={(e) => reset(setAction)(e.target.value)} aria-label={tr("Action", "الإجراء")}>
          <option value="">{tr("All actions", "كل الإجراءات")}</option>
          {Object.keys(ACTIONS).map((k) => <option key={k} value={k}>{L(ACTIONS, k)}</option>)}
        </select>
        <select className={sel} value={type} onChange={(e) => reset(setType)(e.target.value)} aria-label={tr("Type", "النوع")}>
          <option value="">{tr("All types", "كل الأنواع")}</option>
          {Object.keys(TYPES).map((k) => <option key={k} value={k}>{L(TYPES, k)}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm">{tr("From", "من")}<Input type="date" className="h-9 w-auto" value={from} onChange={(e) => reset(setFrom)(e.target.value)} /></label>
        <label className="flex items-center gap-2 text-sm">{tr("To", "إلى")}<Input type="date" className="h-9 w-auto" value={to} onChange={(e) => reset(setTo)(e.target.value)} /></label>
        <select className={sel} value={sort} onChange={(e) => setSort(e.target.value as "desc" | "asc")} aria-label={tr("Sort", "ترتيب")}>
          <option value="desc">{tr("Newest first", "الأحدث أولاً")}</option>
          <option value="asc">{tr("Oldest first", "الأقدم أولاً")}</option>
        </select>
      </div>
      {rows.length === 0 ? (
        <p className="border bg-card p-8 text-center text-muted-foreground">{tr("No audit events yet.", "لا توجد أحداث بعد.")}</p>
      ) : (
        <ul className="divide-y border bg-card">
          {rows.map((l) => (
            <li key={l.id}>
              <button className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-start hover:bg-muted/60" onClick={() => setOpen(l)}>
                <span className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">{L(TYPES, l.entity_type)}</Badge>
                  <span className="font-medium">{L(ACTIONS, l.action)}</span>
                  <span dir="ltr" className="text-sm text-muted-foreground">{l.actor_email ?? l.actor_user_id}</span>
                </span>
                <time dateTime={l.created_at} dir={locale === "ar" ? "rtl" : "ltr"} className="text-sm text-muted-foreground [unicode-bidi:isolate]">{date(l.created_at)}</time>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{list.length} {tr("events", "حدث")}</span>
        <span className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={cur === 0} onClick={() => setPage(cur - 1)}>{tr("Previous", "السابق")}</Button>
          <span>{cur + 1} / {pages}</span>
          <Button size="sm" variant="outline" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>{tr("Next", "التالي")}</Button>
        </span>
      </div>
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {open && (
            <>
              <SheetHeader><SheetTitle>{L(ACTIONS, open.action)}</SheetTitle></SheetHeader>
              <dl className="mt-6 space-y-4 text-sm">
                {([
                  [tr("Date and time", "التاريخ والوقت"), date(open.created_at), false],
                  [tr("Admin", "المسؤول"), open.actor_email ?? "—", true],
                  [tr("Admin ID", "معرّف المسؤول"), open.actor_user_id, true],
                  [tr("Communication type", "نوع المراسلة"), L(TYPES, open.entity_type), false],
                  [tr("Affected record", "السجل المتأثر"), open.entity_id ?? "—", true],
                  [tr("Previous value", "القيمة السابقة"), show(open.old_values), false],
                  [tr("New value", "القيمة الجديدة"), show(open.new_values), false],
                ] as [string, string, boolean][]).map(([k, v, ltr]) => (
                  <div key={k}>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
                    <dd dir={ltr ? "ltr" : locale === "ar" ? "rtl" : "ltr"} className={`whitespace-pre-wrap break-words [unicode-bidi:isolate] ${locale === "ar" ? "text-right" : "text-left"}`}>{v}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
