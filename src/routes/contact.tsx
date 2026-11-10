import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Headset, Handshake, MapPin } from "lucide-react";
import { STORE_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { useLocalizedMeta, useTr } from "@/lib/locale";
import { FormPage } from "@/components/site/FormPage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Checklist } from "@/components/site/blocks";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact", "Contact Weld Yard about welding products, engineering, QA/QC inspection or Weld Yard DWM.", "/contact"),
  component: Page,
});

function Page() {
  const tr = useTr();
  useLocalizedMeta({ title: "تواصل معنا", description: "تواصل مع Weld Yard بشأن منتجات اللحام أو الهندسة أو فحص ضمان/مراقبة الجودة (QA/QC) أو Weld Yard DWM." });
  const topics = ([
    ["General enquiry", "استفسار عام"],
    ["Welding Products", "منتجات اللحام"],
    ["Welding Engineering", "هندسة اللحام"],
    ["QA/QC & Inspection", "ضمان/مراقبة الجودة (QA/QC) والفحص"],
    ["Weld Yard DWM", "Weld Yard DWM"],
    ["Other", "أخرى"],
  ] as [string, string][]).map(([en, ar]) => ({ value: en, label: tr(en, ar) }));
  return (
    <FormPage
      eyebrow={tr("Contact", "تواصل معنا")}
      title={tr("Contact our team", "تواصل مع فريقنا")}
      intro={tr("Send us a message about products, engineering, inspection or DWM and the right person will get back to you.", "أرسل لنا رسالة بشأن المنتجات أو الهندسة أو الفحص أو DWM وسيتواصل معك الشخص المختص.")}
      aside={
        <div className="space-y-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {([
              [Mail, tr("Email", "البريد الإلكتروني"), "system@weldyard.com", tr("All sales and support inquiries.", "جميع استفسارات المبيعات والدعم.")],
              [Headset, tr("Customer Support", "دعم العملاء"), "support@weldyard.com", tr("Existing customers — response within 4 business hours.", "العملاء الحاليون — الرد خلال 4 ساعات عمل.")],
              [Handshake, tr("Partnerships", "الشراكات"), "partners@weldyard.com", tr("Resellers, integrators, training providers.", "الموزعون ومُدمجو الأنظمة ومزودو التدريب.")],
              [MapPin, tr("Headquarters", "المقر الرئيسي"), null, tr("Serving the GCC, MENA and global EPC supply chain.", "نخدم دول الخليج والشرق الأوسط وشمال أفريقيا وسلاسل توريد مشاريع EPC عالميًا.")],
            ] as const).map(([Icon, label, email, desc]) => (
              <li key={label} className="group rounded-lg border bg-card p-4 transition-colors hover:border-primary/60">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                </div>
                {email ? (
                  <a href={`mailto:${email}`} dir="ltr" className="mt-3 block break-all font-bold text-foreground hover:text-brand-ink">{email}</a>
                ) : (
                  <p className="mt-3 font-bold text-foreground">{tr("Cairo, Egypt", "القاهرة، مصر")}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </li>
            ))}
          </ul>
          <Checklist items={tr(["General enquiries", "Technical questions", "Partnership requests"], ["الاستفسارات العامة", "الأسئلة الفنية", "طلبات الشراكة"])} />
          <p className="text-sm text-muted-foreground">
            {tr("Need pricing?", "تحتاج إلى أسعار؟")} <Link to="/request-quote" className="font-bold text-brand-ink">{tr("Request a quote", "اطلب عرض سعر")}</Link>. {tr("Ready to order?", "جاهز للطلب؟")} <a href={STORE_URL} className="font-bold text-brand-ink">{tr("Visit the store", "زُر المتجر")}</a>.
          </p>
        </div>
      }
    >
      <InquiryForm type="contact" topics={topics} />
    </FormPage>
  );
}
