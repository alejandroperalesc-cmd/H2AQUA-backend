import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Productos from './Productos';
import NuevoProducto from './NuevoProducto';
import TiendaProductos from './TiendaProductos';
import CitasCalendarioAdmin from './CitasCalendarioAdmin';
import Carrito from './Carrito';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { useIsMobile } from './useIsMobile';
import {
  BG_DARK, BG_CARD, BG_CARD_ALT,
  GOLD, GOLD_LIGHT, GOLD_GLOW, GOLD_SUBTLE,
  TEAL,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER, BORDER_SUBTLE,
} from './theme';

type Vista = 'home' | 'lista' | 'nuevo' | 'tienda' | 'citas' | 'citas-calendario' | 'carrito';

export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string | null;
};

const API_URL = import.meta.env.VITE_API_URL;
const CARRITO_KEY = 'h2aqua_carrito';

// ─── Home ──────────────────────────────────────────────────────────────────────

function Home({ irA }: { irA: (vista: Vista) => void }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '1.5rem 0 3rem' : '2.5rem 0 4rem' }}>

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          borderRadius: isMobile ? '1rem' : '1.5rem',
          overflow: 'hidden',
          minHeight: isMobile ? '320px' : '420px',
          marginBottom: isMobile ? '2rem' : '3rem',
          backgroundColor: BG_CARD,
          backgroundImage: 'url("/hero-hidrogeno.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(120deg, rgba(26,31,53,0.92) 0%, rgba(26,31,53,0.55) 70%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${GOLD}, transparent)`,
          }}
        />

        <div style={{ position: 'relative', padding: isMobile ? '2rem 1.5rem' : '3.5rem', maxWidth: '560px', color: TEXT_PRIMARY }}>
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              fontSize: '0.72rem',
              marginBottom: '0.8rem',
              color: GOLD,
              fontWeight: 600,
            }}
          >
            Hidrógeno molecular · Wellness
          </p>

          <h1
            style={{
              fontSize: isMobile ? '1.9rem' : '2.8rem',
              fontWeight: 300,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              lineHeight: 1.2,
              color: TEXT_PRIMARY,
            }}
          >
            Bienestar profundo
            <br />
            <span style={{ color: GOLD, fontWeight: 400 }}>con hidrógeno molecular</span>
          </h1>

          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.7,
              marginBottom: '1.75rem',
              color: TEXT_SECONDARY,
            }}
          >
            Terapias que ayudan a desinflamar, desintoxicar y equilibrar tu
            cuerpo desde adentro, neutralizando radicales libres y protegiendo tus células.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => irA('tienda')}
              style={{
                padding: '0.85rem 1.75rem',
                borderRadius: '999px',
                border: 'none',
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                color: BG_DARK,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: `0 4px 18px ${GOLD_GLOW}`,
              }}
            >
              Ver tienda en línea
            </button>
            <button
              onClick={() => irA('citas')}
              style={{
                padding: '0.85rem 1.75rem',
                borderRadius: '999px',
                border: `1px solid ${GOLD}`,
                backgroundColor: 'transparent',
                color: GOLD,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              Agenda tu terapia
            </button>
          </div>
        </div>
      </section>

      {/* ¿QUÉ ES EL HIDRÓGENO? */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.3fr) minmax(0, 1fr)',
          gap: isMobile ? '1.5rem' : '2.5rem',
          alignItems: 'center',
          marginBottom: isMobile ? '2rem' : '3rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: isMobile ? '1.35rem' : '1.6rem', marginBottom: '0.75rem', color: GOLD }}>
            ¿Qué es el hidrógeno molecular?
          </h2>
          <p style={{ marginBottom: '0.75rem', color: TEXT_SECONDARY, fontSize: '0.95rem', lineHeight: 1.75 }}>
            Es la molécula más pequeña que existe y puede llegar a tejidos y células
            a través del torrente sanguíneo. Actúa como antioxidante y antiinflamatorio.
          </p>
          <p style={{ color: TEXT_SECONDARY, fontSize: '0.95rem', lineHeight: 1.75 }}>
            En H2Aqua utilizamos terapias de hidrógeno molecular para apoyar procesos
            de desinflamación, desintoxicación y equilibrio general.
          </p>
        </div>

        <div
          style={{
            borderRadius: '1.25rem',
            padding: '1.4rem 1.6rem',
            background: BG_CARD,
            border: BORDER,
          }}
        >
          <h3
            style={{
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              marginBottom: '1rem',
              color: GOLD,
            }}
          >
            Beneficios que puedes sentir
          </h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              rowGap: '0.65rem',
              fontSize: '0.9rem',
              color: TEXT_SECONDARY,
            }}
          >
            {[
              'Disminución de dolor e inflamación articular.',
              'Mejora del descanso, energía y claridad mental.',
              'Apoyo al sistema inmune y recuperación física.',
              'Piel más hidratada y aspecto más luminoso.',
            ].map((b) => (
              <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: TEAL, flexShrink: 0, marginTop: '0.1rem' }}>◆</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        style={{
          borderRadius: '1.25rem',
          padding: isMobile ? '1.5rem' : '2rem 2.5rem',
          background: `linear-gradient(135deg, ${BG_CARD} 0%, rgba(34,40,69,0.6) 100%)`,
          border: BORDER,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '1.25rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: isMobile ? '1.1rem' : '1.35rem', marginBottom: '0.4rem', color: TEXT_PRIMARY }}>
            Regálale a tu cuerpo una pausa profunda
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: TEXT_SECONDARY }}>
            Agenda tu sesión de hidrógeno molecular y comienza a sentir los beneficios.
          </p>
        </div>

        <button
          onClick={() => irA('citas')}
          style={{
            padding: '0.85rem 1.75rem',
            borderRadius: '999px',
            border: 'none',
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            color: BG_DARK,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            boxShadow: `0 4px 18px ${GOLD_GLOW}`,
            alignSelf: isMobile ? 'stretch' : 'auto',
            textAlign: 'center',
          }}
        >
          Agenda tu cita
        </button>
      </section>
    </div>
  );
}

// ─── Tipos citas ───────────────────────────────────────────────────────────────

type CitaApi = { id: number; fechaHora: string; estado: string };
type TerapiaApi = { id: number; nombre: string; descripcion: string | null; precio: number };

// ─── Citas (cliente) ───────────────────────────────────────────────────────────

function Citas() {
  const isMobile = useIsMobile();
  const [fecha, setFecha] = useState<Date>(new Date());
  const fechaTexto = fecha.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

  const horarios: string[] = [];
  for (let hora = 10; hora < 18; hora++) {
    horarios.push(`${hora.toString().padStart(2, '0')}:00`);
  }

  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [citasBackend, setCitasBackend] = useState<CitaApi[]>([]);
  const [cargandoCitas, setCargandoCitas] = useState(false);
  const [terapias, setTerapias] = useState<TerapiaApi[]>([]);
  const [terapiaSeleccionadaId, setTerapiaSeleccionadaId] = useState<number | null>(null);

  async function cargarCitas() {
    try {
      setCargandoCitas(true);
      const resp = await fetch(`${API_URL}/citas`);
      if (!resp.ok) throw new Error();
      setCitasBackend(await resp.json());
    } catch { /* silencioso */ } finally { setCargandoCitas(false); }
  }

  async function cargarTerapias() {
    try {
      const resp = await fetch(`${API_URL}/terapias-disponibles`);
      if (!resp.ok) throw new Error();
      const data: TerapiaApi[] = await resp.json();
      setTerapias(data);
      if (data.length > 0) setTerapiaSeleccionadaId(data[0].id);
    } catch { alert('No se pudieron cargar las terapias disponibles.'); }
  }

  useEffect(() => { cargarCitas(); cargarTerapias(); }, []);

  const fechaKey = fecha.toISOString().slice(0, 10);
  const horariosOcupados = new Set(
    citasBackend
      .filter((c) => c.fechaHora.slice(0, 10) === fechaKey && c.estado !== 'CANCELADA')
      .map((c) => new Date(c.fechaHora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })),
  );

  async function confirmarCita() {
    if (!horaSeleccionada || !nombre || !telefono) {
      alert('Por favor llena nombre, teléfono y selecciona un horario.');
      return;
    }
    if (!terapiaSeleccionadaId) { alert('Por favor elige una terapia.'); return; }
    if (horariosOcupados.has(horaSeleccionada)) { alert('Ese horario ya está ocupado, elige otro.'); return; }

    try {
      setGuardando(true);
      const [horaStr, minutoStr] = horaSeleccionada.split(':');
      const fechaHora = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), parseInt(horaStr), parseInt(minutoStr), 0).toISOString();
      const terapia = terapias.find((t) => t.id === terapiaSeleccionadaId);

      const resp = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaHora, clienteId: 1, servicioId: 1,
          notas: `Nombre: ${nombre}, Tel: ${telefono}, Correo: ${correo || 'N/A'}, Terapia: ${terapia?.nombre ?? ''}`,
          estado: 'PENDIENTE',
        }),
      });

      if (!resp.ok) { alert('No se pudo guardar la cita. Intenta más tarde.'); return; }
      alert(`Cita reservada para ${nombre} el ${fechaTexto} a las ${horaSeleccionada}.`);
      await cargarCitas();
      setHoraSeleccionada(null); setNombre(''); setTelefono(''); setCorreo('');
    } catch { alert('No se pudo guardar la cita. Intenta más tarde.'); }
    finally { setGuardando(false); }
  }

  const terapiaSeleccionada = terapias.find((t) => t.id === terapiaSeleccionadaId) ?? null;

  const inputStyle = {
    padding: '0.65rem 0.9rem',
    borderRadius: '0.6rem',
    border: BORDER,
    fontSize: '0.95rem',
    backgroundColor: BG_CARD_ALT,
    color: TEXT_PRIMARY,
    outline: 'none',
    width: '100%',
  } as const;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: isMobile ? '1.5rem 0 3rem' : '2.5rem 0 4rem' }}>
      <h1 style={{ fontSize: isMobile ? '1.6rem' : '2rem', marginBottom: '0.4rem', color: TEXT_PRIMARY }}>Agenda tu cita</h1>
      <p style={{ marginBottom: '1.5rem', color: TEXT_SECONDARY }}>Elige tu terapia, día y horario.</p>

      {/* Calendario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <Calendar
          value={fecha}
          onChange={(value) => {
            const d = Array.isArray(value) ? value[0] : value;
            if (d instanceof Date) { setFecha(d); setHoraSeleccionada(null); }
          }}
        />
        <div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: TEXT_MUTED }}>Fecha seleccionada:</p>
          <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: 500, color: GOLD, textTransform: 'capitalize' }}>
            {fechaTexto}
          </p>
          {cargandoCitas && <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: TEXT_MUTED }}>Actualizando horarios…</p>}
        </div>
      </div>

      {/* Selector terapia */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1.4rem 1.25rem',
          borderRadius: '1rem',
          backgroundColor: BG_CARD,
          border: BORDER,
        }}
      >
        <h2 style={{ fontSize: '0.78rem', marginBottom: '0.9rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>
          Terapia seleccionada
        </h2>

        {terapias.length === 0 && <p style={{ margin: 0, color: TEXT_MUTED, fontSize: '0.95rem' }}>No hay terapias disponibles.</p>}

        {terapias.length > 0 && (
          <>
            <select
              value={terapiaSeleccionadaId ?? ''}
              onChange={(e) => setTerapiaSeleccionadaId(Number(e.target.value))}
              style={{ ...inputStyle, marginBottom: '0.75rem', cursor: 'pointer' }}
            >
              {terapias.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre} – ${t.precio} MXN</option>
              ))}
            </select>

            {terapiaSeleccionada && (
              <>
                <p style={{ margin: 0, color: TEXT_PRIMARY, fontWeight: 500 }}>{terapiaSeleccionada.nombre}</p>
                <p style={{ margin: '0.2rem 0', color: TEXT_SECONDARY, fontSize: '0.9rem' }}>{terapiaSeleccionada.descripcion ?? ''}</p>
                <p style={{ margin: 0, color: GOLD, fontWeight: 700, fontSize: '1.1rem' }}>${terapiaSeleccionada.precio} MXN</p>
              </>
            )}
          </>
        )}
      </section>

      {/* Horarios */}
      <section>
        <h2 style={{ fontSize: '0.78rem', marginBottom: '0.9rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>
          Horarios disponibles
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
          {horarios.map((hora) => {
            const activo = horaSeleccionada === hora;
            const ocupado = horariosOcupados.has(hora);
            return (
              <button
                key={hora}
                onClick={() => !ocupado && setHoraSeleccionada(hora)}
                disabled={ocupado}
                style={{
                  padding: '0.7rem 0.75rem',
                  borderRadius: '0.6rem',
                  border: activo ? `1px solid ${GOLD}` : BORDER,
                  backgroundColor: ocupado ? 'rgba(255,255,255,0.04)' : activo ? GOLD_SUBTLE : BG_CARD,
                  cursor: ocupado ? 'not-allowed' : 'pointer',
                  color: ocupado ? TEXT_MUTED : activo ? GOLD : TEXT_SECONDARY,
                  fontSize: '0.88rem',
                  fontWeight: activo ? 600 : 400,
                }}
              >
                {ocupado ? `${hora} ✕` : hora}
              </button>
            );
          })}
        </div>

        {horaSeleccionada && (
          <section
            style={{
              marginTop: '1.5rem',
              padding: '1.4rem 1.25rem',
              borderRadius: '1rem',
              backgroundColor: BG_CARD,
              border: BORDER,
            }}
          >
            <h2 style={{ fontSize: '0.78rem', marginBottom: '0.9rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>
              Datos para tu cita
            </h2>
            <p style={{ marginBottom: '1.2rem', color: TEXT_SECONDARY, fontSize: '0.9rem' }}>
              Cita para <strong style={{ color: TEXT_PRIMARY }}>{fechaTexto}</strong> a las <strong style={{ color: GOLD }}>{horaSeleccionada}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} />
              <input type="tel" placeholder="Teléfono / WhatsApp" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={inputStyle} />
              <input type="email" placeholder="Correo electrónico (opcional)" value={correo} onChange={(e) => setCorreo(e.target.value)} style={inputStyle} />

              <button
                onClick={confirmarCita}
                disabled={guardando}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: guardando ? TEXT_MUTED : `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  color: BG_DARK,
                  cursor: guardando ? 'default' : 'pointer',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: guardando ? 'none' : `0 4px 14px ${GOLD_GLOW}`,
                }}
              >
                {guardando ? 'Guardando…' : 'Confirmar cita'}
              </button>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}

// ─── Cart icon with hover preview ──────────────────────────────────────────────

function CarritoIcono({
  carrito,
  onClick,
}: {
  carrito: ItemCarrito[];
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();
  const cantidadTotal = carrito.reduce((s, i) => s + i.cantidad, 0);
  const subtotal = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => !isMobile && setHover(true)}
      onMouseLeave={() => !isMobile && setHover(false)}
    >
      <button
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.45rem 0.75rem',
          borderRadius: '999px',
          border: `1px solid ${cantidadTotal > 0 ? GOLD : 'rgba(196,163,90,0.35)'}`,
          backgroundColor: cantidadTotal > 0 ? GOLD_SUBTLE : 'transparent',
          color: cantidadTotal > 0 ? GOLD : TEXT_SECONDARY,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <FiShoppingCart size={17} />
        {cantidadTotal > 0 && (
          <span
            style={{
              minWidth: '18px',
              height: '18px',
              borderRadius: '999px',
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              color: BG_DARK,
              fontSize: '0.68rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
            }}
          >
            {cantidadTotal}
          </span>
        )}
      </button>

      {/* Dropdown preview — solo desktop */}
      {hover && !isMobile && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            width: '300px',
            borderRadius: '1rem',
            backgroundColor: BG_CARD,
            border: BORDER,
            boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px ${GOLD_GLOW}`,
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderBottom: BORDER_SUBTLE,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FiShoppingCart size={14} color={GOLD} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: TEXT_PRIMARY, letterSpacing: '0.05em' }}>
              Mi carrito
            </span>
          </div>

          {carrito.length === 0 ? (
            <div style={{ padding: '1.25rem 1.1rem', textAlign: 'center' }}>
              <p style={{ margin: 0, color: TEXT_MUTED, fontSize: '0.875rem' }}>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '0.5rem 0' }}>
                {carrito.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.55rem 1.1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '0.4rem',
                        backgroundColor: BG_CARD_ALT,
                        flexShrink: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {item.imagenUrl ? (
                        <img src={item.imagenUrl} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: TEXT_MUTED }}>◆</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: TEXT_PRIMARY, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.nombre}
                      </p>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.78rem', color: TEXT_MUTED }}>
                        {item.cantidad} × ${item.precio.toLocaleString('es-MX')}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: GOLD, flexShrink: 0 }}>
                      ${(item.precio * item.cantidad).toLocaleString('es-MX')}
                    </span>
                  </div>
                ))}
                {carrito.length > 4 && (
                  <p style={{ margin: 0, padding: '0.4rem 1.1rem', fontSize: '0.78rem', color: TEXT_MUTED }}>
                    +{carrito.length - 4} producto{carrito.length - 4 !== 1 ? 's' : ''} más…
                  </p>
                )}
              </div>

              <div
                style={{
                  borderTop: BORDER_SUBTLE,
                  padding: '0.85rem 1.1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: TEXT_MUTED }}>Total</p>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: GOLD }}>
                    ${subtotal.toLocaleString('es-MX')} <span style={{ fontSize: '0.72rem', fontWeight: 400, color: TEXT_MUTED }}>MXN</span>
                  </p>
                </div>
                <button
                  onClick={onClick}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '999px',
                    border: 'none',
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                    color: BG_DARK,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: `0 4px 12px ${GOLD_GLOW}`,
                  }}
                >
                  Ver carrito
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────

function App() {
  const isMobile = useIsMobile();

  const [carrito, setCarrito] = useState<ItemCarrito[]>(() => {
    try {
      const stored = localStorage.getItem(CARRITO_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [vista, setVista] = useState<Vista>('home');
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    } catch { /* sin localStorage */ }
  }, [carrito]);

  // Cerrar menú al cambiar de vista
  function irA(nuevaVista: Vista) {
    setVista(nuevaVista);
    setMenuAbierto(false);
  }

  function agregarAlCarrito(item: Omit<ItemCarrito, 'cantidad'>) {
    setCarrito((prev) => {
      const ex = prev.find((i) => i.id === item.id);
      if (ex) return prev.map((i) => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...item, cantidad: 1 }];
    });
  }

  function cambiarCantidad(id: number, delta: number) {
    setCarrito((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
        .filter((i) => i.cantidad > 0),
    );
  }

  function eliminarDelCarrito(id: number) {
    setCarrito((prev) => prev.filter((i) => i.id !== id));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const navItems = [
    { key: 'home', label: 'Inicio' },
    { key: 'tienda', label: 'Tienda' },
    { key: 'citas', label: 'Citas' },
    { key: 'citas-calendario', label: 'Calendario' },
    { key: 'lista', label: 'Productos' },
    { key: 'nuevo', label: 'Nuevo producto' },
  ] as const;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG_DARK }}>

      {/* ── Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: `${BG_DARK}ee`,
          backdropFilter: 'blur(12px)',
          borderBottom: BORDER,
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: isMobile ? '0.5rem 1rem' : '0.75rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="/logo-h2aqua.png" alt="H2AQUA" style={{ height: isMobile ? '52px' : '80px', width: 'auto' }} />
          </div>

          {/* Desktop: Nav + Carrito */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setVista(item.key)}
                    style={{
                      border: 'none',
                      background: vista === item.key ? GOLD_SUBTLE : 'transparent',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      color: vista === item.key ? GOLD : TEXT_SECONDARY,
                      fontWeight: vista === item.key ? 600 : 400,
                      fontSize: '0.82rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div style={{ width: '1px', height: '20px', backgroundColor: BORDER, margin: '0 0.25rem' }} />

              <CarritoIcono carrito={carrito} onClick={() => setVista('carrito')} />
            </div>
          )}

          {/* Mobile: Carrito + Hamburguesa */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CarritoIcono carrito={carrito} onClick={() => irA('carrito')} />
              <button
                onClick={() => setMenuAbierto((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '0.5rem',
                  border: BORDER,
                  backgroundColor: 'transparent',
                  color: TEXT_PRIMARY,
                  cursor: 'pointer',
                }}
              >
                {menuAbierto ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile: menú desplegable */}
        {isMobile && menuAbierto && (
          <div
            style={{
              backgroundColor: BG_CARD,
              borderTop: BORDER_SUBTLE,
              padding: '0.75rem 1rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => irA(item.key)}
                style={{
                  border: 'none',
                  background: vista === item.key ? GOLD_SUBTLE : 'transparent',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.6rem',
                  cursor: 'pointer',
                  color: vista === item.key ? GOLD : TEXT_SECONDARY,
                  fontWeight: vista === item.key ? 600 : 400,
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main style={{ padding: isMobile ? '0 1rem' : '0 2rem' }}>
        {vista === 'home'             && <Home irA={irA} />}
        {vista === 'citas'            && <Citas />}
        {vista === 'lista'            && <Productos />}
        {vista === 'nuevo'            && <NuevoProducto />}
        {vista === 'citas-calendario' && <CitasCalendarioAdmin />}
        {vista === 'tienda'           && (
          <TiendaProductos
            carrito={carrito}
            onAgregarAlCarrito={agregarAlCarrito}
          />
        )}
        {vista === 'carrito'          && (
          <Carrito
            carrito={carrito}
            onCambiarCantidad={cambiarCantidad}
            onEliminar={eliminarDelCarrito}
            onVaciar={vaciarCarrito}
            onSeguirComprando={() => setVista('tienda')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
