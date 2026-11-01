CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
REVOKE ALL ON public.user_roles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

ALTER TABLE public.inquiries
  ADD COLUMN status text NOT NULL DEFAULT 'new',
  ADD COLUMN admin_notes text,
  ADD COLUMN read_at timestamptz,
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_status_check CHECK (status IN ('new','in_progress','resolved','contacted','demo_scheduled','completed','not_interested'));
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_admin_notes_len CHECK (admin_notes IS NULL OR char_length(admin_notes) <= 5000);