import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ESTADOS: { nombre: string; costo: number }[] = [
  { nombre: 'Aguascalientes',    costo: 130 },
  { nombre: 'Baja California',   costo: 200 },
  { nombre: 'Baja California Sur', costo: 210 },
  { nombre: 'Campeche',          costo: 165 },
  { nombre: 'Chiapas',           costo: 160 },
  { nombre: 'Chihuahua',         costo: 180 },
  { nombre: 'Ciudad de México',  costo:  80 },
  { nombre: 'Coahuila',          costo: 170 },
  { nombre: 'Colima',            costo: 150 },
  { nombre: 'Durango',           costo: 165 },
  { nombre: 'Estado de México',  costo:  90 },
  { nombre: 'Guanajuato',        costo: 120 },
  { nombre: 'Guerrero',          costo: 145 },
  { nombre: 'Hidalgo',           costo: 100 },
  { nombre: 'Jalisco',           costo: 130 },
  { nombre: 'Michoacán',         costo: 130 },
  { nombre: 'Morelos',           costo:  95 },
  { nombre: 'Nayarit',           costo: 155 },
  { nombre: 'Nuevo León',        costo: 140 },
  { nombre: 'Oaxaca',            costo: 155 },
  { nombre: 'Puebla',            costo: 110 },
  { nombre: 'Querétaro',         costo: 110 },
  { nombre: 'Quintana Roo',      costo: 180 },
  { nombre: 'San Luis Potosí',   costo: 140 },
  { nombre: 'Sinaloa',           costo: 175 },
  { nombre: 'Sonora',            costo: 190 },
  { nombre: 'Tabasco',           costo: 160 },
  { nombre: 'Tamaulipas',        costo: 160 },
  { nombre: 'Tlaxcala',          costo: 105 },
  { nombre: 'Veracruz',          costo: 150 },
  { nombre: 'Yucatán',           costo: 170 },
  { nombre: 'Zacatecas',         costo: 145 },
];

async function main() {
  for (const { nombre, costo } of ESTADOS) {
    await (prisma as any).costoEnvio.upsert({
      where:  { estado: nombre },
      update: { costo },
      create: { estado: nombre, costo },
    });
  }
  console.log(`Seeded ${ESTADOS.length} estados.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
