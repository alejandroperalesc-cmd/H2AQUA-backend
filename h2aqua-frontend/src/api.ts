export const API_URL = import.meta.env.VITE_API_URL as string;

export type Producto = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  imagenUrl?: string | null;
  estado: 'ACTIVO' | 'AGOTADO' | 'INACTIVO';
};

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch(`${API_URL}/productos`);
  if (!respuesta.ok) {
    throw new Error('Error al cargar productos');
  }
  return respuesta.json();
}