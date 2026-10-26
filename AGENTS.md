<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- Store and DWM are separate external apps; only link to them via constants in `src/lib/site.ts` — never build commerce or DWM features here.
- Shared site copy/data lives in `src/lib/site.ts`; UI strings meant for localization live in `src/lib/i18n.ts` — keeps English/Arabic switch feasible.
- Use logical CSS utilities (start/end, ms/me) and `rtl:` variants so Arabic RTL works without layout rewrites.
- All forms write to the single `inquiries` table (anon insert-only RLS) via `InquiryForm` — one place to manage submissions.
- Page metadata uses `seo()` from `src/lib/seo.ts` in each route's `head()`.
- Language is client state (`LocaleProvider` in `src/lib/locale.tsx`, persisted in localStorage); URLs are identical in both languages and server/crawler metadata stays English — avoids duplicate routes until separate Arabic URLs are approved.
- Translatable content: shared UI strings in `src/lib/i18n.ts`, data items carry an `ar` override read via `loc()`, page copy uses `useTr()(en, ar)`; form topic values stay English so stored inquiries are consistent.
