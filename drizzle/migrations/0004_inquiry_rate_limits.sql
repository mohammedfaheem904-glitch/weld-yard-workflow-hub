CREATE TABLE public.inquiry_rate_limits (
  bucket text PRIMARY KEY CHECK (char_length(bucket) BETWEEN 1 AND 128),
  window_start timestamptz NOT NULL DEFAULT now(),
  hits integer NOT NULL DEFAULT 0 CHECK (hits >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON public.inquiry_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.inquiry_rate_limits TO service_role;
ALTER TABLE public.inquiry_rate_limits ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.inquiry_rate_limits IS 'Per-client (hashed) inquiry submission counters. Service role only.';

-- Atomic fixed-window counter: ON CONFLICT takes a row lock, so concurrent calls serialize.
CREATE OR REPLACE FUNCTION public.consume_inquiry_rate_limit(p_bucket text, p_limit integer, p_window_seconds integer)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE v_hits integer;
BEGIN
  IF p_bucket IS NULL OR char_length(p_bucket) NOT BETWEEN 1 AND 128
     OR p_limit IS NULL OR p_limit < 1 OR p_window_seconds IS NULL OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'invalid rate limit arguments' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.inquiry_rate_limits AS r (bucket, window_start, hits, updated_at)
  VALUES (p_bucket, now(), 1, now())
  ON CONFLICT (bucket) DO UPDATE SET
    hits = CASE WHEN r.window_start <= now() - make_interval(secs => p_window_seconds) THEN 1 ELSE r.hits + 1 END,
    window_start = CASE WHEN r.window_start <= now() - make_interval(secs => p_window_seconds) THEN now() ELSE r.window_start END,
    updated_at = now()
  RETURNING r.hits INTO v_hits;
  RETURN v_hits <= p_limit;
END $$;
REVOKE ALL ON FUNCTION public.consume_inquiry_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_inquiry_rate_limit(text, integer, integer) TO service_role;