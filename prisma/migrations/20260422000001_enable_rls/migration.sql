-- Enable Row Level Security on all tables.
-- The backend connects via service_role (DIRECT_URL) which has BYPASSRLS
-- by default in Supabase, so no existing queries are affected.
-- The explicit policy makes the intent clear and satisfies Supabase security advisors.

ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cliente"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Servicio"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Producto"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cita"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Pedido"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PedidoProducto"     ENABLE ROW LEVEL SECURITY;

-- Grant full access to service_role on every table.
-- All backend traffic uses the service_role key; no other role needs access.
CREATE POLICY "service_role_full_access" ON "_prisma_migrations" FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_access" ON "Cliente"            FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_access" ON "Servicio"           FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_access" ON "Producto"           FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_access" ON "Cita"               FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_access" ON "Pedido"             FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_full_access" ON "PedidoProducto"     FOR ALL TO service_role USING (true) WITH CHECK (true);
