-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" REAL NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "imagenUrl" TEXT,
    "categoria" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "seccion" INTEGER NOT NULL DEFAULT 1,
    "destacado" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Producto" ("categoria", "descripcion", "estado", "id", "imagenUrl", "nombre", "precio", "seccion", "stock") SELECT "categoria", "descripcion", "estado", "id", "imagenUrl", "nombre", "precio", "seccion", "stock" FROM "Producto";
DROP TABLE "Producto";
ALTER TABLE "new_Producto" RENAME TO "Producto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
