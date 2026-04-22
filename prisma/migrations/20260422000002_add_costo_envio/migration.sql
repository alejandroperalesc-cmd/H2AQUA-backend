-- CreateTable
CREATE TABLE "CostoEnvio" (
    "id"     SERIAL       NOT NULL,
    "estado" TEXT         NOT NULL,
    "costo"  DOUBLE PRECISION NOT NULL DEFAULT 0,
    CONSTRAINT "CostoEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CostoEnvio_estado_key" ON "CostoEnvio"("estado");

-- Seed: all 32 Mexican states with costo = 0
INSERT INTO "CostoEnvio" ("estado", "costo") VALUES
  ('Aguascalientes',     0),
  ('Baja California',    0),
  ('Baja California Sur',0),
  ('Campeche',           0),
  ('Chiapas',            0),
  ('Chihuahua',          0),
  ('Ciudad de México',   0),
  ('Coahuila',           0),
  ('Colima',             0),
  ('Durango',            0),
  ('Guanajuato',         0),
  ('Guerrero',           0),
  ('Hidalgo',            0),
  ('Jalisco',            0),
  ('México',             0),
  ('Michoacán',          0),
  ('Morelos',            0),
  ('Nayarit',            0),
  ('Nuevo León',         0),
  ('Oaxaca',             0),
  ('Puebla',             0),
  ('Querétaro',          0),
  ('Quintana Roo',       0),
  ('San Luis Potosí',    0),
  ('Sinaloa',            0),
  ('Sonora',             0),
  ('Tabasco',            0),
  ('Tamaulipas',         0),
  ('Tlaxcala',           0),
  ('Veracruz',           0),
  ('Yucatán',            0),
  ('Zacatecas',          0);

-- Enable RLS
ALTER TABLE "CostoEnvio" ENABLE ROW LEVEL SECURITY;

-- Grant full access to service_role
CREATE POLICY "service_role_full_access" ON "CostoEnvio" FOR ALL TO service_role USING (true) WITH CHECK (true);
