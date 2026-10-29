CREATE OR REPLACE FUNCTION public.prune_inquiry_rate_limits(p_retention interval DEFAULT interval '24 hours')
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE v_deleted integer;
BEGIN
  IF p_retention IS NULL OR p_retention < interval '24 hours' THEN
    RAISE EXCEPTION 'retention window must be at least 24 hours' USING ERRCODE = '22023';
  END IF;
  DELETE FROM public.inquiry_rate_limits WHERE updated_at < now() - p_retention;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END $$;

ALTER FUNCTION public.prune_inquiry_rate_limits(interval) OWNER TO postgres;
REVOKE ALL ON FUNCTION public.prune_inquiry_rate_limits(interval) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prune_inquiry_rate_limits(interval) TO service_role;