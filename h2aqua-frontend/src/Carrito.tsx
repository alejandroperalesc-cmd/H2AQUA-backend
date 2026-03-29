import type { ItemCarrito } from './App';
import { useIsMobile } from './useIsMobile';
import {
  BG_CARD, BG_CARD_ALT,
  GOLD,
  GRAD_MAIN, PANTONE_GLOW,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER, BORDER_SUBTLE,
  ERROR,
} from './theme';

interface CarritoProps {
  carrito: ItemCarrito[];
  onCambiarCantidad: (id: number, delta: number) => void;
  onEliminar: (id: number) => void;
  onVaciar: () => void;
  onSeguirComprando: () => void;
}

export default function Carrito({
  carrito,
  onCambiarCantidad,
  onEliminar,
  onVaciar,
  onSeguirComprando,
}: CarritoProps) {
  const isMobile = useIsMobile();
  const subtotal = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);

  // ── Carrito vacío ──────────────────────────────────────────────────────────
  if (carrito.length === 0) {
    return (
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '5rem 1rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.4 }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', color: TEXT_PRIMARY, fontWeight: 300, marginBottom: '0.75rem' }}>
          Tu carrito está vacío
        </h2>
        <p style={{ color: TEXT_SECONDARY, fontSize: '0.95rem', marginBottom: '2rem' }}>
          Explora nuestra tienda y agrega los productos que te interesen.
        </p>
        <button
          onClick={onSeguirComprando}
          style={{
            padding: '0.85rem 2rem',
            borderRadius: '999px',
            border: 'none',
            background: GRAD_MAIN,
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: `0 4px 14px ${PANTONE_GLOW}`,
          }}
        >
          Ver tienda en línea
        </button>
      </div>
    );
  }

  // ── Carrito con productos ──────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '1.5rem 0 3rem' : '2.5rem 0 4rem' }}>

      {/* Encabezado */}
      <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <p style={{ margin: '0 0 0.4rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
            Resumen
          </p>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', color: TEXT_PRIMARY, fontWeight: 300, letterSpacing: '0.04em' }}>
            Tu carrito
          </h1>
        </div>
        <button
          onClick={onVaciar}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '0.5rem',
            border: `1px solid ${ERROR}44`,
            backgroundColor: 'transparent',
            color: ERROR,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          Vaciar carrito
        </button>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 320px',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >

        {/* ── Lista de productos ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {carrito.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: isMobile ? '0.85rem 1rem' : '1rem 1.25rem',
                borderRadius: '1rem',
                backgroundColor: BG_CARD,
                border: BORDER_SUBTLE,
              }}
            >
              {/* Imagen */}
              <div
                style={{
                  width: isMobile ? '56px' : '72px',
                  height: isMobile ? '56px' : '72px',
                  borderRadius: '0.6rem',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: BG_CARD_ALT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.imagenUrl ? (
                  <img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>◆</span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, color: TEXT_PRIMARY, fontSize: isMobile ? '0.88rem' : '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.nombre}
                </p>
                <p style={{ margin: '0.2rem 0 0', color: GOLD, fontWeight: 700, fontSize: '0.9rem' }}>
                  ${item.precio.toLocaleString('es-MX')} MXN
                </p>
              </div>

              {/* Control cantidad */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '0.6rem',
                  border: BORDER,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => onCambiarCantidad(item.id, -1)}
                  style={{
                    width: isMobile ? '30px' : '34px',
                    height: isMobile ? '30px' : '34px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: TEXT_SECONDARY,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    minWidth: '28px',
                    textAlign: 'center',
                    color: TEXT_PRIMARY,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    borderLeft: BORDER,
                    borderRight: BORDER,
                    height: isMobile ? '30px' : '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 0.35rem',
                  }}
                >
                  {item.cantidad}
                </span>
                <button
                  onClick={() => onCambiarCantidad(item.id, 1)}
                  style={{
                    width: isMobile ? '30px' : '34px',
                    height: isMobile ? '30px' : '34px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: TEXT_SECONDARY,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>

              {/* Subtotal ítem — oculto en mobile muy pequeño */}
              {!isMobile && (
                <p
                  style={{
                    margin: 0,
                    minWidth: '90px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                    fontSize: '0.95rem',
                    flexShrink: 0,
                  }}
                >
                  ${(item.precio * item.cantidad).toLocaleString('es-MX')}
                </p>
              )}

              {/* Eliminar */}
              <button
                onClick={() => onEliminar(item.id)}
                title="Eliminar"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '0.4rem',
                  border: `1px solid ${ERROR}33`,
                  backgroundColor: 'transparent',
                  color: ERROR,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={onSeguirComprando}
            style={{
              alignSelf: 'flex-start',
              padding: '0.5rem 1.1rem',
              borderRadius: '0.6rem',
              border: BORDER,
              backgroundColor: 'transparent',
              color: TEXT_SECONDARY,
              fontSize: '0.85rem',
              cursor: 'pointer',
              marginTop: '0.25rem',
            }}
          >
            ← Seguir comprando
          </button>
        </div>

        {/* ── Resumen de orden ── */}
        <div
          style={{
            borderRadius: '1.25rem',
            backgroundColor: BG_CARD,
            border: BORDER,
            padding: '1.5rem',
            position: isMobile ? 'static' : 'sticky',
            top: '90px',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: TEXT_PRIMARY, marginBottom: '1.25rem' }}>
            Resumen del pedido
          </h2>

          {/* Desglose */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {carrito.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span style={{ color: TEXT_SECONDARY, fontSize: '0.875rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.nombre} × {item.cantidad}
                </span>
                <span style={{ color: TEXT_PRIMARY, fontSize: '0.875rem', flexShrink: 0 }}>
                  ${(item.precio * item.cantidad).toLocaleString('es-MX')}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ borderTop: BORDER, paddingTop: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: TEXT_SECONDARY, fontSize: '0.9rem' }}>Total</span>
              <span style={{ color: GOLD, fontWeight: 700, fontSize: '1.35rem' }}>
                ${subtotal.toLocaleString('es-MX')} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: TEXT_MUTED }}>MXN</span>
              </span>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: GRAD_MAIN,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${PANTONE_GLOW}`,
              letterSpacing: '0.02em',
            }}
          >
            Proceder al pago
          </button>

          <p style={{ margin: '0.85rem 0 0', textAlign: 'center', fontSize: '0.78rem', color: TEXT_MUTED }}>
            ◆ Pagos seguros · Envío confirmado por WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}
