REVOKE ALL ON public.inquiries FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;