ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS idempotency_key uuid;
CREATE UNIQUE INDEX IF NOT EXISTS inquiries_idempotency_key_uidx ON public.inquiries (idempotency_key) WHERE idempotency_key IS NOT NULL;

CREATE TABLE public.inquiry_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  event text NOT NULL DEFAULT 'inquiry_received' CHECK (event IN ('inquiry_received')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','sent','failed')),
  recipient text NOT NULL CHECK (char_length(recipient) BETWEEN 3 AND 255 AND recipient ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts integer NOT NULL DEFAULT 5 CHECK (max_attempts BETWEEN 1 AND 20),
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  provider_message_id text CHECK (provider_message_id IS NULL OR char_length(provider_message_id) <= 255),
  last_error text CHECK (last_error IS NULL OR char_length(last_error) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT inquiry_notifications_inquiry_event_uniq UNIQUE (inquiry_id, event)
);
CREATE INDEX inquiry_notifications_due_idx ON public.inquiry_notifications (next_attempt_at) WHERE status IN ('pending','processing');

REVOKE ALL ON public.inquiry_notifications FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.inquiry_notifications TO service_role;
ALTER TABLE public.inquiry_notifications ENABLE ROW LEVEL SECURITY;
-- No policies: browser roles have no access at all.

CREATE OR REPLACE FUNCTION public.inquiry_notifications_touch()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
CREATE TRIGGER inquiry_notifications_touch BEFORE UPDATE ON public.inquiry_notifications
FOR EACH ROW EXECUTE FUNCTION public.inquiry_notifications_touch();
REVOKE ALL ON FUNCTION public.inquiry_notifications_touch() FROM PUBLIC, anon, authenticated;

-- Atomic: inquiry + outbox row in one transaction (a function body is a single statement).
CREATE OR REPLACE FUNCTION public.submit_inquiry(
  p_inquiry_type text, p_name text, p_email text, p_company text, p_phone text,
  p_topic text, p_message text, p_idempotency_key uuid, p_recipient text
) RETURNS TABLE (inquiry_id uuid, duplicate boolean)
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE v_id uuid;
BEGIN
  IF p_inquiry_type IS NULL OR p_inquiry_type NOT IN ('contact','quote','dwm_demo') THEN
    RAISE EXCEPTION 'invalid inquiry type' USING ERRCODE = '22023';
  END IF;
  IF p_email IS NULL OR p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid email' USING ERRCODE = '22023';
  END IF;
  IF p_idempotency_key IS NULL THEN
    RAISE EXCEPTION 'missing idempotency key' USING ERRCODE = '22023';
  END IF;

  SELECT i.id INTO v_id FROM public.inquiries i WHERE i.idempotency_key = p_idempotency_key;
  IF v_id IS NOT NULL THEN
    RETURN QUERY SELECT v_id, true; RETURN;
  END IF;

  INSERT INTO public.inquiries (inquiry_type, name, email, company, phone, topic, message, idempotency_key)
  VALUES (p_inquiry_type, p_name, lower(p_email), NULLIF(p_company,''), NULLIF(p_phone,''), NULLIF(p_topic,''), p_message, p_idempotency_key)
  RETURNING id INTO v_id;

  INSERT INTO public.inquiry_notifications (inquiry_id, recipient) VALUES (v_id, p_recipient);

  RETURN QUERY SELECT v_id, false;
EXCEPTION WHEN unique_violation THEN
  SELECT i.id INTO v_id FROM public.inquiries i WHERE i.idempotency_key = p_idempotency_key;
  IF v_id IS NULL THEN RAISE; END IF;
  RETURN QUERY SELECT v_id, true;
END $$;

REVOKE ALL ON FUNCTION public.submit_inquiry(text,text,text,text,text,text,text,uuid,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_inquiry(text,text,text,text,text,text,text,uuid,text) TO service_role;