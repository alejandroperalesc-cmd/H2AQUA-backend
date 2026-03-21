// TiendaProductos.tsx
import React, { useEffect, useState } from 'react';
import type { ItemCarrito } from './App';
import { API_URL } from './api';
import { SECCIONES } from './secciones';
import CarruselDestacados from './CarruselDestacados';
import { useIsMobile } from './useIsMobile';
import {
  BG_CARD, BG_CARD_ALT, BG_HOVER,
  GOLD, GOLD_LIGHT, GOLD_GLOW,
  TEAL, TEAL_LIGHT,
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

const ETIQUETAS = [
  'Hidrógeno Molecular',
  'Experiencia Premium',
  'Facial',
  'Skincare Coreano',
  'K-Beauty',
  'Nutrición',
  'Bienestar',
  'Promociones',
];

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

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginTop: '0.15rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 400, color: TEAL }}>$</span>
          <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: TEAL, letterSpacing: '-0.02em' }}>
            {p.precio.toLocaleString('es-MX')}
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 500, color: TEXT_MUTED, letterSpacing: '0.06em' }}>
            MXN
          </span>
        </div>

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
  const [seccionActiva, setSeccionActiva] = useState<number>(0);
  const [mostrarArriba, setMostrarArriba] = useState(false);

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

  // Detecta sección activa y visibilidad de la píldora via scroll
  useEffect(() => {
    const onScroll = () => {
      setMostrarArriba(window.scrollY > 400);
      // La sección activa es la última cuyo top ya pasó el 30% superior del viewport
      let activa = 0;
      for (const sec of SECCIONES) {
        const el = document.getElementById(`seccion-${sec.numero}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          activa = sec.numero;
        }
      }
      setSeccionActiva(activa);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSeccion = (numero: number) => {
    const el = document.getElementById(`seccion-${numero}`);
    if (!el) return;
    const appHeader = document.querySelector('header');
    const headerH = appHeader ? appHeader.getBoundingClientRect().height : 0;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const irAnterior = () => {
    const idx = SECCIONES.findIndex((s) => s.numero === seccionActiva);
    if (idx > 0) scrollToSeccion(SECCIONES[idx - 1].numero);
    else scrollToSeccion(SECCIONES[0].numero);
  };

  const irSiguiente = () => {
    const idx = SECCIONES.findIndex((s) => s.numero === seccionActiva);
    // si aún no hay sección activa, ir a la primera; si es la última, no hacer nada
    if (idx === -1) scrollToSeccion(SECCIONES[0].numero);
    else if (idx < SECCIONES.length - 1) scrollToSeccion(SECCIONES[idx + 1].numero);
  };

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

  const activaIdx = SECCIONES.findIndex((s) => s.numero === seccionActiva);

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '1.5rem 0 3rem' : '2.5rem 0 4rem' }}>

      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'relative',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          marginBottom: isMobile ? '1.75rem' : '2.75rem',
          padding: isMobile ? '2.25rem 1.5rem 2rem 2rem' : '3rem 3.5rem 2.75rem 4rem',
          background: `linear-gradient(135deg, #e4f5f7 0%, #ceedf1 45%, #d6f0eb 100%)`,
          border: `1px solid rgba(0,183,196,0.18)`,
          boxShadow: `0 4px 32px rgba(0,183,196,0.10)`,
        }}
      >
        {/* Imagen de fondo muy suave */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/hero-hidrogeno.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(20px)', transform: 'scale(1.15)', opacity: 0.08, pointerEvents: 'none' }} />
        {/* Orbe teal derecha */}
        <div style={{ position: 'absolute', top: '-60px', right: isMobile ? '-40px' : '0px', width: isMobile ? '220px' : '340px', height: isMobile ? '220px' : '340px', borderRadius: '50%', background: `radial-gradient(circle, rgba(0,183,196,0.18) 0%, transparent 65%)`, pointerEvents: 'none' }} />
        {/* Orbe sage-teal abajo izquierda */}
        <div style={{ position: 'absolute', bottom: '-50px', left: isMobile ? '-30px' : '10%', width: '240px', height: '240px', borderRadius: '50%', background: `radial-gradient(circle, rgba(131,197,190,0.22) 0%, transparent 65%)`, pointerEvents: 'none' }} />
        {/* Línea izquierda */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: `linear-gradient(180deg, ${TEAL}, ${GOLD}, ${TEAL_LIGHT})`, pointerEvents: 'none' }} />
        {/* Watermark */}
        <div style={{ position: 'absolute', right: isMobile ? '-8px' : '2rem', bottom: isMobile ? '-10px' : '-16px', fontSize: isMobile ? '5rem' : '8rem', fontWeight: 900, letterSpacing: '-0.04em', color: `rgba(0,109,119,0.06)`, userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }}>H2AQUA</div>

        <div style={{ position: 'relative' }}>
          {/* Pill marca */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: isMobile ? '0.9rem' : '1.1rem', padding: '0.28rem 0.85rem 0.28rem 0.55rem', borderRadius: '999px', border: `1px solid rgba(0,109,119,0.25)`, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`, boxShadow: `0 0 6px ${GOLD_GLOW}` }} />
            <span style={{ fontSize: isMobile ? '0.68rem' : '0.73rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: TEAL }}>H2AQUA</span>
          </div>

          {/* Título */}
          <h1 style={{ margin: '0 0 0.75rem', fontSize: isMobile ? '2rem' : '3.2rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, color: TEXT_PRIMARY }}>
            Tienda{' '}
            <span style={{ background: `linear-gradient(125deg, ${TEAL} 0%, ${GOLD} 70%, ${GOLD_LIGHT} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              en línea
            </span>
          </h1>

          {/* Separador */}
          <div style={{ width: isMobile ? '36px' : '48px', height: '3px', borderRadius: '999px', background: `linear-gradient(90deg, ${TEAL}, ${GOLD})`, marginBottom: '0.75rem' }} />

          {/* Subtítulo */}
          <p style={{ margin: '0 0 1.5rem', color: TEXT_SECONDARY, fontSize: isMobile ? '0.88rem' : '1rem', lineHeight: 1.65, maxWidth: '440px' }}>
            Terapias y productos de hidrógeno molecular para elevar tu bienestar.
          </p>

          {/* Tags de secciones */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {SECCIONES.map((sec, i) => (
              <button
                key={sec.numero}
                onClick={() => scrollToSeccion(sec.numero)}
                style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.03em', color: TEAL, border: `1px solid rgba(0,109,119,0.22)`, borderRadius: '999px', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.55)', cursor: 'pointer', transition: 'all 0.15s', backdropFilter: 'blur(4px)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = TEAL; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; e.currentTarget.style.color = TEAL; e.currentTarget.style.borderColor = 'rgba(0,109,119,0.22)'; }}
              >
                {ETIQUETAS[i] ?? sec.nombre}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Carrusel de destacados ───────────────────────────────────────────── */}
      <CarruselDestacados onAgregarAlCarrito={onAgregarAlCarrito} />

      {/* ── Secciones ───────────────────────────────────────────────────────── */}
      {SECCIONES.map((sec) => {
        const productosSec = productos.filter((p) => p.seccion === sec.numero);

        return (
          <section
            key={sec.numero}
            id={`seccion-${sec.numero}`}
            style={{ marginBottom: isMobile ? '2.5rem' : '3.5rem' }}
          >
            {/* Encabezado de sección */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem', marginBottom: isMobile ? '1.1rem' : '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: isMobile ? '2rem' : '2.25rem', height: isMobile ? '2rem' : '2.25rem', borderRadius: '50%', background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`, color: '#fff', fontSize: isMobile ? '0.75rem' : '0.82rem', fontWeight: 700, flexShrink: 0, boxShadow: '0 2px 10px rgba(0,183,196,0.35)', userSelect: 'none' }}>
                {String(sec.numero).padStart(2, '0')}
              </span>
              <h2 style={{ margin: 0, fontSize: isMobile ? '1.05rem' : '1.3rem', fontWeight: 700, letterSpacing: '0.01em', lineHeight: 1.2, background: `linear-gradient(135deg, ${TEAL} 20%, ${GOLD} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {sec.nombre}
              </h2>
              {productosSec.length > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: TEAL, border: '1px solid rgba(0,183,196,0.3)', borderRadius: '999px', padding: '0.2rem 0.65rem', whiteSpace: 'nowrap' }}>
                  {productosSec.length} {productosSec.length !== 1 ? 'productos' : 'producto'}
                </span>
              )}
            </div>

            <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(0,183,196,0.35), rgba(212,175,55,0.2), transparent)', marginBottom: isMobile ? '1.1rem' : '1.4rem' }} />

            {productosSec.length === 0 ? (
              <p style={{ margin: 0, color: TEXT_MUTED, fontSize: '0.9rem', paddingLeft: '1.25rem', borderLeft: `2px solid ${BORDER_SUBTLE}` }}>
                Sin productos en esta sección por el momento.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '0.75rem' : '1.25rem', alignItems: 'stretch' }}>
                {productosSec.map((p) => (
                  <TarjetaProducto key={p.id} p={p} onAgregarAlCarrito={onAgregarAlCarrito} />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {/* ── Navegador flotante ───────────────────────────────────────────────── */}
      {mostrarArriba && (
        <div style={{
          position: 'fixed',
          bottom: isMobile ? '5rem' : '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          background: 'rgba(8,28,30,0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,183,196,0.25)',
          borderRadius: '999px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          overflow: 'hidden',
        }}>

          {/* Botón arriba */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Volver al inicio"
            style={{
              padding: isMobile ? '0.55rem 0.75rem' : '0.6rem 0.9rem',
              background: 'transparent',
              border: 'none',
              borderRight: '1px solid rgba(0,183,196,0.15)',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            ↑
          </button>

          {/* Botón anterior */}
          <button
            onClick={irAnterior}
            title="Sección anterior"
            disabled={activaIdx === 0}
            style={{
              padding: isMobile ? '0.55rem 0.75rem' : '0.6rem 0.9rem',
              background: 'transparent',
              border: 'none',
              color: activaIdx === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.65)',
              cursor: activaIdx === 0 ? 'default' : 'pointer',
              fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { if (activaIdx !== 0) e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = activaIdx === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.65)'; }}
          >
            ‹
          </button>

          {/* Nombre de la sección activa */}
          <div style={{
            padding: isMobile ? '0.55rem 0.9rem' : '0.6rem 1.1rem',
            borderLeft: '1px solid rgba(0,183,196,0.15)',
            borderRight: '1px solid rgba(0,183,196,0.15)',
            minWidth: isMobile ? '120px' : '160px',
            textAlign: 'center',
          }}>
            {seccionActiva > 0 ? (
              <>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.1rem' }}>
                  {String(seccionActiva).padStart(2, '0')} / {String(SECCIONES.length).padStart(2, '0')}
                </div>
                <div style={{ fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 600, color: TEAL, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                  {ETIQUETAS[(seccionActiva - 1)] ?? `Sección ${seccionActiva}`}
                </div>
              </>
            ) : (
              <div style={{ fontSize: isMobile ? '0.72rem' : '0.78rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>
                Tienda
              </div>
            )}
          </div>

          {/* Botón siguiente */}
          <button
            onClick={irSiguiente}
            title="Sección siguiente"
            disabled={activaIdx === SECCIONES.length - 1}
            style={{
              padding: isMobile ? '0.55rem 0.75rem' : '0.6rem 0.9rem',
              background: 'transparent',
              border: 'none',
              color: activaIdx === SECCIONES.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.65)',
              cursor: activaIdx === SECCIONES.length - 1 ? 'default' : 'pointer',
              fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { if (activaIdx !== SECCIONES.length - 1) e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = activaIdx === SECCIONES.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.65)'; }}
          >
            ›
          </button>

        </div>
      )}

    </div>
  );
};

export default TiendaProductos;
