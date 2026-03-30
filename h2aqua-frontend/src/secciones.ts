export interface Seccion {
  numero: number;
  nombre: string;
}

export const SECCIONES: Seccion[] = [
  { numero: 1, nombre: 'Terapia de Hidrógeno Molecular' },
  { numero: 2, nombre: 'Experiencia Premium de Hidrógeno Molecular' },
  { numero: 3, nombre: 'Tratamientos Faciales' },
  { numero: 4, nombre: 'Skincare Coreano' },
  { numero: 5, nombre: 'Make up, Cabello y Cuerpo' },
  { numero: 6, nombre: 'Nutrición y Suplementos' },
  { numero: 7, nombre: 'Promociones / Ofertas' },
];

// Etiquetas cortas para el navegador flotante de la tienda
export const ETIQUETAS: string[] = [
  'Hidrógeno Molecular',
  'Premium H₂',
  'Faciales',
  'Skincare Coreano',
  'Make up & Cuerpo',
  'Nutrición',
  'Promociones',
];
