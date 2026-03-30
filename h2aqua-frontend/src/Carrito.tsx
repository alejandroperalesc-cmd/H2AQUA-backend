import { useState } from 'react';
import type { ItemCarrito } from './App';
import { useIsMobile } from './useIsMobile';
import {
  BG_CARD, BG_CARD_ALT,
  GOLD, GRAD_MAIN, PANTONE_GLOW,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER, BORDER_SUBTLE,
  ERROR, TEAL,
} from './theme';

const API_URL = import.meta.env.VITE_API_URL;

interface CarritoProps {
  carrito: ItemCarrito[];
  onCambiarCantidad: (id: number, delta: number) => void;
  onEliminar: (id: number) => void;
  onVaciar: () => void;
  onSeguirComprando: () => void;
}

// ─── Mini tarjeta visual para ítems regalo ────────────────────────────────────
function GiftCardBadge({ item }: { item: ItemCarrito }) {
  return (
    <div style={{
      borderRadius: '0.75rem', overflow: 'hidden',
      background: 'linear-gradient(135deg, #006d77, #00B7C4)',
      width: '72px', height: '45px', flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '2px',
    }}>
      <span style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>H2AQUA</span>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
        ${item.precio.toLocaleString('es-MX')}
      </span>
    </div>
  );
}

// ─── Campo de formulario reutilizable ─────────────────────────────────────────
function Campo({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: TEXT_SECONDARY, marginBottom: '0.4rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: TEAL, marginLeft: '2px' }}>*</span>}
      </label>
      {children}
    </div>
  );
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
  const regalos = carrito.filter((i) => i.esRegalo);

  // Pasos: 'carrito' | 'checkout' | 'exito'
  const [paso, setPaso] = useState<'carrito' | 'checkout' | 'exito'>('carrito');

  // Datos del comprador
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const [procesando, setProcesando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const puedeConfirmar = nombre.trim().length > 0 && emailValido;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.65rem',
    border: `1px solid ${BORDER}`, backgroundColor: BG_CARD_ALT,
    color: TEXT_PRIMARY, fontSize: '0.9rem', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
  };

  async function confirmarPedido() {
    if (!puedeConfirmar || procesando) return;
    setErrorMsg('');
    setProcesando(true);

    try {
      // 1. Registrar cliente + pedido de productos reales
      const productItems = carrito
        .filter((i) => !i.esRegalo)
        .map((i) => ({ productoId: i.id, cantidad: i.cantidad }));

      const checkoutResp = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim(), telefono: telefono.trim(), direccion: direccion.trim(), items: productItems }),
      });

      if (!checkoutResp.ok) {
        const body = await checkoutResp.json().catch(() => ({}));
        throw new Error(body.error ?? `Error HTTP ${checkoutResp.status}`);
      }

      // 2. Enviar correos para tarjetas de regalo
      for (const item of regalos) {
        const resp = await fetch(`${API_URL}/enviar-regalo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            codigo:            item.codigoRegalo,
            emailDestinatario: item.emailDestinatario,
            para:              item.paraRegalo,
            de:                item.deRegalo,
            mensaje:           item.mensajeRegalo ?? '',
            monto:             item.precio,
            nombreTarjeta:     item.nombreTarjeta ?? item.nombre,
          }),
        });
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}));
          throw new Error(body.error ?? `Error al enviar correo a ${item.emailDestinatario}`);
        }
      }

      onVaciar();
      setPaso('exito');
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setProcesando(false);
    }
  }

  // ── Éxito ──────────────────────────────────────────────────────────────────
  if (paso === 'exito') {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '5rem 1rem', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1.5rem', background: `linear-gradient(135deg, ${TEAL}, #00B7C4)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="30" height="24" viewBox="0 0 30 24" fill="none">
            <path d="M2 12L10 20L28 2" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>¡Pedido registrado!</p>
        <h2 style={{ fontSize: '1.75rem', color: TEXT_PRIMARY, fontWeight: 300, marginBottom: '0.75rem' }}>
          Gracias, {nombre.split(' ')[0]}
        </h2>
        <p style={{ color: TEXT_SECONDARY, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Tu pedido ha sido registrado correctamente.
          {regalos.length > 0 && ' Los códigos de las tarjetas de regalo ya fueron enviados a los correos indicados.'}
          {' '}Nos pondremos en contacto a la brevedad para coordinar la entrega.
        </p>
        <button
          onClick={onSeguirComprando}
          style={{ padding: '0.85rem 2rem', borderRadius: '999px', border: 'none', background: GRAD_MAIN, color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: `0 4px 14px ${PANTONE_GLOW}` }}
        >
          Seguir explorando
        </button>
      </div>
    );
  }

  // ── Carrito vacío ──────────────────────────────────────────────────────────
  if (carrito.length === 0 && paso === 'carrito') {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '5rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.4 }}>🛒</div>
        <h2 style={{ fontSize: '1.5rem', color: TEXT_PRIMARY, fontWeight: 300, marginBottom: '0.75rem' }}>Tu carrito está vacío</h2>
        <p style={{ color: TEXT_SECONDARY, fontSize: '0.95rem', marginBottom: '2rem' }}>Explora nuestra tienda y agrega los productos que te interesen.</p>
        <button onClick={onSeguirComprando} style={{ padding: '0.85rem 2rem', borderRadius: '999px', border: 'none', background: GRAD_MAIN, color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: `0 4px 14px ${PANTONE_GLOW}` }}>
          Ver tienda en línea
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', width: '100%', boxSizing: 'border-box', margin: '0 auto', padding: isMobile ? '1.5rem 0 3rem' : '2.5rem 0 4rem' }}>

      {/* ── Encabezado ── */}
      <header style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          {/* Migas de pan */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <button
              onClick={() => setPaso('carrito')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: paso === 'carrito' ? 'default' : 'pointer', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: paso === 'carrito' ? TEAL : TEXT_MUTED }}
            >
              Carrito
            </button>
            <span style={{ color: TEXT_MUTED, fontSize: '0.65rem' }}>›</span>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: paso === 'checkout' ? TEAL : TEXT_MUTED }}>
              Datos de envío
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2rem', color: TEXT_PRIMARY, fontWeight: 300, letterSpacing: '0.04em' }}>
            {paso === 'carrito' ? 'Tu carrito' : 'Datos de envío'}
          </h1>
        </div>
        {paso === 'carrito' && (
          <button onClick={onVaciar} style={{ padding: '0.45rem 1rem', borderRadius: '0.5rem', border: `1px solid ${ERROR}44`, backgroundColor: 'transparent', color: ERROR, fontSize: '0.82rem', cursor: 'pointer' }}>
            Vaciar carrito
          </button>
        )}
        {paso === 'checkout' && (
          <button onClick={() => { setPaso('carrito'); setErrorMsg(''); }} style={{ padding: '0.45rem 1rem', borderRadius: '0.5rem', border: `1px solid ${BORDER}`, backgroundColor: 'transparent', color: TEXT_SECONDARY, fontSize: '0.82rem', cursor: 'pointer' }}>
            ← Volver al carrito
          </button>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) minmax(0, 320px)', gap: '1.5rem', alignItems: 'start', width: '100%' }}>

        {/* ── Columna izquierda ── */}
        <div style={{ minWidth: 0 }}>

          {/* PASO 1 — Lista de productos */}
          {paso === 'carrito' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {carrito.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: isMobile ? '0.85rem 1rem' : '1rem 1.25rem', borderRadius: '1rem', backgroundColor: BG_CARD, border: item.esRegalo ? `1px solid rgba(0,183,196,0.30)` : BORDER_SUBTLE, minWidth: 0, overflow: 'hidden' }}>

                  {/* Imagen / Gift badge */}
                  <div style={{ flexShrink: 0 }}>
                    {item.esRegalo ? (
                      <GiftCardBadge item={item} />
                    ) : (
                      <div style={{ width: isMobile ? '56px' : '72px', height: isMobile ? '56px' : '72px', borderRadius: '0.6rem', overflow: 'hidden', backgroundColor: BG_CARD_ALT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.imagenUrl
                          ? <img src={item.imagenUrl} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>◆</span>}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: TEXT_PRIMARY, fontSize: isMobile ? '0.88rem' : '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.nombre}
                    </p>
                    {item.esRegalo && item.paraRegalo && (
                      <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: TEXT_MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Para: {item.paraRegalo} · {item.emailDestinatario}
                      </p>
                    )}
                    {item.esRegalo && item.codigoRegalo && (
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', fontFamily: 'monospace', letterSpacing: '0.10em', color: TEAL, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.codigoRegalo}
                      </p>
                    )}
                    <p style={{ margin: '0.2rem 0 0', color: GOLD, fontWeight: 700, fontSize: '0.9rem' }}>
                      ${item.precio.toLocaleString('es-MX')} MXN
                    </p>
                  </div>

                  {/* Cantidad — solo productos normales */}
                  {!item.esRegalo && (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0.6rem', border: BORDER, overflow: 'hidden', flexShrink: 0 }}>
                      <button onClick={() => onCambiarCantidad(item.id, -1)} style={{ width: isMobile ? '30px' : '34px', height: isMobile ? '30px' : '34px', border: 'none', backgroundColor: 'transparent', color: TEXT_SECONDARY, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ minWidth: '28px', textAlign: 'center', color: TEXT_PRIMARY, fontWeight: 600, fontSize: '0.9rem', borderLeft: BORDER, borderRight: BORDER, height: isMobile ? '30px' : '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.35rem' }}>{item.cantidad}</span>
                      <button onClick={() => onCambiarCantidad(item.id, 1)} style={{ width: isMobile ? '30px' : '34px', height: isMobile ? '30px' : '34px', border: 'none', backgroundColor: 'transparent', color: TEXT_SECONDARY, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                  )}

                  {/* Subtotal — desktop */}
                  {!isMobile && !item.esRegalo && (
                    <p style={{ margin: 0, minWidth: '90px', textAlign: 'right', fontWeight: 700, color: TEXT_PRIMARY, fontSize: '0.95rem', flexShrink: 0 }}>
                      ${(item.precio * item.cantidad).toLocaleString('es-MX')}
                    </p>
                  )}

                  {/* Eliminar */}
                  <button onClick={() => onEliminar(item.id)} title="Eliminar" style={{ width: '30px', height: '30px', borderRadius: '0.4rem', border: `1px solid ${ERROR}33`, backgroundColor: 'transparent', color: ERROR, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
                </div>
              ))}

              <button onClick={onSeguirComprando} style={{ alignSelf: 'flex-start', padding: '0.5rem 1.1rem', borderRadius: '0.6rem', border: BORDER, backgroundColor: 'transparent', color: TEXT_SECONDARY, fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.25rem' }}>
                ← Seguir comprando
              </button>
            </div>
          )}

          {/* PASO 2 — Formulario de datos */}
          {paso === 'checkout' && (
            <div style={{ backgroundColor: BG_CARD, borderRadius: '1.25rem', padding: isMobile ? '1.5rem' : '2rem', border: `1px solid ${BORDER}` }}>
              <p style={{ margin: '0 0 1.5rem', fontSize: '0.8rem', color: TEXT_MUTED, lineHeight: 1.6 }}>
                Completa tus datos para registrar el pedido. Nos pondremos en contacto para coordinar la entrega.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Campo label="Nombre completo" required>
                  <input type="text" placeholder="Tu nombre y apellido" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
                </Campo>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                  <Campo label="Correo electrónico" required>
                    <input
                      type="email" placeholder="correo@ejemplo.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      style={{ ...inputStyle, borderColor: email && !emailValido ? ERROR : BORDER }}
                    />
                    {email && !emailValido && <p style={{ margin: '0.3rem 0 0', fontSize: '0.73rem', color: ERROR }}>Ingresa un correo válido</p>}
                  </Campo>
                  <Campo label="Teléfono / WhatsApp">
                    <input type="tel" placeholder="+52 55 0000 0000" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={inputStyle} />
                  </Campo>
                </div>

                <Campo label="Dirección de entrega">
                  <textarea
                    placeholder="Calle, número, colonia, ciudad…"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }}
                  />
                </Campo>
              </div>

              {errorMsg && (
                <div style={{ marginTop: '1.25rem', backgroundColor: 'rgba(224,85,106,0.08)', borderRadius: '0.65rem', padding: '0.75rem 1rem', border: `1px solid rgba(224,85,106,0.25)` }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: ERROR, lineHeight: 1.5 }}>{errorMsg}</p>
                </div>
              )}

              <button
                onClick={confirmarPedido}
                disabled={!puedeConfirmar || procesando}
                style={{
                  width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '0.75rem', border: 'none',
                  background: puedeConfirmar ? GRAD_MAIN : `rgba(0,109,119,0.25)`,
                  color: puedeConfirmar ? '#fff' : TEXT_MUTED,
                  fontWeight: 700, fontSize: '1rem', cursor: puedeConfirmar ? 'pointer' : 'default',
                  boxShadow: puedeConfirmar ? `0 4px 16px ${PANTONE_GLOW}` : 'none',
                  letterSpacing: '0.02em', transition: 'all 0.2s',
                }}
              >
                {procesando ? 'Procesando…' : 'Confirmar pedido'}
              </button>

              {!puedeConfirmar && (
                <p style={{ margin: '0.65rem 0 0', textAlign: 'center', fontSize: '0.75rem', color: TEXT_MUTED }}>
                  Nombre y correo electrónico son obligatorios
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Resumen de orden (siempre visible) ── */}
        <div style={{ borderRadius: '1.25rem', backgroundColor: BG_CARD, border: BORDER, padding: '1.5rem', position: isMobile ? 'static' : 'sticky', top: '90px', minWidth: 0 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: TEXT_PRIMARY, marginBottom: '1.25rem' }}>Resumen del pedido</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {carrito.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <span style={{ color: TEXT_SECONDARY, fontSize: '0.875rem', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.nombre}{!item.esRegalo && ` × ${item.cantidad}`}
                </span>
                <span style={{ color: TEXT_PRIMARY, fontSize: '0.875rem', flexShrink: 0 }}>
                  ${(item.precio * item.cantidad).toLocaleString('es-MX')}
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: BORDER, paddingTop: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: TEXT_SECONDARY, fontSize: '0.9rem' }}>Total</span>
              <span style={{ color: GOLD, fontWeight: 700, fontSize: '1.35rem' }}>
                ${subtotal.toLocaleString('es-MX')} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: TEXT_MUTED }}>MXN</span>
              </span>
            </div>
          </div>

          {regalos.length > 0 && (
            <div style={{ backgroundColor: 'rgba(0,183,196,0.07)', borderRadius: '0.6rem', padding: '0.75rem 0.9rem', marginBottom: '1rem', border: `1px solid rgba(0,183,196,0.18)` }}>
              <p style={{ margin: 0, fontSize: '0.76rem', color: TEAL, lineHeight: 1.6 }}>
                🎁 Los códigos de regalo se enviarán al confirmar el pedido.
              </p>
            </div>
          )}

          {paso === 'carrito' && (
            <button
              onClick={() => setPaso('checkout')}
              style={{ width: '100%', padding: '0.9rem', borderRadius: '0.75rem', border: 'none', background: GRAD_MAIN, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: `0 4px 16px ${PANTONE_GLOW}`, letterSpacing: '0.02em' }}
            >
              Proceder al pago →
            </button>
          )}

          {paso === 'checkout' && (
            <div style={{ padding: '0.6rem 0.9rem', borderRadius: '0.6rem', backgroundColor: BG_CARD_ALT, border: `1px solid ${BORDER}` }}>
              <p style={{ margin: 0, fontSize: '0.76rem', color: TEXT_MUTED, textAlign: 'center' }}>Completa el formulario para confirmar</p>
            </div>
          )}

          <p style={{ margin: '0.85rem 0 0', textAlign: 'center', fontSize: '0.78rem', color: TEXT_MUTED }}>
            ◆ Datos protegidos · Entrega coordinada por WhatsApp
          </p>
        </div>

      </div>
    </div>
  );
}
