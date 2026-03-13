import { useState, useEffect, useRef, useCallback } from 'react';
import type { ItemCarrito } from './App';
import { API_URL } from './api';
import { useIsMobile } from './useIsMobile';
import {
  BG_CARD_ALT,
  GOLD, GOLD_GLOW,
  TEAL,
  TEXT_MUTED,
} from './theme';

interface ProductoDestacado {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagenUrl: string | null;
  estado: 'ACTIVO' | 'AGOTADO' | 'INACTIVO';
}

interface Props {
  onAgregarAlCarrito: (item: Omit<ItemCarrito, 'cantidad'>) => void;
}

export default function CarruselDestacados({ onAgregarAlCarrito }: Props) {
  const isMobile = useIsMobile();
  const [productos, setProductos] = useState<ProductoDestacado[]>([]);
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`${API_URL}/productos-destacados`);
        if (resp.ok) setProductos(await resp.json());
      } catch { /* silencioso */ }
    })();
  }, []);

  const siguiente = useCallback(() => {
    setIndice((i) => (i + 1) % productos.length);
  }, [productos.length]);

  const anterior = useCallback(() => {
    setIndice((i) => (i - 1 + productos.length) % productos.length);
  }, [productos.length]);

  useEffect(() => {
    if (pausado || productos.length <= 1) return;
    const t = setInterval(siguiente, 3000);
    return () => clearInterval(t);
  }, [pausado, siguiente, productos.length]);

  if (productos.length === 0) return null;

  return (
    <section style={{ marginBottom: isMobile ? '2rem' : '3rem' }}>

      {/* Etiqueta de sección */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
          ★ Productos destacados
        </span>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, rgba(0,183,196,0.20), transparent)` }} />
      </div>

      {/* Contenedor del carrusel */}
      <div
        style={{
          position: 'relative',
          borderRadius: '1.25rem',
          overflow: 'hidden',
          height: isMobile ? '300px' : '400px',
          backgroundColor: BG_CARD_ALT,
          cursor: 'grab',
          userSelect: 'none',
          boxShadow: `0 8px 40px rgba(0,183,196,0.12), 0 2px 8px rgba(0,0,0,0.06)`,
        }}
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (delta < -50) siguiente();
          else if (delta > 50) anterior();
        }}
      >
        {/* Slides — fade transition */}
        {productos.map((prod, i) => {
          const isActive = i === indice;
          const isAgotado = prod.estado === 'AGOTADO';
          return (
            <div
              key={prod.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.6s ease',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {/* Imagen de fondo */}
              {prod.imagenUrl ? (
                <img
                  src={prod.imagenUrl}
                  alt={prod.nombre}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #0b4a55, #006d77, ${GOLD})` }} />
              )}

              {/* Overlay degradado */}
              <div style={{
                position: 'absolute', inset: 0,
                background: isMobile
                  ? 'linear-gradient(0deg, rgba(8,35,45,0.92) 0%, rgba(8,35,45,0.55) 50%, transparent 100%)'
                  : 'linear-gradient(90deg, rgba(8,35,45,0.88) 0%, rgba(8,35,45,0.55) 45%, rgba(8,35,45,0.10) 100%)',
              }} />

              {/* Contenido */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                justifyContent: isMobile ? 'flex-end' : 'center',
                padding: isMobile ? '1.5rem 1.5rem 1.75rem' : '2.5rem 3rem',
                maxWidth: isMobile ? '100%' : '56%',
              }}>
                <p style={{ margin: '0 0 0.4rem', fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
                  Destacado
                </p>
                <h3 style={{
                  margin: '0 0 0.5rem',
                  fontSize: isMobile ? '1.35rem' : '1.9rem',
                  fontWeight: 400,
                  color: '#ffffff',
                  lineHeight: 1.2,
                }}>
                  {prod.nombre}
                </h3>
                {prod.descripcion && !isMobile && (
                  <p style={{
                    margin: '0 0 0.85rem',
                    fontSize: '0.9rem',
                    color: 'rgba(255,255,255,0.72)',
                    lineHeight: 1.65,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {prod.descripcion}
                  </p>
                )}
                <p style={{ margin: '0 0 1.1rem', fontSize: isMobile ? '1.3rem' : '1.65rem', fontWeight: 700, color: '#ffffff' }}>
                  ${prod.precio.toLocaleString('es-MX')}
                  <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'rgba(255,255,255,0.60)', marginLeft: '0.35rem' }}>MXN</span>
                </p>
                <button
                  disabled={isAgotado}
                  onClick={() => !isAgotado && onAgregarAlCarrito({ id: prod.id, nombre: prod.nombre, precio: prod.precio, imagenUrl: prod.imagenUrl })}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.72rem 1.6rem',
                    borderRadius: '999px',
                    border: 'none',
                    background: isAgotado ? 'rgba(255,255,255,0.18)' : `linear-gradient(135deg, ${TEAL}, ${GOLD})`,
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: isAgotado ? 'not-allowed' : 'pointer',
                    boxShadow: isAgotado ? 'none' : `0 4px 18px ${GOLD_GLOW}`,
                    letterSpacing: '0.02em',
                  }}
                >
                  {isAgotado ? 'No disponible' : '+ Agregar al carrito'}
                </button>
              </div>
            </div>
          );
        })}

        {/* Flechas de navegación */}
        {productos.length > 1 && (
          <>
            <button
              onClick={anterior}
              style={{
                position: 'absolute', left: '0.85rem', top: '50%',
                transform: 'translateY(-50%)', zIndex: 10,
                width: isMobile ? '34px' : '42px', height: isMobile ? '34px' : '42px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.22)',
                backgroundColor: 'rgba(0,0,0,0.28)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff', fontSize: isMobile ? '1.2rem' : '1.4rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ‹
            </button>
            <button
              onClick={siguiente}
              style={{
                position: 'absolute', right: '0.85rem', top: '50%',
                transform: 'translateY(-50%)', zIndex: 10,
                width: isMobile ? '34px' : '42px', height: isMobile ? '34px' : '42px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.22)',
                backgroundColor: 'rgba(0,0,0,0.28)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff', fontSize: isMobile ? '1.2rem' : '1.4rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ›
            </button>
          </>
        )}

        {/* Contador top-right */}
        {productos.length > 1 && (
          <div style={{
            position: 'absolute', top: '0.85rem', right: '0.85rem',
            backgroundColor: 'rgba(0,0,0,0.30)',
            backdropFilter: 'blur(4px)',
            borderRadius: '999px',
            padding: '0.2rem 0.65rem',
            fontSize: '0.72rem', color: 'rgba(255,255,255,0.80)', fontWeight: 500,
          }}>
            {indice + 1} / {productos.length}
          </div>
        )}
      </div>

      {/* Puntos indicadores */}
      {productos.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.45rem', marginTop: '0.9rem' }}>
          {productos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndice(i)}
              style={{
                width: i === indice ? '22px' : '8px',
                height: '8px',
                borderRadius: '999px',
                border: 'none',
                background: i === indice
                  ? `linear-gradient(135deg, ${TEAL}, ${GOLD})`
                  : 'rgba(0,183,196,0.22)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* Pausado indicator */}
      {pausado && productos.length > 1 && (
        <p style={{ textAlign: 'center', marginTop: '0.4rem', fontSize: '0.7rem', color: TEXT_MUTED }}>
          En pausa · mueve el cursor fuera para continuar
        </p>
      )}
    </section>
  );
}
