import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { API_URL } from './api';
import { SECCIONES } from './secciones';
import {
  BG_CARD, BG_CARD_ALT,
  GOLD, GOLD_LIGHT, GOLD_GLOW, GOLD_SUBTLE,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER,
  SUCCESS, ERROR,
} from './theme';

// ── Tipos ──────────────────────────────────────────────────────────────────────

interface FilaExcel {
  NOMBRE: string;
  DESCRIPCION: string;
  PRECIO: number;
  STOCK: number;
  TIPO_PRODUCTO: string; // ITEM | TERAPIA
  SECCION: number;
  IMAGEN_URL: string;
}

type EstadoFila = 'pendiente' | 'subiendo' | 'ok' | 'error';

interface FilaResultado extends FilaExcel {
  _idx: number;
  _estado: EstadoFila;
  _mensaje: string;
}


// ── Descarga de plantilla ─────────────────────────────────────────────────────

function descargarPlantilla() {
  const wb = XLSX.utils.book_new();

  // Hoja de productos
  const headers = ['NOMBRE', 'DESCRIPCION', 'PRECIO', 'STOCK', 'TIPO_PRODUCTO', 'SECCION', 'IMAGEN_URL'];
  const ejemplo = [
    'Agua de hidrógeno 500ml',
    'Botella de agua con hidrógeno molecular',
    250,
    50,
    'ITEM',
    1,
    'https://ejemplo.com/imagen.jpg',
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ejemplo]);

  // Anchos de columna
  ws['!cols'] = [
    { wch: 30 }, // NOMBRE
    { wch: 45 }, // DESCRIPCION
    { wch: 10 }, // PRECIO
    { wch: 8 },  // STOCK
    { wch: 16 }, // TIPO_PRODUCTO
    { wch: 10 }, // SECCION
    { wch: 45 }, // IMAGEN_URL
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Productos');

  // Hoja de catálogos de referencia
  const catalogoData = [
    ['TIPOS DE PRODUCTO', '', 'SECCIONES', ''],
    ['Valor', 'Descripción', 'Número', 'Nombre'],
    ['ITEM', 'Producto físico', '', ''],
    ['TERAPIA', 'Servicio / terapia', '', ''],
    ...SECCIONES.map((s) => ['', '', s.numero, s.nombre]),
  ];
  const wsCatalogo = XLSX.utils.aoa_to_sheet(catalogoData);
  wsCatalogo['!cols'] = [{ wch: 12 }, { wch: 22 }, { wch: 10 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, wsCatalogo, 'Catálogos');

  XLSX.writeFile(wb, 'plantilla_productos_h2aqua.xlsx');
}

// ── Helpers de validación ─────────────────────────────────────────────────────

function validarFila(f: Partial<FilaExcel>, idx: number): string | null {
  if (!f.NOMBRE?.toString().trim()) return `Fila ${idx + 2}: NOMBRE es obligatorio`;
  if (!f.PRECIO || Number(f.PRECIO) <= 0) return `Fila ${idx + 2}: PRECIO debe ser mayor que 0`;
  if (!['ITEM', 'TERAPIA'].includes(f.TIPO_PRODUCTO?.toString().trim().toUpperCase() ?? ''))
    return `Fila ${idx + 2}: TIPO_PRODUCTO debe ser ITEM o TERAPIA`;
  const sec = Number(f.SECCION);
  if (!SECCIONES.find((s) => s.numero === sec))
    return `Fila ${idx + 2}: SECCION debe ser ${SECCIONES.map((s) => s.numero).join(', ')}`;
  return null;
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function CargaMasiva() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filas, setFilas] = useState<FilaResultado[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState<string[]>([]);

  // ── Parseo del Excel ──────────────────────────────────────────────────────

  function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = ev.target?.result;
        const wb = XLSX.read(data, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Partial<FilaExcel>>(ws);

        const errores: string[] = [];
        const filasValidas: FilaResultado[] = [];

        rows.forEach((row, idx) => {
          const err = validarFila(row, idx);
          if (err) {
            errores.push(err);
          } else {
            filasValidas.push({
              NOMBRE: row.NOMBRE!.toString().trim(),
              DESCRIPCION: row.DESCRIPCION?.toString().trim() ?? '',
              PRECIO: Number(row.PRECIO),
              STOCK: Number(row.STOCK ?? 0),
              TIPO_PRODUCTO: row.TIPO_PRODUCTO!.toString().trim().toUpperCase(),
              SECCION: Number(row.SECCION),
              IMAGEN_URL: row.IMAGEN_URL?.toString().trim() ?? '',
              _idx: idx,
              _estado: 'pendiente',
              _mensaje: '',
            });
          }
        });

        setErroresValidacion(errores);
        setFilas(filasValidas);
      } catch {
        setErroresValidacion(['No se pudo leer el archivo. Asegúrate de que sea un Excel válido.']);
        setFilas([]);
      }
    };
    reader.readAsBinaryString(file);
    // Reset input para poder volver a elegir el mismo archivo
    e.target.value = '';
  }

  // ── Subida al API ─────────────────────────────────────────────────────────

  async function subirTodos() {
    setSubiendo(true);

    for (let i = 0; i < filas.length; i++) {
      const fila = filas[i];
      if (fila._estado === 'ok') continue;

      setFilas((prev) =>
        prev.map((f) => (f._idx === fila._idx ? { ...f, _estado: 'subiendo' } : f)),
      );

      try {
        const resp = await fetch(`${API_URL}/productos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: fila.NOMBRE,
            descripcion: fila.DESCRIPCION,
            precio: fila.PRECIO,
            stock: fila.STOCK,
            categoria: fila.TIPO_PRODUCTO,
            seccion: fila.SECCION,
            imagenUrl: fila.IMAGEN_URL || null,
          }),
        });

        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}));
          throw new Error(body.error ?? 'Error del servidor');
        }

        setFilas((prev) =>
          prev.map((f) =>
            f._idx === fila._idx ? { ...f, _estado: 'ok', _mensaje: 'Guardado' } : f,
          ),
        );
      } catch (err: any) {
        setFilas((prev) =>
          prev.map((f) =>
            f._idx === fila._idx
              ? { ...f, _estado: 'error', _mensaje: err.message ?? 'Error desconocido' }
              : f,
          ),
        );
      }
    }

    setSubiendo(false);
  }

  // ── Stats ────────────────────────────────────────────────────────────────

  const total = filas.length;
  const ok = filas.filter((f) => f._estado === 'ok').length;
  const errores = filas.filter((f) => f._estado === 'error').length;
  const pendientes = filas.filter((f) => f._estado === 'pendiente').length;

  const estadoColor: Record<EstadoFila, string> = {
    pendiente: TEXT_MUTED,
    subiendo: '#fbbf24',
    ok: SUCCESS,
    error: ERROR,
  };
  const estadoLabel: Record<EstadoFila, string> = {
    pendiente: 'Pendiente',
    subiendo: 'Subiendo…',
    ok: 'Guardado ✓',
    error: 'Error',
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: BORDER }}>

      {/* Encabezado */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', margin: '0 0 0.3rem', color: TEXT_PRIMARY, fontWeight: 500 }}>
          Carga masiva desde Excel
        </h2>
        <p style={{ margin: 0, fontSize: '0.88rem', color: TEXT_SECONDARY }}>
          Descarga la plantilla, llénala y súbela para registrar múltiples productos a la vez.
          La columna IMAGEN_URL debe contener URLs de imágenes ya publicadas en internet.
        </p>
      </div>

      {/* Botones principales */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={descargarPlantilla}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.4rem', borderRadius: '0.75rem',
            border: BORDER, backgroundColor: GOLD_SUBTLE,
            color: GOLD, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          ⬇ Descargar plantilla Excel
        </button>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.4rem', borderRadius: '0.75rem',
            border: BORDER, backgroundColor: BG_CARD_ALT,
            color: TEXT_SECONDARY, fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          📂 Seleccionar archivo Excel
        </button>
        <input ref={inputRef} type="file" accept=".xlsx,.xls" onChange={handleArchivo} style={{ display: 'none' }} />
      </div>

      {/* Errores de validación */}
      {erroresValidacion.length > 0 && (
        <div
          style={{
            marginBottom: '1rem', padding: '1rem 1.25rem', borderRadius: '0.75rem',
            backgroundColor: `${ERROR}18`, border: `1px solid ${ERROR}44`,
          }}
        >
          <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: ERROR, fontSize: '0.88rem' }}>
            Se encontraron errores en el archivo:
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {erroresValidacion.map((e, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: ERROR, marginBottom: '0.2rem' }}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabla de previsualización */}
      {filas.length > 0 && (
        <>
          {/* Resumen */}
          <div
            style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem',
              padding: '0.85rem 1.25rem', borderRadius: '0.75rem',
              backgroundColor: BG_CARD, border: BORDER,
              fontSize: '0.875rem', color: TEXT_MUTED,
            }}
          >
            <span><strong style={{ color: TEXT_PRIMARY }}>{total}</strong> leídos</span>
            <span>·</span>
            <span><strong style={{ color: SUCCESS }}>{ok}</strong> guardados</span>
            <span>·</span>
            <span><strong style={{ color: ERROR }}>{errores}</strong> con error</span>
            <span>·</span>
            <span><strong style={{ color: TEXT_MUTED }}>{pendientes}</strong> pendientes</span>
          </div>

          {/* Tabla */}
          <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: BORDER }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: BG_CARD_ALT, borderBottom: BORDER }}>
                  {['#', 'Nombre', 'Precio', 'Stock', 'Tipo', 'Sección', 'Imagen URL', 'Estado'].map((h) => (
                    <th key={h} style={{ padding: '0.65rem 0.9rem', textAlign: 'left', fontWeight: 600, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((f, i) => (
                  <tr
                    key={f._idx}
                    style={{
                      borderBottom: i < filas.length - 1 ? BORDER : 'none',
                      backgroundColor: f._estado === 'ok'
                        ? `${SUCCESS}12`
                        : f._estado === 'error'
                        ? `${ERROR}12`
                        : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.6rem 0.9rem', color: TEXT_MUTED }}>{i + 1}</td>
                    <td style={{ padding: '0.6rem 0.9rem', color: TEXT_PRIMARY, fontWeight: 500 }}>{f.NOMBRE}</td>
                    <td style={{ padding: '0.6rem 0.9rem', color: GOLD }}>${f.PRECIO.toLocaleString('es-MX')}</td>
                    <td style={{ padding: '0.6rem 0.9rem', color: TEXT_SECONDARY }}>{f.STOCK}</td>
                    <td style={{ padding: '0.6rem 0.9rem', color: TEXT_SECONDARY }}>{f.TIPO_PRODUCTO}</td>
                    <td style={{ padding: '0.6rem 0.9rem', color: TEXT_SECONDARY }}>
                      {SECCIONES.find((s) => s.numero === f.SECCION)?.nombre ?? f.SECCION}
                    </td>
                    <td
                      style={{
                        padding: '0.6rem 0.9rem',
                        color: TEXT_MUTED,
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {f.IMAGEN_URL || <span style={{ color: '#d1d5db' }}>Sin imagen</span>}
                    </td>
                    <td style={{ padding: '0.6rem 0.9rem' }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: estadoColor[f._estado],
                          fontSize: '0.8rem',
                        }}
                      >
                        {estadoLabel[f._estado]}
                      </span>
                      {f._estado === 'error' && (
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#DC2626',
                            marginTop: '0.15rem',
                          }}
                        >
                          {f._mensaje}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botón subir */}
          {pendientes + errores > 0 && (
            <button
              type="button"
              onClick={subirTodos}
              disabled={subiendo}
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem 2rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: subiendo
                  ? TEXT_MUTED
                  : `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: subiendo ? 'default' : 'pointer',
                boxShadow: subiendo ? 'none' : `0 4px 14px ${GOLD_GLOW}`,
              }}
            >
              {subiendo
                ? `Subiendo… (${ok}/${total})`
                : `⬆ Subir ${pendientes + errores} producto${pendientes + errores !== 1 ? 's' : ''}`}
            </button>
          )}

          {ok === total && total > 0 && (
            <p style={{ marginTop: '1rem', color: SUCCESS, fontWeight: 600 }}>
              ✓ Todos los productos se guardaron correctamente.
            </p>
          )}
        </>
      )}
    </div>
  );
}
