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
- All forms submit via `InquiryForm` → `submitInquiry` server fn → `public.submit_inquiry` RPC (service role only), which writes the inquiry and its `inquiry_notifications` outbox row in one transaction; browsers have no table access — keeps validation server-side and notifications durable.
- Email dispatch is gated by server env `INQUIRY_EMAIL_DISPATCH_ENABLED` (off unless "true"); no dispatcher or schedule exists yet — prevents accidental sends before the sender domain is verified.
- Page metadata uses `seo()` from `src/lib/seo.ts` in each route's `head()`.
- Language is client state (`LocaleProvider` in `src/lib/locale.tsx`, persisted in localStorage); URLs are identical in both languages and server/crawler metadata stays English — avoids duplicate routes until separate Arabic URLs are approved.
- Translatable content: shared UI strings in `src/lib/i18n.ts`, data items carry an `ar` override read via `loc()`, page copy uses `useTr()(en, ar)`; form topic values stay English so stored inquiries are consistent.
- Inquiry abuse controls live server-side in `persistInquiry`: an empty-only bot-trap field (filled → generic success, nothing stored) and a database rate limit via `public.consume_inquiry_rate_limit` (service role only) keyed by a salted SHA-256 of the edge-set `cf-connecting-ip` header; never key limits on browser-controlled headers or fields — they are spoofable.
- Rate-limit rows are pruned only via `public.prune_inquiry_rate_limits` (service role only, enforces ≥24h retention, run on demand — no cron); the 24h floor must stay ≥ the max window allowed in `rateLimitConfig` so active windows are never removed.
- Inquiry email dispatch lives in `src/lib/inquiry-mailer.server.ts`: claim via `public.claim_inquiry_notifications` (FOR UPDATE SKIP LOCKED, reclaims stale `processing`), finish via `public.complete_inquiry_notification` keyed by the claim token (both service role only); delivery is at-least-once with a per-notification provider Idempotency-Key, and the dispatcher must be awaited by a worker — never fired as an unawaited promise from the form handler.
- Vitest runs files serially (`fileParallelism: false`) because integration tests share the live notification queue.
