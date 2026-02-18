import React, { useState } from 'react';

// mismos colores que en App.tsx
const COLOR_TIFFANY = '#81D8D0';
const COLOR_TURQUESA_CLARO = '#9DE7D7';
const COLOR_TEXTO = '#111827';
const COLOR_TEXTO_SUAVE = '#4B5563';

const API_URL = 'http://localhost:3000';

type NuevoProductoForm = {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria: string; // 'ITEM' | 'TERAPIA'
};

function NuevoProducto() {
  const [form, setForm] = useState<NuevoProductoForm>({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImagenChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImagen(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert('Por favor escribe el nombre del producto.');
      return;
    }

    if (!form.categoria) {
      alert('Por favor selecciona si es ÍTEM o TERAPIA.');
      return;
    }

    const precioNumero = Number(form.precio || 0);
    const stockNumero = Number(form.stock || 0);

    if (Number.isNaN(precioNumero) || precioNumero <= 0) {
      alert('Revisa el precio, debe ser un número mayor que 0.');
      return;
    }
    if (Number.isNaN(stockNumero) || stockNumero < 0) {
      alert('Revisa el stock, debe ser un número mayor o igual a 0.');
      return;
    }

    try {
      setGuardando(true);

      let imagenUrl: string | null = null;

      // 1) Si hay imagen, subirla primero a /upload-imagen
      if (imagen) {
        const fd = new FormData();
        fd.append('imagen', imagen);

        const respImagen = await fetch(`${API_URL}/upload-imagen`, {
          method: 'POST',
          body: fd,
        });

        if (!respImagen.ok) {
          const errorBody = await respImagen.text();
          console.error('Error al subir imagen:', errorBody);
          throw new Error('No se pudo subir la imagen');
        }

        const dataImagen = (await respImagen.json()) as { url: string };
        imagenUrl = dataImagen.url;
      }

      // 2) Crear el producto con JSON, incluyendo imagenUrl
      const respProducto = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: precioNumero,
          stock: stockNumero,
          categoria: form.categoria, // siempre 'ITEM' o 'TERAPIA'
          imagenUrl, // puede ser null si no se subió imagen
        }),
      });

      if (!respProducto.ok) {
        const errorBody = await respProducto.text();
        console.error('Error respuesta API productos:', errorBody);
        throw new Error('Error al guardar el producto');
      }

      alert('Producto guardado correctamente.');
      setForm({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
      });
      setImagen(null);
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el producto. Intenta más tarde.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2.5rem 0 4rem',
      }}
    >
      <header
        style={{
          marginBottom: '1.5rem',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '0.25rem',
            color: COLOR_TEXTO,
          }}
        >
          Nuevo producto
        </h1>
        <p
          style={{
            margin: 0,
            color: COLOR_TEXTO_SUAVE,
            fontSize: '0.98rem',
          }}
        >
          Registra productos que podrás mostrar en la tienda en línea.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: '1.75rem 1.75rem 2rem',
          borderRadius: '1rem',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow:
            '0 18px 35px rgba(15, 23, 42, 0.04), 0 4px 10px rgba(15, 23, 42, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div>
          <label
            htmlFor="nombre"
            style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontSize: '0.9rem',
              color: COLOR_TEXTO,
            }}
          >
            Nombre del producto
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="descripcion"
            style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontSize: '0.9rem',
              color: COLOR_TEXTO,
            }}
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
              resize: 'vertical',
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <label
              htmlFor="precio"
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontSize: '0.9rem',
                color: COLOR_TEXTO,
              }}
            >
              Precio (MXN)
            </label>
            <input
              id="precio"
              name="precio"
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontSize: '0.9rem',
                color: COLOR_TEXTO,
              }}
            >
              Stock inicial
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
              }}
            />
          </div>
        </div>

        {/* Campo categoría como catálogo obligatorio */}
        <div>
          <label
            htmlFor="categoria"
            style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontSize: '0.9rem',
              color: COLOR_TEXTO,
            }}
          >
            Tipo de producto (obligatorio)
          </label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">Selecciona una opción</option>
            <option value="ITEM">Ítem (producto físico)</option>
            <option value="TERAPIA">Terapia (servicio)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="imagen"
            style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontSize: '0.9rem',
              color: COLOR_TEXTO,
            }}
          >
            Imagen del producto
          </label>
          <input
            id="imagen"
            name="imagen"
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
          />
          {imagen && (
            <p
              style={{
                marginTop: '0.25rem',
                fontSize: '0.85rem',
                color: COLOR_TEXTO_SUAVE,
              }}
            >
              Archivo seleccionado: {imagen.name}
            </p>
          )}
        </div>

        <div
          style={{
            marginTop: '0.75rem',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <button
            type="submit"
            disabled={guardando}
            style={{
              padding: '0.75rem 1.6rem',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: guardando ? '#9ca3af' : COLOR_TIFFANY,
              color: '#ffffff',
              cursor: guardando ? 'default' : 'pointer',
              fontWeight: 500,
              fontSize: '0.95rem',
            }}
          >
            {guardando ? 'Guardando...' : 'Guardar producto'}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({
                nombre: '',
                descripcion: '',
                precio: '',
                stock: '',
                categoria: '',
              });
              setImagen(null);
            }}
            disabled={guardando}
            style={{
              padding: '0.75rem 1.6rem',
              borderRadius: '999px',
              border: `1px solid ${COLOR_TURQUESA_CLARO}`,
              backgroundColor: 'transparent',
              color: COLOR_TURQUESA_CLARO,
              cursor: guardando ? 'default' : 'pointer',
              fontWeight: 400,
              fontSize: '0.95rem',
            }}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoProducto;