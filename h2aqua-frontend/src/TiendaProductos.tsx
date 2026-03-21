// TiendaProductos.tsx
import React, { useEffect, useState } from 'react';
import type { ItemCarrito } from './App';
import { API_URL } from './api';
import { SECCIONES } from './secciones';
import CarruselDestacados from './CarruselDestacados';
import { useIsMobile } from './useIsMobile';
import {
  BG_CARD, BG_CARD_ALT, BG_HOVER,
  GOLD, GOLD_LIGHT,
  PANTONE, PANTONE_GREEN, PANTONE_GLOW,
  TEAL, TEAL_DEEP,
  GRAD_MAIN,
  TEXT_PRIMARY, TEXT_MUTED,
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

// Alias locales del espectro unificado
const P       = PANTONE;        // #00A9C0
const P_GREEN = PANTONE_GREEN;  // #00968a
const P_DARK  = TEAL;           // #006d77  — ancla compartida con home
const P_DEEP  = TEAL_DEEP;      // #0b4a55  — ocean profundo (home hero)
const P_LIGHT = GOLD_LIGHT;     // #33c9d4  — tiffany claro (home)
const P_GLOW  = PANTONE_GLOW;

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
          ? `0 20px 44px rgba(0,0,0,0.14), 0 0 0 1.5px ${P}`
          : `0 2px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,169,192,0.12)`,
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
        {/* Acento inferior */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
          background: `linear-gradient(90deg, ${P_DARK}, ${P_GREEN}, ${P}, ${GOLD}, transparent)`,
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.22s ease',
        }} />

        {/* Overlay descripción — se desliza desde abajo al hacer hover */}
        {p.descripcion && !isMobile && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(155deg, rgba(11,74,85,0.97) 0%, rgba(0,109,119,0.95) 50%, rgba(0,150,138,0.93) 100%)`,
            backdropFilter: 'blur(6px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '1rem 1.15rem',
            transform: hover ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: hover ? 'auto' : 'none',
          }}>
            {/* Etiqueta */}
            <span style={{
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: P_LIGHT,
              marginBottom: '0.45rem', display: 'block',
            }}>
              Descripción
            </span>
            {/* Línea decorativa */}
            <div style={{
              width: '24px', height: '2px', borderRadius: '999px',
              background: `linear-gradient(90deg, ${P}, ${GOLD})`,
              marginBottom: '0.6rem',
            }} />
            <p style={{
              margin: 0, color: 'rgba(255,255,255,0.88)',
              fontSize: '0.8rem', lineHeight: 1.65,
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {p.descripcion}
            </p>
          </div>
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

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginTop: '0.15rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 400, color: P_GREEN }}>$</span>
          <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, color: P_DARK, letterSpacing: '-0.02em' }}>
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
              : GRAD_MAIN,
            color: agotado ? TEXT_MUTED : '#ffffff',
            cursor: agotado ? 'not-allowed' : 'pointer',
            fontSize: isMobile ? '0.78rem' : '0.88rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            boxShadow: agotado ? 'none' : `0 4px 20px rgba(0,109,119,0.35)`,
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
          borderRadius: '1.75rem',
          overflow: 'hidden',
          marginBottom: isMobile ? '1.75rem' : '2.75rem',
          padding: isMobile ? '2.5rem 1.75rem 2.25rem 2.25rem' : '3.5rem 4rem 3rem 4.5rem',
          background: `linear-gradient(140deg, ${P_DEEP} 0%, ${P_DARK} 30%, ${P_GREEN} 58%, ${P} 80%, ${GOLD} 100%)`,
          boxShadow: `0 8px 48px rgba(0,109,119,0.35), 0 2px 0 rgba(255,255,255,0.08) inset`,
        }}
      >
        {/* Imagen de fondo difuminada */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/hero-hidrogeno.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(32px)', transform: 'scale(1.2)', opacity: 0.18, pointerEvents: 'none', mixBlendMode: 'soft-light' }} />
        {/* Overlay ocean profundo izquierda */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, rgba(11,74,85,0.55) 0%, rgba(0,109,119,0.25) 45%, transparent 75%)`, pointerEvents: 'none' }} />
        {/* Orbe brillante superior derecha */}
        <div style={{ position: 'absolute', top: '-80px', right: isMobile ? '-50px' : '-10px', width: isMobile ? '260px' : '400px', height: isMobile ? '260px' : '400px', borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 60%)`, pointerEvents: 'none' }} />
        {/* Orbe inferior izquierda */}
        <div style={{ position: 'absolute', bottom: '-60px', left: '-20px', width: '280px', height: '280px', borderRadius: '50%', background: `radial-gradient(circle, rgba(0,111,130,0.35) 0%, transparent 65%)`, pointerEvents: 'none' }} />
        {/* Línea izquierda blanca */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: `linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.3), transparent)`, pointerEvents: 'none' }} />
        {/* Línea superior */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)`, pointerEvents: 'none' }} />
        {/* Watermark */}
        <div style={{ position: 'absolute', right: isMobile ? '-6px' : '2.5rem', bottom: isMobile ? '-12px' : '-18px', fontSize: isMobile ? '5.5rem' : '8.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.07)', userSelect: 'none', pointerEvents: 'none', lineHeight: 1 }}>H2AQUA</div>

        <div style={{ position: 'relative' }}>
          {/* Título */}
          <h1 style={{ margin: '0 0 0.8rem', fontSize: isMobile ? '2.2rem' : '3.4rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, color: '#fff' }}>
            Tienda{' '}
            <span style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 300 }}>en línea</span>
          </h1>

          {/* Separador */}
          <div style={{ width: isMobile ? '40px' : '52px', height: '3px', borderRadius: '999px', background: 'rgba(255,255,255,0.5)', marginBottom: '0.8rem' }} />

          {/* Subtítulo */}
          <div style={{ margin: '0 0 1.75rem', maxWidth: isMobile ? '100%' : '580px' }}>
            <p style={{ margin: '0 0 0.6rem', color: 'rgba(255,255,255,0.9)', fontSize: isMobile ? '0.95rem' : '1.08rem', lineHeight: 1.6, fontWeight: 400 }}>
              H2AQUA tiene todo lo que necesitas para cuidarte de verdad.
            </p>
            <p style={{ margin: '0 0 0.6rem', color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '0.86rem' : '0.97rem', lineHeight: 1.65 }}>
              Terapias que renuevan el cuerpo a nivel celular y los rituales de belleza más efectivos del mundo, reunidos en un solo lugar.
            </p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: isMobile ? '0.82rem' : '0.9rem', lineHeight: 1.6, fontStyle: 'italic', borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '0.85rem' }}>
              Porque el bienestar completo va más allá de lo que se ve — empieza desde adentro.
            </p>
          </div>

          {/* Tags de secciones */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SECCIONES.map((sec, i) => (
              <button
                key={sec.numero}
                onClick={() => scrollToSeccion(sec.numero)}
                style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.03em', color: 'rgba(255,255,255,0.85)', border: `1px solid rgba(255,255,255,0.28)`, borderRadius: '999px', padding: '0.28rem 0.8rem', background: 'rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'all 0.15s', backdropFilter: 'blur(4px)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem', marginBottom: isMobile ? '1.1rem' : '1.4rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: isMobile ? '2rem' : '2.25rem', height: isMobile ? '2rem' : '2.25rem', borderRadius: '50%', background: GRAD_MAIN, color: '#fff', fontSize: isMobile ? '0.75rem' : '0.82rem', fontWeight: 700, flexShrink: 0, boxShadow: `0 3px 14px ${P_GLOW}`, userSelect: 'none' }}>
                {String(sec.numero).padStart(2, '0')}
              </span>
              <h2 style={{ margin: 0, fontSize: isMobile ? '1.05rem' : '1.3rem', fontWeight: 700, letterSpacing: '0.01em', lineHeight: 1.2, background: `linear-gradient(120deg, ${P_DARK} 0%, ${P_GREEN} 55%, ${P} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {sec.nombre}
              </h2>
              {productosSec.length > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: P_DARK, border: `1px solid rgba(0,109,119,0.25)`, borderRadius: '999px', padding: '0.2rem 0.65rem', whiteSpace: 'nowrap', background: 'rgba(0,109,119,0.06)' }}>
                  {productosSec.length} {productosSec.length !== 1 ? 'productos' : 'producto'}
                </span>
              )}
            </div>

            <div style={{ height: '1px', background: `linear-gradient(90deg, ${P_DARK}, ${P_GREEN}, ${P}, rgba(0,183,196,0.08), transparent)`, marginBottom: isMobile ? '1.1rem' : '1.4rem' }} />

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
          background: `rgba(11,74,85,0.95)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(0,169,192,0.3)`,
          borderRadius: '999px',
          boxShadow: `0 8px 36px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,109,119,0.4)`,
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
            borderLeft: '1px solid rgba(0,150,138,0.25)',
            borderRight: '1px solid rgba(0,150,138,0.25)',
            minWidth: isMobile ? '120px' : '160px',
            textAlign: 'center',
          }}>
            {seccionActiva > 0 ? (
              <>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.1rem' }}>
                  {String(seccionActiva).padStart(2, '0')} / {String(SECCIONES.length).padStart(2, '0')}
                </div>
                <div style={{ fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 600, color: P_LIGHT, whiteSpace: 'nowrap', letterSpacing: '0.02em', textShadow: `0 0 12px rgba(46,207,196,0.5)` }}>
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
