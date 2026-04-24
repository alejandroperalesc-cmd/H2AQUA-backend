-- CreateTable
CREATE TABLE "DiaBloqueado" (
    "id"    SERIAL NOT NULL,
    "fecha" TEXT   NOT NULL,
    CONSTRAINT "DiaBloqueado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiaBloqueado_fecha_key" ON "DiaBloqueado"("fecha");

-- Enable RLS
ALTER TABLE "DiaBloqueado" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access" ON "DiaBloqueado" FOR ALL TO service_role USING (true) WITH CHECK (true);
