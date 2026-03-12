import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { API_URL } from './api';
import {
  BG_CARD,
  GOLD,
  TEAL,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER,
  SUCCESS, ERROR, WARNING,
} from './theme';

type CitaApi = {
  id: number;
  fechaHora: string;
  estado: string;
  notas?: string | null;
  cliente: { nombre: string };
  servicio: { nombre: string };
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
      if (!resp.ok) throw new Error();
      setCitas(await resp.json());
    } catch {
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
      if (!resp.ok) { alert('No se pudo actualizar el estado de la cita.'); return; }
      await cargarCitas();
    } catch {
      alert('No se pudo actualizar el estado de la cita.');
    }
  }

  useEffect(() => { cargarCitas(); }, []);

  function toKey(date: Date) { return date.toISOString().slice(0, 10); }

  const citasPorDia = citas.reduce<Record<string, CitaApi[]>>((acc, cita) => {
    const key = cita.fechaHora.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(cita);
    return acc;
  }, {});

  const keySeleccionado = toKey(fechaSeleccionada);
  const citasDelDia = citasPorDia[keySeleccionado] ?? [];

  const colorEstado = (estado: string) => {
    if (estado === 'CONFIRMADA') return SUCCESS;
    if (estado === 'CANCELADA') return ERROR;
    if (estado === 'COMPLETADA') return TEAL;
    return WARNING;
  };

  if (cargando) return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 0 4rem' }}>
      <p style={{ color: TEXT_MUTED }}>Cargando citas…</p>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 0 4rem' }}>
      <p style={{ color: ERROR }}>{error}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '2.5rem 0 4rem' }}>

      <header style={{ marginBottom: '2rem' }}>
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
          Administración
        </p>
        <h1 style={{ fontSize: '2rem', color: TEXT_PRIMARY, fontWeight: 300, letterSpacing: '0.04em' }}>
          Calendario de citas
        </h1>
        <p style={{ margin: '0.4rem 0 0', color: TEXT_SECONDARY, fontSize: '0.95rem' }}>
          Visualiza y gestiona todas las citas agendadas por día.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'flex-start' }}>

        {/* Calendario */}
        <div>
          <Calendar
            value={fechaSeleccionada}
            onChange={(value) => {
              const d = Array.isArray(value) ? value[0] : value;
              if (d instanceof Date) setFechaSeleccionada(d);
            }}
            tileContent={({ date, view }) => {
              if (view !== 'month') return null;
              const citasDia = citasPorDia[toKey(date)];
              if (!citasDia?.length) return null;
              return (
                <div
                  style={{
                    marginTop: 3,
                    width: 5,
                    height: 5,
                    borderRadius: '999px',
                    backgroundColor: GOLD,
                    marginInline: 'auto',
                  }}
                />
              );
            }}
          />
        </div>

        {/* Lista del día */}
        <div>
          <h2
            style={{
              fontSize: '0.8rem',
              marginBottom: '1rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: GOLD,
            }}
          >
            Citas · {fechaSeleccionada.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>

          {citasDelDia.length === 0 && (
            <p style={{ margin: 0, color: TEXT_MUTED, fontSize: '0.95rem' }}>
              No hay citas agendadas para este día.
            </p>
          )}

          {citasDelDia.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {citasDelDia
                .slice()
                .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
                .map((cita) => {
                  const hora = new Date(cita.fechaHora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <article
                      key={cita.id}
                      style={{
                        padding: '1rem 1.2rem',
                        borderRadius: '0.9rem',
                        border: BORDER,
                        backgroundColor: BG_CARD,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: GOLD }}>
                            {hora}
                          </p>
                          <p style={{ margin: '0.15rem 0 0', fontSize: '0.88rem', color: TEXT_SECONDARY }}>
                            {cita.servicio.nombre}
                          </p>
                        </div>

                        <select
                          value={cita.estado}
                          disabled={cita.estado === 'CANCELADA'}
                          onChange={(e) => actualizarEstadoCita(cita.id, e.target.value)}
                          style={{
                            padding: '0.3rem 0.7rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            border: `1px solid ${colorEstado(cita.estado)}`,
                            backgroundColor: `${colorEstado(cita.estado)}22`,
                            color: colorEstado(cita.estado),
                            textTransform: 'uppercase',
                            cursor: cita.estado === 'CANCELADA' ? 'not-allowed' : 'pointer',
                            letterSpacing: '0.06em',
                            outline: 'none',
                          }}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="CONFIRMADA">Confirmada</option>
                          <option value="CANCELADA">Cancelada</option>
                          <option value="COMPLETADA">Completada</option>
                        </select>
                      </div>

                      {cita.notas && (
                        <p style={{ margin: '0.6rem 0 0', fontSize: '0.85rem', color: TEXT_SECONDARY, lineHeight: 1.5 }}>
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
