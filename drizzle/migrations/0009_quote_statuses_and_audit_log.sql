ALTER TABLE public.inquiries DROP CONSTRAINT inquiries_status_check;
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_status_check CHECK (status = ANY (ARRAY['new','in_progress','resolved','contacted','demo_scheduled','completed','not_interested','under_review','quotation_in_preparation','quotation_sent','won','lost']));

CREATE TABLE public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid NOT NULL,
  actor_email text,
  action text NOT NULL CHECK (char_length(action) <= 60),
  entity_type text NOT NULL CHECK (entity_type IN ('newsletter','contact','dwm_demo','quote','auth')),
  entity_id text,
  old_values jsonb,
  new_values jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON public.admin_audit_logs FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.admin_audit_logs TO authenticated;
GRANT SELECT, INSERT ON public.admin_audit_logs TO service_role;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit logs" ON public.admin_audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX admin_audit_logs_created_at_idx ON public.admin_audit_logs (created_at DESC);
CREATE INDEX admin_audit_logs_actor_idx ON public.admin_audit_logs (actor_user_id);
CREATE INDEX admin_audit_logs_entity_type_idx ON public.admin_audit_logs (entity_type);
CREATE INDEX admin_audit_logs_entity_id_idx ON public.admin_audit_logs (entity_id);

-- Append-only: block UPDATE/DELETE for everyone, including service_role.
CREATE OR REPLACE FUNCTION public.admin_audit_logs_immutable() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN RAISE EXCEPTION 'admin_audit_logs is append-only'; END $$;
CREATE TRIGGER admin_audit_logs_no_change BEFORE UPDATE OR DELETE ON public.admin_audit_logs FOR EACH ROW EXECUTE FUNCTION public.admin_audit_logs_immutable();
CREATE TRIGGER admin_audit_logs_no_truncate BEFORE TRUNCATE ON public.admin_audit_logs FOR EACH STATEMENT EXECUTE FUNCTION public.admin_audit_logs_immutable();

CREATE OR REPLACE FUNCTION public.admin_log_event(p_actor uuid, p_action text, p_entity_type text, p_entity_id text, p_old jsonb, p_new jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.has_role(p_actor, 'admin') THEN RAISE EXCEPTION 'not admin'; END IF;
  INSERT INTO public.admin_audit_logs (actor_user_id, actor_email, action, entity_type, entity_id, old_values, new_values)
  VALUES (p_actor, (SELECT email FROM auth.users WHERE id = p_actor), p_action, p_entity_type, p_entity_id, p_old, p_new);
END $$;

-- Update an inquiry and write its audit rows in one transaction.
CREATE OR REPLACE FUNCTION public.admin_update_inquiry(p_actor uuid, p_id uuid, p_status text, p_read boolean, p_notes text, p_set_notes boolean)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r public.inquiries%ROWTYPE; v_notes text;
BEGIN
  IF NOT public.has_role(p_actor, 'admin') THEN RAISE EXCEPTION 'not admin'; END IF;
  SELECT * INTO r FROM public.inquiries WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RETURN 'not_found'; END IF;
  IF p_status IS NOT NULL AND p_status IS DISTINCT FROM r.status THEN
    UPDATE public.inquiries SET status = p_status, updated_at = now() WHERE id = p_id;
    PERFORM public.admin_log_event(p_actor, 'status_change', r.inquiry_type, p_id::text, jsonb_build_object('status', r.status), jsonb_build_object('status', p_status));
  END IF;
  IF p_read IS NOT NULL AND p_read IS DISTINCT FROM (r.read_at IS NOT NULL) THEN
    UPDATE public.inquiries SET read_at = CASE WHEN p_read THEN now() ELSE NULL END, updated_at = now() WHERE id = p_id;
    PERFORM public.admin_log_event(p_actor, CASE WHEN p_read THEN 'mark_read' ELSE 'mark_unread' END, r.inquiry_type, p_id::text, jsonb_build_object('read', r.read_at IS NOT NULL), jsonb_build_object('read', p_read));
  END IF;
  IF p_set_notes THEN
    v_notes := nullif(btrim(coalesce(p_notes, '')), '');
    IF v_notes IS DISTINCT FROM r.admin_notes THEN
      UPDATE public.inquiries SET admin_notes = v_notes, updated_at = now() WHERE id = p_id;
      PERFORM public.admin_log_event(p_actor, CASE WHEN r.admin_notes IS NULL THEN 'note_created' ELSE 'note_updated' END, r.inquiry_type, p_id::text, jsonb_build_object('notes', r.admin_notes), jsonb_build_object('notes', v_notes));
    END IF;
  END IF;
  RETURN 'ok';
END $$;

REVOKE ALL ON FUNCTION public.admin_log_event(uuid,text,text,text,jsonb,jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_update_inquiry(uuid,uuid,text,boolean,text,boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_audit_logs_immutable() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_log_event(uuid,text,text,text,jsonb,jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_update_inquiry(uuid,uuid,text,boolean,text,boolean) TO service_role;