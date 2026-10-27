DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;
REVOKE INSERT ON public.inquiries FROM anon, authenticated;
COMMENT ON TABLE public.inquiries IS 'Written only via public.submit_inquiry (server-side, service role). No browser access.';