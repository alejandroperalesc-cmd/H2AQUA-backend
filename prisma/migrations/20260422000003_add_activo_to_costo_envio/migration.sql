-- Add activo column to CostoEnvio (default true = active)
ALTER TABLE "CostoEnvio" ADD COLUMN "activo" BOOLEAN NOT NULL DEFAULT true;
