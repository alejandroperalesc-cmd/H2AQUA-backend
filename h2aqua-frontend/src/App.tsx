import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Productos from './Productos';
import NuevoProducto from './NuevoProducto';
import TiendaProductos from './TiendaProductos';
import CitasCalendarioAdmin from './CitasCalendarioAdmin';
import { FiShoppingCart } from 'react-icons/fi';

type Vista = 'home' | 'lista' | 'nuevo' | 'tienda' | 'citas' | 'citas-calendario';

export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

// Paleta de colores (ajustada a look wellness)
const COLOR_TIFFANY = '#00B7C4';
const COLOR_TURQUESA_CLARO = '#9DE7D7';
const COLOR_FONDO = '#FFFFFF';

// Texto
const COLOR_TEXTO_TITULO = '#0E7490';
const COLOR_TEXTO = '#1F2933';
const COLOR_TEXTO_SUAVE = '#6B7280';

const API_URL = 'http://localhost:3000';

function Home({ irA }: { irA: (vista: Vista) => void }) {
  return (
    <div
      style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '2.5rem 0 4rem',
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: 'relative',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          minHeight: '380px',
          marginBottom: '3rem',
          backgroundColor: COLOR_TIFFANY,
          backgroundImage: 'url("/hero-hidrogeno.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(120deg, rgba(9, 20, 35, 0.65), rgba(9, 20, 35, 0.25))',
          }}
        />

        <div
          style={{
            position: 'relative',
            padding: '3rem',
            maxWidth: '520px',
            color: 'white',
          }}
        >
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontSize: '0.8rem',
              marginBottom: '0.6rem',
              opacity: 0.9,
            }}
          >
            Hidrógeno molecular · Wellness
          </p>

          <h1
            style={{
              fontSize: '2.6rem',
              fontWeight: 300,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            Bienestar profundo
            <br />
            con hidrógeno molecular
          </h1>

          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              opacity: 0.92,
              marginBottom: '1.6rem',
            }}
          >
            Terapias que ayudan a desinflamar, desintoxicar y equilibrar tu
            cuerpo desde adentro, neutralizando radicales libres y protegiendo tus células.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => irA('tienda')}
              style={{
                padding: '0.85rem 1.9rem',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: COLOR_TURQUESA_CLARO,
                color: COLOR_TEXTO,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.95rem',
              }}
            >
              Ver tienda en línea
            </button>
            <button
              onClick={() => irA('citas')}
              style={{
                padding: '0.85rem 1.9rem',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.7)',
                backgroundColor: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 400,
                fontSize: '0.95rem',
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
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '3rem',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.6rem',
              marginBottom: '0.75rem',
              color: COLOR_TEXTO_TITULO,
            }}
          >
            ¿Qué es el hidrógeno molecular?
          </h2>
          <p
            style={{
              marginBottom: '0.75rem',
              color: COLOR_TEXTO_SUAVE,
              fontSize: '0.98rem',
              lineHeight: 1.7,
            }}
          >
            Es la molécula más pequeña que existe y puede llegar a tejidos y células
            a través del torrente sanguíneo. Actúa como antioxidante y antiinflamatorio.
          </p>
          <p
            style={{
              color: COLOR_TEXTO_SUAVE,
              fontSize: '0.98rem',
              lineHeight: 1.7,
            }}
          >
            En H2Aqua utilizamos terapias de hidrógeno molecular para apoyar procesos
            de desinflamación, desintoxicación y equilibrio general.
          </p>
        </div>

        <div
          style={{
            borderRadius: '1.25rem',
            padding: '1.4rem 1.6rem',
            background:
              'linear-gradient(145deg, rgba(157, 231, 215, 0.22), rgba(129, 216, 208, 0.12))',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3
            style={{
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '0.5rem',
              color: COLOR_TEXTO_TITULO,
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
              rowGap: '0.4rem',
              fontSize: '0.9rem',
              color: COLOR_TEXTO_SUAVE,
            }}
          >
            <li>• Disminución de dolor e inflamación articular.</li>
            <li>• Mejora del descanso, energía y claridad mental.</li>
            <li>• Apoyo al sistema inmune y recuperación física.</li>
            <li>• Piel más hidratada y aspecto más luminoso.</li>
          </ul>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        style={{
          borderRadius: '1.25rem',
          padding: '1.8rem 2rem',
          background:
            'linear-gradient(135deg, rgba(157, 231, 215, 0.35), rgba(129, 216, 208, 0.18))',
          border: '1px solid #d1fae5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.3rem',
              marginBottom: '0.4rem',
              color: COLOR_TEXTO_TITULO,
            }}
          >
            Regálale a tu cuerpo una pausa profunda
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '0.95rem',
              color: COLOR_TEXTO_SUAVE,
            }}
          >
            Agenda tu sesión de hidrógeno molecular y comienza a sentir los beneficios.
          </p>
        </div>

        <button
          onClick={() => irA('citas')}
          style={{
            padding: '0.8rem 1.8rem',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: COLOR_TIFFANY,
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
          }}
        >
          Agenda tu cita
        </button>
      </section>
    </div>
  );
}

// ===== Tipos auxiliares citas =====

type CitaApi = {
  id: number;
  fechaHora: string;
  estado: string;
};

type TerapiaApi = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
};

// ================= Citas (cliente) =================

function Citas() {
  const [fecha, setFecha] = useState<Date>(new Date());

  const fechaTexto = fecha.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

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
      if (!resp.ok) throw new Error('Error al obtener citas');
      const data: CitaApi[] = await resp.json();
      setCitasBackend(data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargandoCitas(false);
    }
  }

  async function cargarTerapias() {
    try {
      const resp = await fetch(`${API_URL}/terapias-disponibles`);
      if (!resp.ok) throw new Error('Error al obtener terapias');
      const data: TerapiaApi[] = await resp.json();
      setTerapias(data);
      if (data.length > 0) setTerapiaSeleccionadaId(data[0].id);
    } catch (e) {
      console.error(e);
      alert('No se pudieron cargar las terapias disponibles.');
    }
  }

  useEffect(() => {
    cargarCitas();
    cargarTerapias();
  }, []);

  const fechaKey = fecha.toISOString().slice(0, 10);
  const horariosOcupados = new Set(
    citasBackend
      .filter(
        (c) =>
          c.fechaHora.slice(0, 10) === fechaKey &&
          c.estado !== 'CANCELADA',
      )
      .map((c) =>
        new Date(c.fechaHora).toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      ),
  );

  async function confirmarCita() {
    if (!horaSeleccionada || !nombre || !telefono) {
      alert('Por favor llena nombre, teléfono y selecciona un horario.');
      return;
    }

    if (!terapiaSeleccionadaId) {
      alert('Por favor elige una terapia.');
      return;
    }

    if (horariosOcupados.has(horaSeleccionada)) {
      alert('Ese horario ya está ocupado, elige otro por favor.');
      return;
    }

    try {
      setGuardando(true);

      const [horaStr, minutoStr] = horaSeleccionada.split(':');
      const fechaHora = new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate(),
        parseInt(horaStr, 10),
        parseInt(minutoStr, 10),
        0,
      ).toISOString();

      const terapia = terapias.find((t) => t.id === terapiaSeleccionadaId);

      const resp = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaHora,
          clienteId: 1,   // fijo por ahora
          servicioId: 1,  // fijo por ahora
          notas: `Nombre: ${nombre}, Tel: ${telefono}, Correo: ${
            correo || 'N/A'
          }, Terapia: ${terapia?.nombre ?? ''}`,
          estado: 'PENDIENTE',
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Error al crear cita:', errorText);
        alert('No se pudo guardar la cita. Intenta más tarde.');
        return;
      }

      alert(
        `Cita reservada para ${nombre} el ${fechaTexto} a las ${horaSeleccionada}.`,
      );

      await cargarCitas();

      setHoraSeleccionada(null);
      setNombre('');
      setTelefono('');
      setCorreo('');
    } catch (e) {
      console.error(e);
      alert('No se pudo guardar la cita. Intenta más tarde.');
    } finally {
      setGuardando(false);
    }
  }

  const terapiaSeleccionada =
    terapias.find((t) => t.id === terapiaSeleccionadaId) ?? null;

  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '2.5rem 0 4rem',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          marginBottom: '0.5rem',
          color: COLOR_TEXTO,
        }}
      >
        Agenda tu cita
      </h1>

      <p
        style={{
          marginBottom: '1rem',
          color: COLOR_TEXTO_SUAVE,
        }}
      >
        Elige tu terapia, día y horario.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <Calendar
          value={fecha}
          onChange={(value) => {
            const nuevaFecha = Array.isArray(value) ? value[0] : value;
            if (nuevaFecha instanceof Date) {
              setFecha(nuevaFecha);
              setHoraSeleccionada(null);
            }
          }}
        />
        <div>
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              color: COLOR_TEXTO_SUAVE,
            }}
          >
            Fecha seleccionada:
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 500,
              color: COLOR_TEXTO,
            }}
          >
            {fechaTexto}
          </p>
          {cargandoCitas && (
            <p
              style={{
                marginTop: '0.5rem',
                fontSize: '0.85rem',
                color: COLOR_TEXTO_SUAVE,
              }}
            >
              Actualizando horarios...
            </p>
          )}
        </div>
      </div>

      {/* Selector de terapia */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1.25rem 1.5rem',
          borderRadius: '1rem',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
        }}
      >
        <h2
          style={{
            fontSize: '1.05rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: COLOR_TEXTO,
          }}
        >
          Terapia seleccionada
        </h2>

        {terapias.length === 0 && (
          <p
            style={{
              margin: 0,
              color: COLOR_TEXTO_SUAVE,
              fontSize: '0.95rem',
            }}
          >
            No hay terapias disponibles por el momento.
          </p>
        )}

        {terapias.length > 0 && (
          <>
            <select
              value={terapiaSeleccionadaId ?? ''}
              onChange={(e) => setTerapiaSeleccionadaId(Number(e.target.value))}
              style={{
                marginBottom: '0.75rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.95rem',
                width: '100%',
              }}
            >
              {terapias.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} – ${t.precio} MXN
                </option>
              ))}
            </select>

            {terapiaSeleccionada && (
              <>
                <p
                  style={{
                    marginBottom: '0.25rem',
                    color: COLOR_TEXTO,
                    fontWeight: 500,
                  }}
                >
                  {terapiaSeleccionada.nombre}
                </p>
                <p
                  style={{
                    marginBottom: '0.25rem',
                    color: COLOR_TEXTO_SUAVE,
                    fontSize: '0.95rem',
                  }}
                >
                  {terapiaSeleccionada.descripcion ?? ''}
                </p>
                <p
                  style={{
                    color: COLOR_TEXTO,
                    fontWeight: 600,
                  }}
                >
                  ${terapiaSeleccionada.precio} MXN
                </p>
              </>
            )}
          </>
        )}
      </section>

      {/* Horarios y datos cliente */}
      <section>
        <h2
          style={{
            fontSize: '1.05rem',
            marginBottom: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: COLOR_TEXTO,
          }}
        >
          Horarios disponibles
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {horarios.map((hora) => {
            const activo = horaSeleccionada === hora;
            const ocupado = horariosOcupados.has(hora);

            return (
              <button
                key={hora}
                onClick={() => !ocupado && setHoraSeleccionada(hora)}
                disabled={ocupado}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '999px',
                  border: activo
                    ? `1px solid ${COLOR_TIFFANY}`
                    : '1px solid #d1d5db',
                  backgroundColor: ocupado
                    ? '#f3f4f6'
                    : activo
                    ? COLOR_TURQUESA_CLARO
                    : 'white',
                  cursor: ocupado ? 'not-allowed' : 'pointer',
                  color: ocupado ? '#9ca3af' : COLOR_TEXTO,
                  fontSize: '0.95rem',
                }}
              >
                {ocupado ? `${hora} (ocupado)` : hora}
              </button>
            );
          })}
        </div>

        {horaSeleccionada && (
          <section
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              borderRadius: '1rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
            }}
          >
            <h2
              style={{
                fontSize: '1.05rem',
                marginBottom: '0.75rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: COLOR_TEXTO,
              }}
            >
              Datos para tu cita
            </h2>

            <p
              style={{
                marginBottom: '1rem',
                color: COLOR_TEXTO_SUAVE,
                fontSize: '0.95rem',
              }}
            >
              Cita para {fechaTexto} a las {horaSeleccionada}.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <input
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                }}
              />

              <input
                type="tel"
                placeholder="Teléfono / WhatsApp"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                }}
              />

              <input
                type="email"
                placeholder="Correo electrónico (opcional)"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                }}
              />

              <button
                onClick={confirmarCita}
                disabled={guardando}
                style={{
                  marginTop: '0.5rem',
                  alignSelf: 'flex-start',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: guardando ? '#9ca3af' : COLOR_TURQUESA_CLARO,
                  color: 'white',
                  cursor: guardando ? 'default' : 'pointer',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }}
              >
                {guardando ? 'Guardando...' : 'Confirmar cita'}
              </button>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}

// ================= App =================

function App() {
  const [vista, setVista] = useState<Vista>('home');
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  function irA(nuevaVista: Vista) {
    setVista(nuevaVista);
  }

  function agregarAlCarrito(item: Omit<ItemCarrito, 'cantidad'>) {
    setCarrito((prev) => {
      const existente = prev.find((i) => i.id === item.id);
      if (existente) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i,
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  }

  const totalCarrito = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0,
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLOR_FONDO,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backgroundColor: COLOR_FONDO,
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '1.1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginRight: '2.5rem',
            }}
          >
            <img
              src="/logo-h2aqua.png"
              alt="H2AQUA"
              style={{ height: '250px', width: 'auto' }}
            />
          </div>

          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: COLOR_TEXTO_SUAVE,
            }}
          >
            {[
              { key: 'home', label: 'Inicio' },
              { key: 'tienda', label: 'Tienda en línea' },
              { key: 'citas', label: 'Citas' },
              { key: 'citas-calendario', label: 'Calendario citas' },
              { key: 'lista', label: 'Panel de productos' },
              { key: 'nuevo', label: 'Nuevo producto' },
            ].map((item, index, arr) => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.75rem',
                }}
              >
                <button
                  onClick={() => setVista(item.key as Vista)}
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: vista === item.key ? COLOR_TIFFANY : COLOR_TEXTO_SUAVE,
                    fontWeight: vista === item.key ? 600 : 400,
                  }}
                >
                  {item.label}
                </button>
                {index < arr.length - 1 && (
                  <span
                    style={{
                      width: '1px',
                      height: '18px',
                      backgroundColor: '#e5e7eb',
                    }}
                  />
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {vista !== 'tienda' && (
        <button
          onClick={() => setVista('tienda')}
          style={{
            position: 'fixed',
            top: '1.2rem',
            right: '1.5rem',
            zIndex: 30,
            padding: '0.55rem 0.65rem',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: COLOR_TURQUESA_CLARO,
            boxShadow: '0 10px 25px rgba(15,23,42,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            color: '#0F172A',
          }}
        >
          <FiShoppingCart size={20} />
          {carrito.length > 0 && (
            <span
              style={{
                minWidth: '20px',
                height: '20px',
                borderRadius: '999px',
                backgroundColor: '#ffffff',
                color: '#0F172A',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {carrito.length}
            </span>
          )}
        </button>
      )}

      <main style={{ padding: '0 2rem' }}>
        {vista === 'home' && <Home irA={irA} />}
        {vista === 'citas' && <Citas />}
        {vista === 'lista' && <Productos />}
        {vista === 'nuevo' && <NuevoProducto />}
        {vista === 'citas-calendario' && <CitasCalendarioAdmin />}
        {vista === 'tienda' && (
          <TiendaProductos
            carrito={carrito}
            onAgregarAlCarrito={agregarAlCarrito}
          />
        )}
      </main>

      {carrito.length > 0 && (
        <div
          style={{
            position: 'fixed',
            right: '1.5rem',
            bottom: '1.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            backgroundColor: COLOR_TURQUESA_CLARO,
            color: '#fff',
            boxShadow: '0 10px 30px rgba(15,23,42,0.2)',
          }}
        >
          {carrito.length} ítems · Total ${totalCarrito}
        </div>
      )}
    </div>
  );
}

export default App;