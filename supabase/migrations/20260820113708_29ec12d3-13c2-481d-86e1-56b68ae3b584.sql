CREATE TABLE public.site_stats (
  id text PRIMARY KEY,
  visits bigint NOT NULL DEFAULT 0,
  orders bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_stats TO anon;
GRANT SELECT ON public.site_stats TO authenticated;
GRANT ALL ON public.site_stats TO service_role;

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site stats"
  ON public.site_stats FOR SELECT
  USING (true);

INSERT INTO public.site_stats (id, visits, orders) VALUES ('global', 0, 0);

CREATE OR REPLACE FUNCTION public.bump_visit()
RETURNS public.site_stats
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.site_stats
  SET visits = visits + 1, updated_at = now()
  WHERE id = 'global'
  RETURNING *;
$$;

CREATE OR REPLACE FUNCTION public.bump_order()
RETURNS public.site_stats
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.site_stats
  SET orders = orders + 1, updated_at = now()
  WHERE id = 'global'
  RETURNING *;
$$;

GRANT EXECUTE ON FUNCTION public.bump_visit() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bump_order() TO anon, authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_stats;