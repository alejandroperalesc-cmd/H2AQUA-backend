import React, { useState } from 'react';
import { API_URL } from './api';
import { SECCIONES } from './secciones';
import CargaMasiva from './CargaMasiva';
import {
  BG_CARD, BG_CARD_ALT,
  GOLD, GOLD_LIGHT, GOLD_GLOW, GOLD_SUBTLE,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER,
} from './theme';

type NuevoProductoForm = {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria: string;
  seccion: string;
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  borderRadius: '0.6rem',
  border: BORDER,
  fontSize: '0.95rem',
  backgroundColor: BG_CARD_ALT,
  color: TEXT_PRIMARY,
  outline: 'none',
} as const;

const labelStyle = {
  display: 'block',
  marginBottom: '0.3rem',
  fontSize: '0.82rem',
  color: TEXT_SECONDARY,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
};

function NuevoProducto() {
  const [form, setForm] = useState<NuevoProductoForm>({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    seccion: '1',
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nombre.trim()) { alert('Por favor escribe el nombre del producto.'); return; }
    if (!form.categoria) { alert('Por favor selecciona si es ÍTEM o TERAPIA.'); return; }

    const precioNumero = Number(form.precio || 0);
    const stockNumero = Number(form.stock || 0);

    if (Number.isNaN(precioNumero) || precioNumero <= 0) { alert('El precio debe ser mayor que 0.'); return; }
    if (Number.isNaN(stockNumero) || stockNumero < 0) { alert('El stock debe ser 0 o mayor.'); return; }

    try {
      setGuardando(true);
      let imagenUrl: string | null = null;

      if (imagen) {
        const fd = new FormData();
        fd.append('imagen', imagen);
        const respImagen = await fetch(`${API_URL}/upload-imagen`, { method: 'POST', body: fd });
        if (!respImagen.ok) throw new Error('No se pudo subir la imagen');
        imagenUrl = (await respImagen.json()).url;
      }

      const resp = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: precioNumero,
          stock: stockNumero,
          categoria: form.categoria,
          imagenUrl,
          seccion: Number(form.seccion),
        }),
      });

      if (!resp.ok) throw new Error('Error al guardar el producto');

      alert('Producto guardado correctamente.');
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', seccion: '1' });
      setImagen(null);
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el producto. Intenta más tarde.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 0 4rem' }}>

      {/* Encabezado */}
      <header style={{ marginBottom: '1.75rem' }}>
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
          Administración
        </p>
        <h1 style={{ fontSize: '2rem', color: TEXT_PRIMARY, fontWeight: 300, letterSpacing: '0.04em' }}>
          Nuevo producto
        </h1>
        <p style={{ margin: '0.4rem 0 0', color: TEXT_SECONDARY, fontSize: '0.95rem' }}>
          Registra productos que se mostrarán en la tienda en línea.
        </p>
      </header>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '1.75rem 2rem 2rem',
          borderRadius: '1.25rem',
          backgroundColor: BG_CARD,
          border: BORDER,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}
      >
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" style={labelStyle}>Nombre del producto</label>
          <input id="nombre" name="nombre" type="text" value={form.nombre} onChange={handleChange} required style={inputStyle} />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" style={labelStyle}>Descripción</label>
          <textarea
            id="descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        {/* Precio + Stock */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label htmlFor="precio" style={labelStyle}>Precio (MXN)</label>
            <input id="precio" name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="stock" style={labelStyle}>Stock inicial</label>
            <input id="stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* Tipo + Sección */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label htmlFor="categoria" style={labelStyle}>Tipo de producto</label>
            <select id="categoria" name="categoria" value={form.categoria} onChange={handleChange} required style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Selecciona…</option>
              <option value="ITEM">Ítem (producto físico)</option>
              <option value="TERAPIA">Terapia (servicio)</option>
            </select>
          </div>
          <div>
            <label htmlFor="seccion" style={labelStyle}>Sección de la tienda</label>
            <select id="seccion" name="seccion" value={form.seccion} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
              {SECCIONES.map((s) => (
                <option key={s.numero} value={s.numero}>{s.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Imagen */}
        <div>
          <label htmlFor="imagen" style={labelStyle}>Imagen del producto</label>
          <div
            style={{
              padding: '1rem',
              borderRadius: '0.6rem',
              border: `1px dashed ${GOLD}`,
              backgroundColor: GOLD_SUBTLE,
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('imagen')?.click()}
          >
            <input id="imagen" name="imagen" type="file" accept="image/*" onChange={(e) => setImagen(e.target.files?.[0] ?? null)} style={{ display: 'none' }} />
            <p style={{ margin: 0, color: imagen ? GOLD : TEXT_MUTED, fontSize: '0.9rem', textAlign: 'center' }}>
              {imagen ? `📎 ${imagen.name}` : 'Haz clic para seleccionar una imagen'}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={guardando}
            style={{
              flex: 1,
              padding: '0.85rem 1.6rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: guardando ? TEXT_MUTED : `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              color: '#1a1f35',
              cursor: guardando ? 'default' : 'pointer',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: guardando ? 'none' : `0 4px 14px ${GOLD_GLOW}`,
            }}
          >
            {guardando ? 'Guardando…' : 'Guardar producto'}
          </button>

          <button
            type="button"
            disabled={guardando}
            onClick={() => {
              setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', seccion: '1' });
              setImagen(null);
            }}
            style={{
              padding: '0.85rem 1.4rem',
              borderRadius: '0.75rem',
              border: BORDER,
              backgroundColor: 'transparent',
              color: TEXT_SECONDARY,
              cursor: guardando ? 'default' : 'pointer',
              fontWeight: 400,
              fontSize: '0.95rem',
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      <CargaMasiva />
    </div>
  );
}

export default NuevoProducto;
