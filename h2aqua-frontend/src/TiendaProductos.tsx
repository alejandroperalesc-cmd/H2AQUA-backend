// TiendaProductos.tsx
import React, { useEffect, useState } from 'react';
import type { ItemCarrito } from './App';
import { API_URL } from './api';
import { SECCIONES } from './secciones';
import CarruselDestacados from './CarruselDestacados';
import { useIsMobile } from './useIsMobile';
import {
  BG_CARD, BG_CARD_ALT, BG_HOVER,
  GOLD, GOLD_GLOW,
  TEAL,
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
          height: isMobile ? '130px' : '170px',
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
          padding: isMobile ? '0.9rem 1rem 1.1rem' : '1.35rem 1.5rem 1.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          flexGrow: 1,
        }}
      >
        {/* Título */}
        <h3
          style={{
            fontSize: isMobile ? '0.9rem' : '1.08rem',
            fontWeight: 500,
            margin: 0,
            color: TEXT_PRIMARY,
            lineHeight: 1.35,
            letterSpacing: '0.01em',
          }}
        >
          {p.nombre}
        </h3>

        {/* Descripción — oculta en móvil */}
        {p.descripcion && !isMobile && (
          <p
            style={{
              margin: 0,
              color: TEXT_SECONDARY,
              fontSize: '0.85rem',
              lineHeight: 1.6,
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {p.descripcion}
          </p>
        )}

        {/* Precio */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginTop: '0.15rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 400, color: TEAL }}>$</span>
          <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: TEAL, letterSpacing: '-0.02em' }}>
            {p.precio.toLocaleString('es-MX')}
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 500, color: TEXT_MUTED, letterSpacing: '0.06em' }}>
            MXN
          </span>
        </div>

        {/* Botón */}
        <button
          disabled={agotado}
          onClick={() => onAgregarAlCarrito({ id: p.id, nombre: p.nombre, precio: p.precio, imagenUrl: p.imagenUrl })}
          style={{
            marginTop: '0.35rem',
            width: '100%',
            padding: isMobile ? '0.65rem 0.5rem' : '0.82rem 1rem',
            borderRadius: '999px',
            border: agotado ? `1px solid ${BORDER_SUBTLE}` : 'none',
            background: agotado
              ? 'transparent'
              : `linear-gradient(135deg, ${TEAL}, ${GOLD})`,
            color: agotado ? TEXT_MUTED : '#ffffff',
            cursor: agotado ? 'not-allowed' : 'pointer',
            fontSize: isMobile ? '0.78rem' : '0.88rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            boxShadow: agotado ? 'none' : `0 4px 18px ${GOLD_GLOW}`,
            transition: 'opacity 0.15s ease',
          }}
        >
          {agotado ? 'No disponible' : isMobile ? '+ Agregar' : '+ Agregar al carrito'}
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

      {/* Encabezado — banner imagen difuminada */}
      <header
        style={{
          position: 'relative',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          marginBottom: isMobile ? '1.75rem' : '2.5rem',
          padding: isMobile ? '2rem 1.5rem 2rem 2rem' : '2.75rem 3rem 2.75rem 3.5rem',
          backgroundColor: '#eaf6f7',
        }}
      >
        {/* Imagen difuminada */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/hero-hidrogeno.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(14px)', transform: 'scale(1.12)', opacity: 0.13, pointerEvents: 'none' }} />
        {/* Wash teal tenue */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,109,119,0.10) 0%, rgba(0,183,196,0.07) 100%)', pointerEvents: 'none' }} />
        {/* Línea izquierda */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: `linear-gradient(180deg, ${TEAL}, ${GOLD})`, pointerEvents: 'none' }} />
        {/* Círculo decorativo */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,183,196,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          {/* Marca */}
          <p style={{
            margin: '0 0 0.6rem',
            fontSize: isMobile ? '1rem' : '1.25rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: TEAL,
            fontWeight: 700,
          }}>
            H2AQUA
          </p>
          {/* Título principal */}
          <h1 style={{
            margin: '0 0 0.6rem',
            fontSize: isMobile ? '2rem' : '2.85rem',
            fontWeight: 200,
            letterSpacing: '0.04em',
            color: TEXT_PRIMARY,
            lineHeight: 1.1,
          }}>
            Tienda{' '}
            <span style={{
              fontWeight: 600,
              background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              en línea
            </span>
          </h1>
          {/* Separador */}
          <div style={{
            width: isMobile ? '40px' : '52px',
            height: '2px',
            background: `linear-gradient(90deg, ${TEAL}, ${GOLD})`,
            marginBottom: '0.75rem',
            borderRadius: '999px',
          }} />
          {/* Subtítulo */}
          <p style={{
            margin: 0,
            color: TEXT_SECONDARY,
            fontSize: isMobile ? '0.88rem' : '1rem',
            lineHeight: 1.6,
            maxWidth: '480px',
          }}>
            Terapias y productos de hidrógeno molecular para elevar tu bienestar.
          </p>
        </div>
      </header>

      {/* Carrusel de destacados */}
      <CarruselDestacados onAgregarAlCarrito={onAgregarAlCarrito} />

      {/* 4 Secciones */}
      {SECCIONES.map((sec) => {
        const productosSec = productos.filter((p) => p.seccion === sec.numero);

        return (
          <section key={sec.numero} style={{ marginBottom: isMobile ? '2.5rem' : '3.5rem' }}>
            {/* Encabezado de sección — fondo imagen difuminada tenue */}
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '0.9rem',
                marginBottom: '1.25rem',
                padding: isMobile ? '0.85rem 1rem 0.85rem 1.25rem' : '1rem 1.5rem 1rem 1.5rem',
                backgroundColor: '#edf7f8',
              }}
            >
              {/* Imagen difuminada */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url("/hero-hidrogeno.jpg")',
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'blur(16px)', transform: 'scale(1.15)',
                opacity: 0.10, pointerEvents: 'none',
              }} />
              {/* Wash teal */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(0,109,119,0.08) 0%, rgba(0,183,196,0.05) 100%)',
                pointerEvents: 'none',
              }} />
              {/* Línea izquierda */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                background: `linear-gradient(180deg, ${TEAL}, ${GOLD})`,
                pointerEvents: 'none',
              }} />

              {/* Contenido */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                {/* Número decorativo */}
                <span style={{
                  fontSize: isMobile ? '1.6rem' : '2rem',
                  fontWeight: 700,
                  color: 'rgba(0,183,196,0.12)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  userSelect: 'none',
                }}>
                  0{sec.numero}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <h2 style={{
                    fontSize: isMobile ? '1rem' : '1.15rem',
                    margin: 0,
                    color: TEXT_PRIMARY,
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                  }}>
                    {sec.nombre}
                  </h2>
                  <span style={{
                    fontSize: '0.7rem',
                    color: TEXT_MUTED,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}>
                    {productosSec.length} {productosSec.length !== 1 ? 'productos' : 'producto'} disponible{productosSec.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
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
                  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                  gap: isMobile ? '0.75rem' : '1.25rem',
                  alignItems: 'stretch',
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
