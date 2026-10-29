CREATE OR REPLACE FUNCTION public.claim_inquiry_notifications(p_limit integer DEFAULT 10, p_stale_after interval DEFAULT interval '15 minutes')
RETURNS TABLE (id uuid, claim_token timestamptz, attempts integer, max_attempts integer, recipient text,
  inquiry_id uuid, inquiry_type text, name text, email text, company text, phone text, topic text, message text, inquiry_created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''
AS $$
BEGIN
  IF p_limit IS NULL OR p_limit < 1 OR p_limit > 50 THEN
    RAISE EXCEPTION 'limit must be between 1 and 50' USING ERRCODE = '22023';
  END IF;
  IF p_stale_after IS NULL OR p_stale_after < interval '5 minutes' THEN
    RAISE EXCEPTION 'stale window must be at least 5 minutes' USING ERRCODE = '22023';
  END IF;

  -- Crashed workers that already used their last attempt become terminal.
  UPDATE public.inquiry_notifications n
     SET status = 'failed', locked_at = NULL, last_error = 'worker_lost_after_final_attempt'
   WHERE n.status = 'processing' AND n.locked_at < now() - p_stale_after AND n.attempts >= n.max_attempts;

  RETURN QUERY
  WITH picked AS (
    SELECT n.id FROM public.inquiry_notifications n
     WHERE n.attempts < n.max_attempts
       AND ((n.status = 'pending' AND n.next_attempt_at <= now())
         OR (n.status = 'processing' AND n.locked_at < now() - p_stale_after))
     ORDER BY n.next_attempt_at
     LIMIT p_limit
     FOR UPDATE SKIP LOCKED
  ), claimed AS (
    UPDATE public.inquiry_notifications n
       SET status = 'processing', locked_at = clock_timestamp(), attempts = n.attempts + 1
      FROM picked WHERE n.id = picked.id
    RETURNING n.id, n.locked_at, n.attempts, n.max_attempts, n.recipient, n.inquiry_id
  )
  SELECT c.id, c.locked_at, c.attempts, c.max_attempts, c.recipient, i.id, i.inquiry_type, i.name, i.email,
         i.company, i.phone, i.topic, i.message, i.created_at
    FROM claimed c JOIN public.inquiries i ON i.id = c.inquiry_id;
END $$;

CREATE OR REPLACE FUNCTION public.complete_inquiry_notification(p_id uuid, p_claim_token timestamptz, p_success boolean,
  p_provider_message_id text DEFAULT NULL, p_error text DEFAULT NULL, p_permanent boolean DEFAULT false, p_retry_delay_seconds integer DEFAULT 60)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''
AS $$
DECLARE v_status text;
BEGIN
  UPDATE public.inquiry_notifications n
     SET status = CASE WHEN p_success THEN 'sent'
                       WHEN p_permanent OR n.attempts >= n.max_attempts THEN 'failed'
                       ELSE 'pending' END,
         sent_at = CASE WHEN p_success THEN now() ELSE n.sent_at END,
         provider_message_id = CASE WHEN p_success THEN left(p_provider_message_id, 255) ELSE n.provider_message_id END,
         last_error = CASE WHEN p_success THEN NULL ELSE left(p_error, 500) END,
         next_attempt_at = CASE WHEN p_success THEN n.next_attempt_at
                                ELSE now() + make_interval(secs => greatest(1, least(coalesce(p_retry_delay_seconds, 60), 86400))) END,
         locked_at = NULL
   WHERE n.id = p_id AND n.status = 'processing' AND n.locked_at = p_claim_token
  RETURNING n.status INTO v_status;
  RETURN coalesce(v_status, 'lost_claim');
END $$;

ALTER FUNCTION public.claim_inquiry_notifications(integer, interval) OWNER TO postgres;
ALTER FUNCTION public.complete_inquiry_notification(uuid, timestamptz, boolean, text, text, boolean, integer) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.claim_inquiry_notifications(integer, interval) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_inquiry_notification(uuid, timestamptz, boolean, text, text, boolean, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_inquiry_notifications(integer, interval) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_inquiry_notification(uuid, timestamptz, boolean, text, text, boolean, integer) TO service_role;