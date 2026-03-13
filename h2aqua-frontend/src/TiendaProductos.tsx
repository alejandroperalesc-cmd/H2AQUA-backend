// TiendaProductos.tsx
import React, { useEffect, useState } from 'react';
import type { ItemCarrito } from './App';
import { API_URL } from './api';
import { SECCIONES } from './secciones';
import { useIsMobile } from './useIsMobile';
import {
  BG_CARD, BG_CARD_ALT, BG_HOVER,
  GOLD, GOLD_LIGHT, GOLD_GLOW,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER, BORDER_SUBTLE,
} from './theme';

interface ProductoTienda {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  categoria: string | null;
  imagenUrl: string | null;
  estado: 'ACTIVO' | 'AGOTADO' | 'INACTIVO';
  seccion: number;
}

interface TiendaProductosProps {
  carrito: ItemCarrito[];
  onAgregarAlCarrito: (item: Omit<ItemCarrito, 'cantidad'>) => void;
}

// ─── Tarjeta de producto ──────────────────────────────────────────────────────

function TarjetaProducto({
  p,
  onAgregarAlCarrito,
}: {
  p: ProductoTienda;
  onAgregarAlCarrito: (item: Omit<ItemCarrito, 'cantidad'>) => void;
}) {
  const agotado = p.estado === 'AGOTADO' || p.stock <= 0;
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();

  return (
    <article
      style={{
        borderRadius: '1.25rem',
        border: hover ? BORDER : BORDER_SUBTLE,
        backgroundColor: hover ? BG_HOVER : BG_CARD,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: hover
          ? `0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px ${GOLD_GLOW}`
          : '0 4px 20px rgba(0,0,0,0.25)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.22s ease',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Imagen */}
      <div
        style={{
          width: '100%',
          height: isMobile ? '150px' : '220px',
          backgroundColor: BG_CARD_ALT,
          flexShrink: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {p.imagenUrl ? (
          <img
            src={p.imagenUrl}
            alt={p.nombre}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.35s ease',
              transform: hover ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: TEXT_MUTED,
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Sin imagen
          </div>
        )}
        {/* Acento dorado inferior al hacer hover */}
        {hover && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${GOLD}, transparent)`,
            }}
          />
        )}
      </div>

      {/* Contenido */}
      <div
        style={{
          padding: isMobile ? '0.85rem 1rem 1rem' : '1.3rem 1.5rem 1.6rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          flexGrow: 1,
        }}
      >
        {/* Título */}
        <h3
          style={{
            fontSize: isMobile ? '0.88rem' : '1.05rem',
            fontWeight: 600,
            margin: 0,
            color: TEXT_PRIMARY,
            lineHeight: 1.3,
          }}
        >
          {p.nombre}
        </h3>

        {/* Descripción — oculta en móvil para ahorrar espacio */}
        {p.descripcion && !isMobile && (
          <p
            style={{
              margin: 0,
              color: TEXT_SECONDARY,
              fontSize: '0.875rem',
              lineHeight: 1.65,
              flexGrow: 1,
            }}
          >
            {p.descripcion}
          </p>
        )}

        {/* Precio */}
        <p style={{ margin: '0.2rem 0 0' }}>
          <span
            style={{
              fontSize: isMobile ? '1.1rem' : '1.4rem',
              fontWeight: 700,
              color: GOLD,
            }}
          >
            ${p.precio.toLocaleString('es-MX')}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 400, color: TEXT_MUTED, marginLeft: '0.25rem' }}>
            MXN
          </span>
        </p>

        {/* Botón */}
        <button
          disabled={agotado}
          onClick={() => onAgregarAlCarrito({ id: p.id, nombre: p.nombre, precio: p.precio, imagenUrl: p.imagenUrl })}
          style={{
            marginTop: '0.4rem',
            width: '100%',
            padding: isMobile ? '0.6rem 0.5rem' : '0.8rem 1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: agotado
              ? 'rgba(255,255,255,0.05)'
              : `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            color: agotado ? TEXT_MUTED : '#ffffff',
            cursor: agotado ? 'not-allowed' : 'pointer',
            fontSize: isMobile ? '0.78rem' : '0.92rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            boxShadow: agotado ? 'none' : `0 4px 16px ${GOLD_GLOW}`,
            transition: 'opacity 0.15s ease',
          }}
        >
          {agotado ? 'No disponible' : '+ Agregar'}
        </button>
      </div>
    </article>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const TiendaProductos: React.FC<TiendaProductosProps> = ({ carrito: _carrito, onAgregarAlCarrito }) => {
  const isMobile = useIsMobile();
  const [productos, setProductos] = useState<ProductoTienda[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const resp = await fetch(`${API_URL}/productos-tienda`);
        if (!resp.ok) throw new Error();
        setProductos(await resp.json());
      } catch {
        setError('No se pudieron cargar los productos de la tienda');
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  if (cargando) {
    return (
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 0 4rem' }}>
        <p style={{ color: TEXT_MUTED }}>Cargando productos…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 0 4rem' }}>
        <p style={{ color: '#f87171' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '1.5rem 0 3rem' : '2.5rem 0 4rem' }}>

      {/* Encabezado — banner gradiente */}
      <header
        style={{
          position: 'relative',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          marginBottom: isMobile ? '1.75rem' : '2.5rem',
          padding: isMobile ? '1.75rem 1.5rem' : '2.25rem 2.5rem',
          background: 'linear-gradient(135deg, #0b4a55 0%, #006d77 40%, #009aaa 75%, #00B7C4 100%)',
        }}
      >
        {/* Burbujas decorativas */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)', pointerEvents: 'none' }} />
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
          H2AQUA
        </p>
        <h1 style={{ margin: '0 0 0.4rem', fontSize: isMobile ? '1.6rem' : '2.1rem', fontWeight: 300, letterSpacing: '0.04em', color: '#ffffff' }}>
          Tienda en línea
        </h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.70)', fontSize: '0.95rem' }}>
          Elige entre terapias y productos para complementar tu experiencia.
        </p>
      </header>

      {/* 4 Secciones */}
      {SECCIONES.map((sec) => {
        const productosSec = productos.filter((p) => p.seccion === sec.numero);

        return (
          <section key={sec.numero} style={{ marginBottom: isMobile ? '2.5rem' : '3.5rem' }}>
            {/* Encabezado de sección */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '3px',
                  height: '22px',
                  borderRadius: '999px',
                  background: `linear-gradient(180deg, ${GOLD}, transparent)`,
                  flexShrink: 0,
                }}
              />
              <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', margin: 0, color: TEXT_PRIMARY, fontWeight: 500 }}>
                {sec.nombre}
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: TEXT_MUTED,
                  backgroundColor: BORDER_SUBTLE,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  border: BORDER_SUBTLE,
                }}
              >
                {productosSec.length} producto{productosSec.length !== 1 ? 's' : ''}
              </span>
            </div>

            {productosSec.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  color: TEXT_MUTED,
                  fontSize: '0.9rem',
                  paddingLeft: '1.25rem',
                  borderLeft: `2px solid ${BORDER_SUBTLE}`,
                }}
              >
                Sin productos en esta sección por el momento.
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: isMobile ? '1rem' : '1.75rem',
                  alignItems: 'start',
                }}
              >
                {productosSec.map((p) => (
                  <TarjetaProducto key={p.id} p={p} onAgregarAlCarrito={onAgregarAlCarrito} />
                ))}
              </div>
            )}
          </section>
        );
      })}

    </div>
  );
};

export default TiendaProductos;
