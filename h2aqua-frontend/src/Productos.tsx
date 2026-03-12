import { useEffect, useState } from 'react';
import { obtenerProductos, API_URL } from './api';
import type { Producto } from './api';
import { SECCIONES } from './secciones';
import {
  BG_CARD, BG_CARD_ALT,
  GOLD, GOLD_LIGHT, GOLD_GLOW, GOLD_SUBTLE,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER, BORDER_SUBTLE,
  SUCCESS, ERROR, WARNING,
} from './theme';

const inputStyle = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  borderRadius: '0.5rem',
  border: BORDER,
  fontSize: '0.9rem',
  backgroundColor: BG_CARD_ALT,
  color: TEXT_PRIMARY,
  outline: 'none',
} as const;

const estadoColor = (e: string) =>
  e === 'ACTIVO' ? SUCCESS : e === 'AGOTADO' ? WARNING : TEXT_MUTED;

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', imagenUrl: '', categoria: '', seccion: '1',
  });
  // Para mostrar feedback visual al cambiar sección rápidamente
  const [cambiandoSeccion, setCambiandoSeccion] = useState<number | null>(null);

  async function cargar() {
    try {
      setCargando(true);
      setProductos(await obtenerProductos());
    } catch {
      setError('No se pudieron cargar los productos');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  // ── Cambio rápido de sección ──────────────────────────────────────────────
  async function cambiarSeccion(id: number, seccion: number) {
    setCambiandoSeccion(id);
    try {
      await fetch(`${API_URL}/productos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seccion }),
      });
      setProductos((prev) => prev.map((p) => p.id === id ? { ...p, seccion } : p));
    } catch {
      alert('No se pudo actualizar la sección.');
    } finally {
      setCambiandoSeccion(null);
    }
  }

  // ── Cambio de estado ──────────────────────────────────────────────────────
  async function cambiarEstado(id: number, estado: 'ACTIVO' | 'AGOTADO' | 'INACTIVO') {
    try {
      await fetch(`${API_URL}/productos/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      setProductos((prev) => prev.map((p) => p.id === id ? { ...p, estado } : p));
    } catch {
      setError('No se pudo actualizar el estado');
    }
  }

  // ── Eliminar ──────────────────────────────────────────────────────────────
  async function eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('No se pudo eliminar el producto');
    }
  }

  // ── Edición completa ──────────────────────────────────────────────────────
  function empezarEdicion(p: Producto) {
    setEditandoId(p.id);
    setForm({
      nombre: p.nombre ?? '',
      descripcion: p.descripcion ?? '',
      precio: String(p.precio ?? ''),
      imagenUrl: p.imagenUrl ?? '',
      categoria: p.categoria ?? '',
      seccion: String(p.seccion ?? 1),
    });
  }

  async function guardarEdicion(id: number) {
    const precioNum = Number(form.precio);
    if (Number.isNaN(precioNum)) { alert('El precio debe ser un número'); return; }

    try {
      const resp = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: precioNum,
          imagenUrl: form.imagenUrl || null,
          categoria: form.categoria || null,
          seccion: Number(form.seccion),
        }),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        alert(`Error al guardar: ${body.error ?? `HTTP ${resp.status}`}`);
        return;
      }
      setEditandoId(null);
      await cargar();
    } catch (err: any) {
      alert(`No se pudo conectar con el servidor: ${err.message}`);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (cargando) return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 0' }}>
      <p style={{ color: TEXT_MUTED }}>Cargando productos…</p>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 0' }}>
      <p style={{ color: ERROR }}>{error}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 0 4rem' }}>

      {/* Encabezado */}
      <header style={{ marginBottom: '2rem' }}>
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
          Administración
        </p>
        <h1 style={{ fontSize: '2rem', color: TEXT_PRIMARY, fontWeight: 300, letterSpacing: '0.04em' }}>
          Panel de productos
        </h1>
        <p style={{ margin: '0.4rem 0 0', color: TEXT_SECONDARY, fontSize: '0.95rem' }}>
          {productos.length} productos registrados · Asigna secciones y gestiona el catálogo.
        </p>
      </header>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {productos.map((p) => {
          const enEdicion = editandoId === p.id;
          const seccionActual = p.seccion;
          const guardandoSeccion = cambiandoSeccion === p.id;

          return (
            <div
              key={p.id}
              style={{
                borderRadius: '1rem',
                border: enEdicion ? BORDER : BORDER_SUBTLE,
                backgroundColor: BG_CARD,
                overflow: 'hidden',
                transition: 'border 0.2s',
              }}
            >
              {/* Vista normal */}
              {!enEdicion && (
                <div style={{ display: 'flex', gap: '1rem', padding: '1rem 1.25rem', alignItems: 'flex-start' }}>

                  {/* Imagen */}
                  <div
                    style={{
                      width: '72px', height: '72px', flexShrink: 0,
                      borderRadius: '0.6rem', overflow: 'hidden',
                      backgroundColor: BG_CARD_ALT,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {p.imagenUrl
                      ? <img src={p.imagenUrl} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '0.65rem', color: TEXT_MUTED }}>Sin img</span>
                    }
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.98rem' }}>{p.nombre}</span>
                      <span style={{ color: GOLD, fontWeight: 700, fontSize: '0.95rem' }}>${p.precio.toLocaleString('es-MX')} MXN</span>
                      <span
                        style={{
                          fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em',
                          color: estadoColor(p.estado),
                          backgroundColor: `${estadoColor(p.estado)}1a`,
                          padding: '0.15rem 0.55rem', borderRadius: '999px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {p.estado}
                      </span>
                    </div>
                    {p.descripcion && (
                      <p style={{ margin: '0.3rem 0 0', color: TEXT_MUTED, fontSize: '0.85rem', lineHeight: 1.4 }}>{p.descripcion}</p>
                    )}
                  </div>

                  {/* Selector rápido de sección */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                    <label style={{ fontSize: '0.7rem', color: TEXT_MUTED, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Sección
                    </label>
                    <select
                      value={seccionActual ?? ''}
                      disabled={guardandoSeccion}
                      onChange={(e) => cambiarSeccion(p.id, Number(e.target.value))}
                      style={{
                        padding: '0.4rem 0.7rem',
                        borderRadius: '0.5rem',
                        border: seccionActual ? BORDER : `1px solid ${GOLD}`,
                        backgroundColor: seccionActual ? BG_CARD_ALT : GOLD_SUBTLE,
                        color: seccionActual ? TEXT_SECONDARY : GOLD,
                        fontSize: '0.82rem',
                        cursor: guardandoSeccion ? 'wait' : 'pointer',
                        fontWeight: seccionActual ? 400 : 600,
                        outline: 'none',
                        minWidth: '130px',
                      }}
                    >
                      {!seccionActual && <option value="">— Sin sección —</option>}
                      {SECCIONES.map((s) => (
                        <option key={s.numero} value={s.numero}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                    {/* Estado */}
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {(['ACTIVO', 'AGOTADO', 'INACTIVO'] as const).map((e) => (
                        <button
                          key={e}
                          onClick={() => cambiarEstado(p.id, e)}
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '999px',
                            border: `1px solid ${estadoColor(e)}`,
                            backgroundColor: p.estado === e ? `${estadoColor(e)}22` : 'transparent',
                            color: estadoColor(e),
                            fontSize: '0.68rem',
                            fontWeight: p.estado === e ? 700 : 400,
                            cursor: 'pointer',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    {/* Editar / Eliminar */}
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => empezarEdicion(p)}
                        style={{
                          padding: '0.3rem 0.8rem', borderRadius: '0.4rem',
                          border: BORDER, backgroundColor: 'transparent',
                          color: TEXT_SECONDARY, fontSize: '0.8rem', cursor: 'pointer',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(p.id)}
                        style={{
                          padding: '0.3rem 0.8rem', borderRadius: '0.4rem',
                          border: `1px solid ${ERROR}44`, backgroundColor: 'transparent',
                          color: ERROR, fontSize: '0.8rem', cursor: 'pointer',
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modo edición */}
              {enEdicion && (
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Editando: {p.nombre}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.78rem', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nombre</label>
                      <input type="text" value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.78rem', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Precio (MXN)</label>
                      <input type="number" min="0" step="0.01" value={form.precio} onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))} style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.78rem', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Descripción</label>
                    <textarea value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.78rem', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tipo</label>
                      <select value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="">Sin tipo</option>
                        <option value="ITEM">Ítem</option>
                        <option value="TERAPIA">Terapia</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.78rem', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sección</label>
                      <select value={form.seccion} onChange={(e) => setForm((f) => ({ ...f, seccion: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {SECCIONES.map((s) => (
                          <option key={s.numero} value={s.numero}>{s.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.78rem', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>URL de imagen</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {form.imagenUrl && (
                        <img src={form.imagenUrl} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '0.4rem', flexShrink: 0 }} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={`img-edit-${p.id}`}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append('imagen', file);
                          const resp = await fetch(`${API_URL}/upload-imagen`, { method: 'POST', body: fd });
                          if (resp.ok) {
                            const data = await resp.json();
                            setForm((f) => ({ ...f, imagenUrl: data.url }));
                          }
                        }}
                      />
                      <label
                        htmlFor={`img-edit-${p.id}`}
                        style={{
                          padding: '0.45rem 0.85rem', borderRadius: '0.45rem', border: BORDER,
                          color: TEXT_SECONDARY, fontSize: '0.82rem', cursor: 'pointer',
                          backgroundColor: BG_CARD_ALT, flexShrink: 0,
                        }}
                      >
                        📎 Cambiar imagen
                      </label>
                      <input
                        type="text"
                        placeholder="o pega una URL…"
                        value={form.imagenUrl}
                        onChange={(e) => setForm((f) => ({ ...f, imagenUrl: e.target.value }))}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setEditandoId(null)}
                      style={{
                        padding: '0.55rem 1.1rem', borderRadius: '0.6rem',
                        border: BORDER, backgroundColor: 'transparent',
                        color: TEXT_SECONDARY, fontSize: '0.88rem', cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => guardarEdicion(p.id)}
                      style={{
                        padding: '0.55rem 1.4rem', borderRadius: '0.6rem',
                        border: 'none',
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                        color: '#1a1f35', fontSize: '0.88rem', fontWeight: 700,
                        cursor: 'pointer', boxShadow: `0 4px 12px ${GOLD_GLOW}`,
                      }}
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Productos;
