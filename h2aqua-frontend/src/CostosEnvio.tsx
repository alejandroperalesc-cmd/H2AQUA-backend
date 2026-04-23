import { useState, useEffect } from 'react';
import { API_URL } from './api';
import {
  BG_CARD, BG_CARD_ALT,
  GOLD, GOLD_LIGHT, GOLD_GLOW,
  TEAL,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER,
} from './theme';

interface CostoEnvio {
  id: number;
  estado: string;
  costo: number;
  activo: boolean;
}

export default function CostosEnvio() {
  const [costos, setCostos] = useState<CostoEnvio[]>([]);
  const [editando, setEditando] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/costos-envio?todos=1`)
      .then((r) => r.json())
      .then((data: CostoEnvio[]) => {
        setCostos(data);
        const init: Record<string, string> = {};
        data.forEach((c) => { init[c.estado] = String(c.costo); });
        setEditando(init);
      })
      .catch(() => {});
  }, []);

  async function guardar(estado: string) {
    const costo = Number(editando[estado]);
    if (isNaN(costo) || costo < 0) return;
    setGuardando(estado);
    try {
      const res = await fetch(`${API_URL}/costos-envio/${encodeURIComponent(estado)}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ costo }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      const updated: CostoEnvio = await res.json();
      setCostos((prev) => prev.map((c) => (c.estado === estado ? updated : c)));
      setSaved(estado);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      alert('No se pudo guardar el costo. Intenta de nuevo.');
    } finally {
      setGuardando(null);
    }
  }

  async function toggleActivo(estado: string, activo: boolean) {
    setToggling(estado);
    try {
      const res = await fetch(`${API_URL}/costos-envio/${encodeURIComponent(estado)}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ activo }),
      });
      if (!res.ok) throw new Error();
      const updated: CostoEnvio = await res.json();
      setCostos((prev) => prev.map((c) => (c.estado === estado ? updated : c)));
    } catch {
      alert('No se pudo actualizar el estado. Intenta de nuevo.');
    } finally {
      setToggling(null);
    }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 0 4rem' }}>

      <header style={{ marginBottom: '1.75rem' }}>
        <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
          Administración
        </p>
        <h1 style={{ fontSize: '2rem', color: TEXT_PRIMARY, fontWeight: 300, letterSpacing: '0.04em' }}>
          Costos de envío
        </h1>
        <p style={{ margin: '0.4rem 0 0', color: TEXT_SECONDARY, fontSize: '0.95rem' }}>
          Configura el costo de envío por estado. Los clientes verán este monto al seleccionar su estado en el checkout.
        </p>
      </header>

      <div
        style={{
          borderRadius: '1.25rem',
          backgroundColor: BG_CARD,
          border: BORDER,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 160px 100px 56px',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: BG_CARD_ALT,
            borderBottom: BORDER,
          }}
        >
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT_MUTED, fontWeight: 600 }}>Estado</span>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT_MUTED, fontWeight: 600 }}>Costo (MXN)</span>
          <span></span>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT_MUTED, fontWeight: 600, textAlign: 'center' }}>Activo</span>
        </div>

        {costos.map((c, idx) => {
          const isGuardando = guardando === c.estado;
          const isToggling  = toggling  === c.estado;
          const isSaved     = saved     === c.estado;
          const valorActual = editando[c.estado] ?? String(c.costo);
          const hayCambio   = Number(valorActual) !== c.costo;

          return (
            <div
              key={c.estado}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 160px 100px 56px',
                gap: '0.5rem',
                alignItems: 'center',
                padding: '0.65rem 1.5rem',
                borderBottom: idx < costos.length - 1 ? BORDER : 'none',
                backgroundColor: isSaved ? `${TEAL}08` : 'transparent',
                opacity: c.activo ? 1 : 0.45,
                transition: 'background-color 0.4s, opacity 0.2s',
              }}
            >
              <span style={{ color: TEXT_PRIMARY, fontSize: '0.9rem' }}>{c.estado}</span>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: TEXT_MUTED, fontSize: '0.85rem', pointerEvents: 'none' }}>$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={valorActual}
                  onChange={(e) => setEditando((prev) => ({ ...prev, [c.estado]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && hayCambio && !isGuardando && guardar(c.estado)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 1.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${hayCambio ? TEAL : BORDER}`,
                    backgroundColor: BG_CARD_ALT,
                    color: TEXT_PRIMARY,
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                />
              </div>

              <button
                onClick={() => guardar(c.estado)}
                disabled={isGuardando || !hayCambio}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: isSaved
                    ? `${TEAL}22`
                    : hayCambio && !isGuardando
                    ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`
                    : 'transparent',
                  color: isSaved ? TEAL : hayCambio && !isGuardando ? '#fff' : TEXT_MUTED,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: hayCambio && !isGuardando ? 'pointer' : 'default',
                  boxShadow: hayCambio && !isGuardando ? `0 2px 8px ${GOLD_GLOW}` : 'none',
                  transition: 'all 0.2s',
                  letterSpacing: '0.02em',
                }}
              >
                {isGuardando ? '…' : isSaved ? '✓ Guardado' : 'Guardar'}
              </button>

              {/* Toggle activo */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => !isToggling && toggleActivo(c.estado, !c.activo)}
                  title={c.activo ? 'Desactivar estado' : 'Activar estado'}
                  style={{
                    width: '38px', height: '22px', borderRadius: '11px', border: 'none',
                    backgroundColor: c.activo ? TEAL : BORDER,
                    cursor: isToggling ? 'wait' : 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s',
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute', top: '3px',
                    left: c.activo ? '19px' : '3px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    backgroundColor: '#fff',
                    transition: 'left 0.2s',
                    display: 'block',
                  }} />
                </button>
              </div>
            </div>
          );
        })}

        {costos.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: TEXT_MUTED, fontSize: '0.9rem' }}>
            Cargando estados…
          </div>
        )}
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: TEXT_MUTED, textAlign: 'center' }}>
        Los estados con costo $0 mostrarán "Gratis" en el checkout.
      </p>
    </div>
  );
}
