-- AlterTable: add protocol boolean fields to Producto
ALTER TABLE "Producto" ADD COLUMN "protocolo_limpieza" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Producto" ADD COLUMN "protocolo_kbeauty" BOOLEAN NOT NULL DEFAULT false;
