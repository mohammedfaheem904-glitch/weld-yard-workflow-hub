CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','unsubscribed')),
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz,
  CONSTRAINT newsletter_email_normalized CHECK (email = lower(btrim(email)) AND length(email) BETWEEN 3 AND 254)
);
CREATE UNIQUE INDEX newsletter_subscribers_email_key ON public.newsletter_subscribers (email);
REVOKE ALL ON public.newsletter_subscribers FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.subscribe_newsletter(p_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_email text := lower(btrim(p_email));
  v_status text;
BEGIN
  IF v_email IS NULL OR length(v_email) < 3 OR length(v_email) > 254 OR v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid email' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.newsletter_subscribers (email) VALUES (v_email)
  ON CONFLICT (email) DO NOTHING;
  IF FOUND THEN RETURN 'subscribed'; END IF;
  SELECT status INTO v_status FROM public.newsletter_subscribers WHERE email = v_email FOR UPDATE;
  IF v_status = 'unsubscribed' THEN
    UPDATE public.newsletter_subscribers SET status = 'active', unsubscribed_at = NULL, updated_at = now() WHERE email = v_email;
    RETURN 'resubscribed';
  END IF;
  RETURN 'already_active';
END;
$$;
ALTER FUNCTION public.subscribe_newsletter(text) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.subscribe_newsletter(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text) TO service_role;