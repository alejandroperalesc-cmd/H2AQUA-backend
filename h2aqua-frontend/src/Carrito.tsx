import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
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

  // Pasos: 'carrito' | 'checkout' | 'pago' | 'exito'
  const [paso, setPaso] = useState<'carrito' | 'checkout' | 'pago' | 'exito'>('carrito');

  // Datos del comprador
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [calle, setCalle]           = useState('');
  const [numExt, setNumExt]         = useState('');
  const [numInt, setNumInt]         = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [colonia, setColonia]       = useState('');
  const [ciudad, setCiudad]         = useState('');
  const [estadoEnvio, setEstadoEnvio] = useState('');
  const [referencia, setReferencia] = useState('');

  const [procesando, setProcesando]   = useState(false);
  const [cargandoClip, setCargandoClip] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [numeroPedido, setNumeroPedido] = useState('');

  // Shipping costs from backend
  const [costosEnvio, setCostosEnvio] = useState<{ estado: string; costo: number }[]>([]);
  useEffect(() => {
    fetch(`${API_URL}/costos-envio`)
      .then((r) => r.json())
      .then((data: { estado: string; costo: number }[]) => setCostosEnvio(data))
      .catch(() => {});
  }, []);

  const costoEnvio = costosEnvio.find((c) => c.estado === estadoEnvio)?.costo ?? 0;
  const total = subtotal + costoEnvio;

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const puedeConfirmar =
    nombre.trim().length > 0 && emailValido &&
    calle.trim().length > 0 && numExt.trim().length > 0 &&
    codigoPostal.trim().length > 0 && colonia.trim().length > 0 &&
    ciudad.trim().length > 0 && estadoEnvio.length > 0;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.65rem',
    border: `1px solid ${BORDER}`, backgroundColor: BG_CARD_ALT,
    color: TEXT_PRIMARY, fontSize: '0.9rem', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
  };

  // Construye el payload de regalos para el backend
  const regalosPayload = regalos.map(item => ({
    codigo:            item.codigoRegalo ?? '',
    emailDestinatario: item.emailDestinatario ?? '',
    para:              item.paraRegalo ?? '',
    de:                item.deRegalo ?? '',
    mensaje:           item.mensajeRegalo ?? '',
    monto:             item.precio,
    nombreTarjeta:     item.nombreTarjeta ?? item.nombre,
  }));

  const productItems = carrito
    .filter(i => !i.esRegalo)
    .map(i => ({ productoId: i.id, cantidad: i.cantidad }));

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
        {numeroPedido && (
          <div style={{ display: 'inline-block', margin: '0 0 1.5rem', padding: '0.6rem 1.5rem', borderRadius: '0.75rem', background: `linear-gradient(135deg, ${TEAL}22, #00B7C422)`, border: `1px solid ${TEAL}44` }}>
            <p style={{ margin: '0 0 0.15rem', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: TEAL }}>Número de orden</p>
            <p style={{ margin: 0, fontSize: '1.35rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.12em', color: TEXT_PRIMARY }}>{numeroPedido}</p>
          </div>
        )}
        <p style={{ color: TEXT_SECONDARY, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          Tu pedido ha sido registrado correctamente. Recibirás una confirmación en <strong>{email}</strong>.
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
              onClick={() => paso !== 'carrito' && setPaso('carrito')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: paso === 'carrito' ? 'default' : 'pointer', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: paso === 'carrito' ? TEAL : TEXT_MUTED }}
            >
              Carrito
            </button>
            <span style={{ color: TEXT_MUTED, fontSize: '0.65rem' }}>›</span>
            <button
              onClick={() => paso === 'pago' && setPaso('checkout')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: paso === 'pago' ? 'pointer' : 'default', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: paso === 'checkout' ? TEAL : TEXT_MUTED }}
            >
              Datos de envío
            </button>
            <span style={{ color: TEXT_MUTED, fontSize: '0.65rem' }}>›</span>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, color: paso === 'pago' ? TEAL : TEXT_MUTED }}>
              Confirmar
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2rem', color: TEXT_PRIMARY, fontWeight: 300, letterSpacing: '0.04em' }}>
            {paso === 'carrito' ? 'Tu carrito' : paso === 'checkout' ? 'Datos de envío' : 'Confirmar pedido'}
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
        {paso === 'pago' && (
          <button onClick={() => setPaso('checkout')} style={{ padding: '0.45rem 1rem', borderRadius: '0.5rem', border: `1px solid ${BORDER}`, backgroundColor: 'transparent', color: TEXT_SECONDARY, fontSize: '0.82rem', cursor: 'pointer' }}>
            ← Volver
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

                <Campo label="Calle" required>
                  <input type="text" placeholder="Nombre de la calle" value={calle} onChange={(e) => setCalle(e.target.value)} style={inputStyle} />
                </Campo>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                  <Campo label="Número exterior" required>
                    <input type="text" placeholder="Ej. 42" value={numExt} onChange={(e) => setNumExt(e.target.value)} style={inputStyle} />
                  </Campo>
                  <Campo label="Número interior">
                    <input type="text" placeholder="Depto, piso… (opcional)" value={numInt} onChange={(e) => setNumInt(e.target.value)} style={inputStyle} />
                  </Campo>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                  <Campo label="Código postal" required>
                    <input type="text" placeholder="00000" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} style={inputStyle} />
                  </Campo>
                  <Campo label="Colonia" required>
                    <input type="text" placeholder="Nombre de la colonia" value={colonia} onChange={(e) => setColonia(e.target.value)} style={inputStyle} />
                  </Campo>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                  <Campo label="Ciudad / Alcaldía" required>
                    <input type="text" placeholder="Ciudad o Alcaldía" value={ciudad} onChange={(e) => setCiudad(e.target.value)} style={inputStyle} />
                  </Campo>
                  <Campo label="Estado" required>
                    <select
                      value={estadoEnvio}
                      onChange={(e) => setEstadoEnvio(e.target.value)}
                      style={{
                        ...inputStyle,
                        cursor: 'pointer',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2300A9C0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="">Selecciona un estado…</option>
                      {costosEnvio.map((c) => (
                        <option key={c.estado} value={c.estado}>{c.estado}</option>
                      ))}
                    </select>
                  </Campo>
                </div>

                <Campo label="Referencia">
                  <input type="text" placeholder="Entre calles, señas, color de fachada… (opcional)" value={referencia} onChange={(e) => setReferencia(e.target.value)} style={inputStyle} />
                </Campo>
              </div>

              {errorMsg && (
                <div style={{ marginTop: '1.25rem', backgroundColor: 'rgba(224,85,106,0.08)', borderRadius: '0.65rem', padding: '0.75rem 1rem', border: `1px solid rgba(224,85,106,0.25)` }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: ERROR, lineHeight: 1.5 }}>{errorMsg}</p>
                </div>
              )}

              <button
                onClick={() => { setErrorMsg(''); setPaso('pago'); }}
                disabled={!puedeConfirmar}
                style={{
                  width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '0.75rem', border: 'none',
                  background: puedeConfirmar ? GRAD_MAIN : `rgba(0,109,119,0.25)`,
                  color: puedeConfirmar ? '#fff' : TEXT_MUTED,
                  fontWeight: 700, fontSize: '1rem', cursor: puedeConfirmar ? 'pointer' : 'default',
                  boxShadow: puedeConfirmar ? `0 4px 16px ${PANTONE_GLOW}` : 'none',
                  letterSpacing: '0.02em', transition: 'all 0.2s',
                }}
              >
                Continuar →
              </button>

              {!puedeConfirmar && (
                <p style={{ margin: '0.65rem 0 0', textAlign: 'center', fontSize: '0.75rem', color: TEXT_MUTED }}>
                  Los campos marcados con * son obligatorios
                </p>
              )}
            </div>
          )}

          {/* PASO 3 — Pago */}
          {paso === 'pago' && (() => {
            const direccionFmt = calle
              ? [
                  `${calle.trim()} ${numExt.trim()}${numInt.trim() ? ` Int. ${numInt.trim()}` : ''}`,
                  `Col. ${colonia.trim()}`,
                  `CP ${codigoPostal.trim()}`,
                  ciudad.trim(),
                  ...(estadoEnvio ? [estadoEnvio] : []),
                  ...(referencia.trim() ? [`Ref: ${referencia.trim()}`] : []),
                ].join(', ')
              : '';

            async function simularVenta() {
              setProcesando(true);
              setErrorMsg('');
              try {
                const checkoutRes = await fetch(`${API_URL}/checkout`, {
                  method:  'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body:    JSON.stringify({
                    nombre:    nombre.trim(),
                    email:     email.trim(),
                    telefono:  telefono.trim(),
                    direccion: direccionFmt,
                    estado:    estadoEnvio,
                    items:     productItems,
                  }),
                });
                if (!checkoutRes.ok) {
                  const body = await checkoutRes.json().catch(() => ({})) as { error?: string };
                  throw new Error(body.error ?? 'Error al registrar el pedido');
                }
                const { pedido } = await checkoutRes.json() as { pedido?: { id: number } };
                if (pedido?.id) {
                  setNumeroPedido(`H2-${String(pedido.id).padStart(5, '0')}`);
                }

                for (const regalo of regalosPayload) {
                  if (!regalo.codigo || !regalo.emailDestinatario) continue;
                  try {
                    await fetch(`${API_URL}/enviar-regalo`, {
                      method:  'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body:    JSON.stringify(regalo),
                    });
                  } catch (emailErr) {
                    console.warn('Gift card email failed (non-fatal):', emailErr);
                  }
                }

                onVaciar();
                setPaso('exito');
              } catch (err: unknown) {
                setErrorMsg(err instanceof Error ? err.message : 'Error al procesar el pedido');
              } finally {
                setProcesando(false);
              }
            }

            async function pagarConClip() {
              setCargandoClip(true);
              setErrorMsg('');
              try {
                const res = await fetch(`${API_URL}/api/clip/create-payment`, {
                  method:  'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body:    JSON.stringify({
                    nombre:    nombre.trim(),
                    email:     email.trim(),
                    telefono:  telefono.trim(),
                    direccion: direccionFmt,
                    estado:    estadoEnvio,
                    items:     productItems,
                    regalos:   regalosPayload,
                    total,
                  }),
                });
                if (!res.ok) {
                  const body = await res.json().catch(() => ({})) as { error?: string };
                  throw new Error(body.error ?? 'No se pudo crear el pago con Clip');
                }
                const { url } = await res.json() as { url: string };
                window.location.href = url;
              } catch (err: unknown) {
                setErrorMsg(err instanceof Error ? err.message : 'Error al conectar con Clip');
                setCargandoClip(false);
              }
            }

            return (
              <div style={{ backgroundColor: BG_CARD, borderRadius: '1.25rem', padding: isMobile ? '1.5rem' : '2rem', border: `1px solid ${BORDER}` }}>

                {/* Resumen de datos */}
                <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: BG_CARD_ALT, border: `1px solid ${BORDER}` }}>
                  <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', color: TEXT_MUTED, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Datos de entrega</p>
                  <p style={{ margin: 0, fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.9rem' }}>{nombre}</p>
                  <p style={{ margin: '0.1rem 0 0', color: TEXT_SECONDARY, fontSize: '0.82rem' }}>{email}{telefono ? ` · ${telefono}` : ''}</p>
                  {direccionFmt && <p style={{ margin: '0.1rem 0 0', color: TEXT_SECONDARY, fontSize: '0.82rem' }}>{direccionFmt}</p>}
                </div>

                {errorMsg && (
                  <div style={{ marginBottom: '1.25rem', backgroundColor: 'rgba(224,85,106,0.08)', borderRadius: '0.65rem', padding: '0.75rem 1rem', border: `1px solid rgba(224,85,106,0.25)` }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: ERROR, lineHeight: 1.5 }}>{errorMsg}</p>
                  </div>
                )}

                {/* ── Clip ── */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT_MUTED }}>
                    Pago con tarjeta
                  </p>
                  <button
                    disabled={cargandoClip || procesando}
                    onClick={pagarConClip}
                    style={{
                      width: '100%', padding: '0.95rem', borderRadius: '0.75rem', border: 'none',
                      background: (cargandoClip || procesando) ? `rgba(0,109,119,0.25)` : GRAD_MAIN,
                      color: (cargandoClip || procesando) ? TEXT_MUTED : '#fff',
                      fontWeight: 700, fontSize: '1rem',
                      cursor: (cargandoClip || procesando) ? 'default' : 'pointer',
                      boxShadow: (cargandoClip || procesando) ? 'none' : `0 4px 16px ${PANTONE_GLOW}`,
                      letterSpacing: '0.02em', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    }}
                  >
                    <span>💳</span>
                    {cargandoClip ? 'Redirigiendo a Clip…' : 'Pagar con Clip'}
                  </button>
                  <p style={{ margin: '0.5rem 0 0', textAlign: 'center', fontSize: '0.72rem', color: TEXT_MUTED }}>
                    🔒 Débito · Crédito · Transferencia — procesado por Clip
                  </p>
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: BORDER }} />
                  <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, letterSpacing: '0.1em' }}>o también</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: BORDER }} />
                </div>

                {/* ── PayPal ── */}
                <div>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT_MUTED }}>
                    Pago con PayPal
                  </p>
                  <PayPalScriptProvider options={{
                    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID ?? '',
                    currency: 'MXN',
                    locale:   'es_MX',
                  }}>
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
                      disabled={procesando || cargandoClip}
                      createOrder={async () => {
                        const res = await fetch(`${API_URL}/api/paypal/create-order`, {
                          method:  'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body:    JSON.stringify({ total }),
                        });
                        if (!res.ok) throw new Error('No se pudo iniciar el pago');
                        const data = await res.json() as { orderID: string };
                        return data.orderID;
                      }}
                      onApprove={async (data) => {
                        setProcesando(true);
                        setErrorMsg('');
                        try {
                          const captureRes = await fetch(`${API_URL}/api/paypal/capture-order`, {
                            method:  'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body:    JSON.stringify({ orderID: data.orderID }),
                          });
                          if (!captureRes.ok) {
                            const body = await captureRes.json().catch(() => ({})) as { error?: string };
                            throw new Error(body.error ?? 'Error al capturar el pago');
                          }

                          const checkoutRes = await fetch(`${API_URL}/checkout`, {
                            method:  'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body:    JSON.stringify({
                              nombre:    nombre.trim(),
                              email:     email.trim(),
                              telefono:  telefono.trim(),
                              direccion: direccionFmt,
                              estado:    estadoEnvio,
                              items:     productItems,
                            }),
                          });
                          if (!checkoutRes.ok) {
                            const body = await checkoutRes.json().catch(() => ({})) as { error?: string };
                            throw new Error(body.error ?? 'Error al registrar el pedido');
                          }
                          const { pedido: pp } = await checkoutRes.json() as { pedido?: { id: number } };
                          if (pp?.id) setNumeroPedido(`H2-${String(pp.id).padStart(5, '0')}`);

                          for (const regalo of regalosPayload) {
                            if (!regalo.codigo || !regalo.emailDestinatario) continue;
                            try {
                              await fetch(`${API_URL}/enviar-regalo`, {
                                method:  'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body:    JSON.stringify(regalo),
                              });
                            } catch (emailErr) {
                              console.warn('Email send failed (non-fatal):', emailErr);
                            }
                          }

                          onVaciar();
                          setPaso('exito');
                        } catch (err: unknown) {
                          setErrorMsg(err instanceof Error ? err.message : 'Error al procesar el pago');
                        } finally {
                          setProcesando(false);
                        }
                      }}
                      onError={() => setErrorMsg('Ocurrió un error con PayPal. Intenta de nuevo.')}
                      onCancel={() => setErrorMsg('Pago cancelado. Puedes intentarlo cuando quieras.')}
                    />
                  </PayPalScriptProvider>
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: BORDER }} />
                  <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, letterSpacing: '0.1em' }}>o también</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: BORDER }} />
                </div>

                {/* ── Simular venta ── */}
                <div>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT_MUTED }}>
                    Registrar pedido sin pago
                  </p>
                  <button
                    disabled={procesando || cargandoClip}
                    onClick={simularVenta}
                    style={{
                      width: '100%', padding: '0.95rem', borderRadius: '0.75rem',
                      border: `1px solid ${BORDER}`,
                      background: (procesando || cargandoClip) ? 'transparent' : BG_CARD_ALT,
                      color: (procesando || cargandoClip) ? TEXT_MUTED : TEXT_SECONDARY,
                      fontWeight: 600, fontSize: '0.95rem',
                      cursor: (procesando || cargandoClip) ? 'default' : 'pointer',
                      letterSpacing: '0.02em', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    }}
                  >
                    {procesando ? 'Registrando…' : '📋 Simular venta'}
                  </button>
                  <p style={{ margin: '0.5rem 0 0', textAlign: 'center', fontSize: '0.72rem', color: TEXT_MUTED }}>
                    Registra el pedido y envía confirmación por correo
                  </p>
                </div>

              </div>
            );
          })()}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: costoEnvio > 0 || estadoEnvio ? '0.4rem' : 0 }}>
              <span style={{ color: TEXT_SECONDARY, fontSize: '0.85rem' }}>Subtotal</span>
              <span style={{ color: TEXT_PRIMARY, fontWeight: 500, fontSize: '0.95rem' }}>
                ${subtotal.toLocaleString('es-MX')}
              </span>
            </div>
            {estadoEnvio && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
                <span style={{ color: TEXT_SECONDARY, fontSize: '0.85rem' }}>Envío ({estadoEnvio})</span>
                <span style={{ color: costoEnvio > 0 ? TEXT_PRIMARY : TEAL, fontWeight: 500, fontSize: '0.95rem' }}>
                  {costoEnvio > 0 ? `$${costoEnvio.toLocaleString('es-MX')}` : 'Gratis'}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: estadoEnvio ? BORDER : 'none', paddingTop: estadoEnvio ? '0.6rem' : 0 }}>
              <span style={{ color: TEXT_SECONDARY, fontSize: '0.9rem' }}>Total</span>
              <span style={{ color: GOLD, fontWeight: 700, fontSize: '1.35rem' }}>
                ${total.toLocaleString('es-MX')} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: TEXT_MUTED }}>MXN</span>
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

          {(paso === 'checkout' || paso === 'pago') && (
            <div style={{ padding: '0.6rem 0.9rem', borderRadius: '0.6rem', backgroundColor: BG_CARD_ALT, border: `1px solid ${BORDER}` }}>
              <p style={{ margin: 0, fontSize: '0.76rem', color: TEXT_MUTED, textAlign: 'center' }}>
                {paso === 'checkout' ? 'Completa el formulario para continuar' : 'Revisa tu pedido y confirma'}
              </p>
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
