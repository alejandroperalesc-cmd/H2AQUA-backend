import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const API_URL = 'http://localhost:3000';

type CitaApi = {
  id: number;
  fechaHora: string;
  estado: string;
  notas?: string | null;
  cliente: {
    nombre: string;
  };
  servicio: {
    nombre: string;
  };
};

function CitasCalendarioAdmin() {
  const [citas, setCitas] = useState<CitaApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());

  async function cargarCitas() {
    try {
      setCargando(true);
      setError(null);

      const resp = await fetch(`${API_URL}/citas`);
      if (!resp.ok) {
        throw new Error('Error al obtener citas');
      }
      const data: CitaApi[] = await resp.json();
      setCitas(data);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar las citas');
    } finally {
      setCargando(false);
    }
  }
  async function actualizarEstadoCita(id: number, nuevoEstado: string) {
  try {
    const resp = await fetch(`${API_URL}/citas/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Error al actualizar estado de cita:', errorText);
      alert('No se pudo actualizar el estado de la cita.');
      return;
    }

    // Refrescar lista de citas para ver el cambio
    await cargarCitas();
  } catch (e) {
    console.error(e);
    alert('No se pudo actualizar el estado de la cita.');
  }
}

  useEffect(() => {
    cargarCitas();
  }, []);

  function toKey(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  const citasPorDia = citas.reduce<Record<string, CitaApi[]>>((acc, cita) => {
    const key = cita.fechaHora.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(cita);
    return acc;
  }, {});


  const keySeleccionado = toKey(fechaSeleccionada);
  const citasDelDia = citasPorDia[keySeleccionado] ?? [];

  if (cargando) {
    return (
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '2.5rem 0 4rem',
        }}
      >
        <p>Cargando citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '2.5rem 0 4rem',
        }}
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '2.5rem 0 4rem',
      }}
    >
      <header
        style={{
          marginBottom: '1.5rem',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '0.25rem',
            color: '#111827',
          }}
        >
          Calendario de citas
        </h1>
        <p
          style={{
            margin: 0,
            color: '#4B5563',
            fontSize: '0.98rem',
          }}
        >
          Visualiza todas las citas agendadas por día.
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '2rem',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <Calendar
            value={fechaSeleccionada}
            onChange={(value) => {
              const nuevaFecha = Array.isArray(value) ? value[0] : value;
              if (nuevaFecha instanceof Date) {
                setFechaSeleccionada(nuevaFecha);
              }
            }}
            tileContent={({ date, view }) => {
              if (view !== 'month') return null;
              const key = toKey(date);
              const citasDia = citasPorDia[key];
              if (!citasDia || citasDia.length === 0) return null;

              return (
                <div
                  style={{
                    marginTop: 2,
                    width: 6,
                    height: 6,
                    borderRadius: '999px',
                    backgroundColor: '#81D8D0',
                    marginInline: 'auto',
                  }}
                />
              );
            }}
          />
        </div>

        <div>
          <h2
            style={{
              fontSize: '1.05rem',
              marginBottom: '0.75rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#111827',
            }}
          >
            Citas para{' '}
            {fechaSeleccionada.toLocaleDateString('es-MX', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h2>

          {citasDelDia.length === 0 && (
            <p
              style={{
                margin: 0,
                color: '#6B7280',
              }}
            >
              No hay citas agendadas para este día.
            </p>
          )}

          {citasDelDia.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {citasDelDia
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.fechaHora).getTime() -
                    new Date(b.fechaHora).getTime(),
                )
                .map((cita) => {
                  const fecha = new Date(cita.fechaHora);
                  const hora = fecha.toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const colorEstado =
                    cita.estado === 'CONFIRMADA'
                        ? '#16a34a'
                        : cita.estado === 'CANCELADA'
                        ? '#b91c1c'
                        : cita.estado === 'COMPLETADA'
                        ? '#2563eb'
                        : '#92400e';
                        
                  return (
                    <article
                      key={cita.id}
                      style={{
                        padding: '0.9rem 1.1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        boxShadow:
                          '0 10px 20px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.02)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                        }}
                      >
                        <div>
                          <p
                          style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#111827',
                          }}
                        >
                          {hora}
                        </p>

                          <p
                            style={{
                              margin: '0.15rem 0 0',
                              fontSize: '0.9rem',
                              color: '#4B5563',
                            }}
                          >
                            {cita.servicio.nombre}
                          </p>
                        </div>

                        <select
                          value={cita.estado}
                          disabled={cita.estado === 'CANCELADA'}
                          onChange={(e) => actualizarEstadoCita(cita.id, e.target.value)}
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            border: '1px solid #d1d5db',
                            backgroundColor: cita.estado === 'CANCELADA' ? '#fee2e2' : '#ffffff',
                            color: colorEstado,
                            textTransform: 'uppercase',
                            cursor: cita.estado === 'CANCELADA' ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="CONFIRMADA">Confirmada</option>
                          <option value="CANCELADA">Cancelada</option>
                          <option value="COMPLETADA">Completada</option>
                        </select>


                      </div>

                      {cita.notas && (
                        <p
                          style={{
                            margin: '0.45rem 0 0',
                            fontSize: '0.85rem',
                            color: '#6B7280',
                          }}
                        >
                          {cita.notas}
                        </p>
                      )}
                    </article>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CitasCalendarioAdmin;
