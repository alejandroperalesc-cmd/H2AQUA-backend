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

      {/* Encabezado — hero banner */}
      <header
        style={{
          position: 'relative',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          marginBottom: isMobile ? '1.75rem' : '2.75rem',
          padding: isMobile ? '2.5rem 1.5rem 2.25rem 2rem' : '3.5rem 3.5rem 3.25rem 4rem',
          background: 'linear-gradient(135deg, #0d3338 0%, #145a60 55%, #0f3a28 100%)',
        }}
      >
        {/* Imagen de fondo difuminada */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("/hero-hidrogeno.jpg")',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(18px)', transform: 'scale(1.15)',
          opacity: 0.32, pointerEvents: 'none',
          mixBlendMode: 'luminosity',
        }} />
        {/* Overlay degradado diagonal */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(120deg, rgba(0,140,150,0.45) 0%, rgba(13,58,64,0.65) 60%, rgba(15,58,40,0.72) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Orbe teal grande */}
        <div style={{
          position: 'absolute', top: '-80px', right: isMobile ? '-60px' : '-20px',
          width: isMobile ? '260px' : '380px', height: isMobile ? '260px' : '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,183,196,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* Orbe dorado pequeño */}
        <div style={{
          position: 'absolute', bottom: '-40px', right: isMobile ? '30%' : '20%',
          width: '180px', height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* Watermark H2AQUA */}
        <div style={{
          position: 'absolute', right: isMobile ? '-10px' : '2rem',
          bottom: isMobile ? '-14px' : '-20px',
          fontSize: isMobile ? '5.5rem' : '8.5rem',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.04)',
          userSelect: 'none', pointerEvents: 'none',
          lineHeight: 1,
        }}>
          H2AQUA
        </div>
        {/* Línea izquierda */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
          background: `linear-gradient(180deg, ${TEAL}, ${GOLD}, transparent)`,
          pointerEvents: 'none',
        }} />
        {/* Línea superior sutil */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, transparent, rgba(0,183,196,0.4), transparent)`,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          {/* Pill marca */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            marginBottom: isMobile ? '1rem' : '1.25rem',
            padding: '0.3rem 0.9rem 0.3rem 0.6rem',
            borderRadius: '999px',
            border: `1px solid rgba(0,183,196,0.35)`,
            background: 'rgba(0,183,196,0.1)',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: TEAL,
              boxShadow: `0 0 6px ${TEAL}`,
            }} />
            <span style={{
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: TEAL,
            }}>
              H2AQUA
            </span>
          </div>

          {/* Título principal */}
          <h1 style={{
            margin: '0 0 0.9rem',
            fontSize: isMobile ? '2.2rem' : '3.4rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: '#fff',
          }}>
            Tienda{' '}
            <span style={{
              background: `linear-gradient(125deg, ${TEAL} 10%, ${GOLD} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              en línea
            </span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            margin: '0 0 1.5rem',
            color: 'rgba(255,255,255,0.62)',
            fontSize: isMobile ? '0.9rem' : '1.05rem',
            lineHeight: 1.65,
            maxWidth: '460px',
          }}>
            Terapias y productos de hidrógeno molecular para elevar tu bienestar.
          </p>

          {/* Tags de secciones — navegación por ancla */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SECCIONES.map((sec, i) => {
              const etiquetas = [
                'Hidrógeno Molecular',
                'Experiencia Premium',
                'Facial',
                'Skincare Coreano',
                'K-Beauty',
                'Nutrición',
                'Bienestar',
                'Promociones',
              ];
              return (
              <button
                key={sec.numero}
                onClick={() => document.getElementById(`seccion-${sec.numero}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '999px',
                  padding: '0.22rem 0.7rem',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(0,183,196,0.5)`;
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,183,196,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {etiquetas[i] ?? sec.nombre}
              </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Carrusel de destacados */}
      <CarruselDestacados onAgregarAlCarrito={onAgregarAlCarrito} />

      {/* 4 Secciones */}
      {SECCIONES.map((sec) => {
        const productosSec = productos.filter((p) => p.seccion === sec.numero);

        return (
          <section key={sec.numero} id={`seccion-${sec.numero}`} style={{ marginBottom: isMobile ? '2.5rem' : '3.5rem' }}>
            {/* Encabezado de sección */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '0.75rem' : '1rem',
                marginBottom: isMobile ? '1.1rem' : '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Badge número */}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: isMobile ? '2rem' : '2.25rem',
                height: isMobile ? '2rem' : '2.25rem',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`,
                color: '#fff',
                fontSize: isMobile ? '0.75rem' : '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                flexShrink: 0,
                boxShadow: `0 2px 10px rgba(0,183,196,0.35)`,
                userSelect: 'none',
              }}>
                {String(sec.numero).padStart(2, '0')}
              </span>

              {/* Título */}
              <h2 style={{
                margin: 0,
                fontSize: isMobile ? '1.05rem' : '1.3rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                lineHeight: 1.2,
                background: `linear-gradient(135deg, ${TEAL} 20%, ${GOLD} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {sec.nombre}
              </h2>

              {/* Chip contador */}
              {productosSec.length > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: TEAL,
                  border: `1px solid rgba(0,183,196,0.3)`,
                  borderRadius: '999px',
                  padding: '0.2rem 0.65rem',
                  whiteSpace: 'nowrap',
                }}>
                  {productosSec.length} {productosSec.length !== 1 ? 'productos' : 'producto'}
                </span>
              )}
            </div>

            {/* Línea separadora */}
            <div style={{
              height: '1px',
              background: `linear-gradient(90deg, rgba(0,183,196,0.35), rgba(212,175,55,0.2), transparent)`,
              marginBottom: isMobile ? '1.1rem' : '1.4rem',
            }} />

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
