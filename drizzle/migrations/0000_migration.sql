CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('contact','quote','dwm_demo')),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  company text CHECK (company IS NULL OR char_length(company) <= 160),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  topic text CHECK (topic IS NULL OR char_length(topic) <= 120),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 3000)
);
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);