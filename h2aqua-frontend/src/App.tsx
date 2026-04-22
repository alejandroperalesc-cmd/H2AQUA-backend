import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Productos from './Productos';
import NuevoProducto from './NuevoProducto';
import TiendaProductos from './TiendaProductos';
import CitasCalendarioAdmin from './CitasCalendarioAdmin';
import Carrito from './Carrito';
import TarjetaRegalo from './TarjetaRegalo';
import { FiShoppingCart, FiMenu, FiX, FiMapPin, FiPhone, FiMail, FiLock, FiLogOut } from 'react-icons/fi';
import { useIsMobile } from './useIsMobile';
import {
  BG_DARK, BG_CARD, BG_CARD_ALT,
  GOLD, GOLD_LIGHT, GOLD_GLOW, GOLD_SUBTLE,
  TEAL,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER, BORDER_SUBTLE,
} from './theme';

type Vista = 'home' | 'lista' | 'nuevo' | 'tienda' | 'citas' | 'citas-calendario' | 'carrito' | 'regalo';

export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string | null;
  // Gift card fields
  esRegalo?: boolean;
  codigoRegalo?: string;
  emailDestinatario?: string;
  paraRegalo?: string;
  deRegalo?: string;
  mensajeRegalo?: string;
  nombreTarjeta?: string;
};

const API_URL = import.meta.env.VITE_API_URL;
const CARRITO_KEY = 'h2aqua_carrito';

// ─── PageBanner — encabezado degradado para cada sección ──────────────────────

function PageBanner({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        marginBottom: isMobile ? '1.75rem' : '2.5rem',
        padding: isMobile ? '1.75rem 1.5rem 1.75rem 2rem' : '2.25rem 2.5rem 2.25rem 3rem',
        backgroundColor: '#eaf6f7',
      }}
    >
      {/* Imagen difuminada de fondo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url("/hero-hidrogeno.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(14px)',
        transform: 'scale(1.12)',
        opacity: 0.13,
        pointerEvents: 'none',
      }} />

      {/* Wash de color teal muy tenue */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(0,109,119,0.10) 0%, rgba(0,183,196,0.07) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Acento izquierdo — línea teal */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '4px',
        background: `linear-gradient(180deg, ${TEAL} 0%, ${GOLD} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Círculo decorativo derecho — sutil */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(0,183,196,0.07) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Contenido */}
      <div style={{ position: 'relative' }}>
        <p style={{
          margin: '0 0 0.45rem',
          fontSize: '0.68rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: GOLD,
          fontWeight: 600,
        }}>
          {label}
        </p>
        <h1 style={{
          margin: 0,
          fontSize: isMobile ? '1.55rem' : '2rem',
          fontWeight: 300,
          letterSpacing: '0.03em',
          color: TEXT_PRIMARY,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            margin: '0.45rem 0 0',
            color: TEXT_SECONDARY,
            fontSize: '0.93rem',
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Home ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 'H₂', label: 'Molécula más pequeña del universo' },
  { value: '1,000+', label: 'Estudios científicos publicados' },
  { value: '100%', label: 'Antioxidante selectivo y natural' },
  { value: '6', label: 'Formas de aplicación terapéutica' },
];

const BENEFICIOS = [
  {
    label: 'Reduce inflamación',
    desc: 'Neutraliza los radicales libres que provocan inflamación crónica, aliviando dolor articular y muscular de forma natural.',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&fit=crop&q=85',
  },
  {
    label: 'Más energía y vitalidad',
    desc: 'Optimiza la función mitocondrial — la central energética de tus células — mejorando el rendimiento físico y mental.',
    img: 'https://brovfbutfvqzbuwhsopd.supabase.co/storage/v1/object/public/Productos/ENERGYVIT.jpg',
  },
  {
    label: 'Salud celular profunda',
    desc: 'Protege el ADN y las mitocondrias del daño oxidativo, apoyando la regeneración celular desde el interior.',
    img: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=600&fit=crop&q=85',
  },
  {
    label: 'Piel luminosa',
    desc: 'Reduce el estrés oxidativo en la piel, favoreciendo la hidratación profunda, luminosidad y efectos antiaging visibles.',
    img: 'https://brovfbutfvqzbuwhsopd.supabase.co/storage/v1/object/public/Productos/CARACOREA.webp',
  },
  {
    label: 'Sistema inmune fuerte',
    desc: 'Regula la respuesta inflamatoria y refuerza las defensas naturales del organismo sin efectos secundarios.',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&fit=crop&q=85',
  },
  {
    label: 'Claridad mental',
    desc: 'Efecto neuroprotector comprobado: reduce la niebla mental, mejora la concentración y la calidad del sueño.',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&fit=crop&q=85',
  },
];

const TERAPIAS_H2 = [
  {
    numero: '01',
    titulo: 'Terapia de Hidrógeno Molecular',
    tag: 'Bienestar Celular',
    descripcion: 'Tratamiento que DESINFLÁMA y reduce el ESTRÉS OXIDATIVO apoyando la salud desde el interior.',
    keywords: ['DESINFLAMACIÓN', 'ESTRÉS OXIDATIVO'],
    items: ['Sesiones de hidrógeno', 'Paquetes de sesiones'],
    grad: 'linear-gradient(135deg, #0b4a55 0%, #006d77 60%, #00968a 100%)',
  },
  {
    numero: '02',
    titulo: 'Experiencia Premium de Hidrógeno Molecular',
    tag: 'Equilibrio Celular',
    descripcion: 'El H₂ actúa como ANTIOXIDANTE SELECTIVO neutralizando radicales libres sin afectar los beneficiosos.',
    keywords: ['ANTIOXIDANTE SELECTIVO', 'EQUILIBRIO CELULAR'],
    items: ['Agua hidrogenada', 'Accesorio tópico', 'Terapia con goggles', 'Terapia en cuero cabelludo'],
    grad: 'linear-gradient(135deg, #006d77 0%, #00A9C0 60%, #00B7C4 100%)',
  },
];

const SERVICIOS_COMPLEMENTARIOS = [
  {
    label: 'Tratamientos Faciales',
    desc: 'Limpieza profunda, hidratación y revitalización con técnicas profesionales. Mejora la luminosidad y apariencia natural de tu piel.',
    img: 'https://brovfbutfvqzbuwhsopd.supabase.co/storage/v1/object/public/Productos/Tratamientosfaciales.jpeg',
  },
  {
    label: 'Skincare Coreano',
    desc: 'Fórmulas K-Beauty con ingredientes activos innovadores: hidratación profunda, nutrición y cuidado intensivo para todo tipo de piel.',
    img: 'https://brovfbutfvqzbuwhsopd.supabase.co/storage/v1/object/public/Productos/SKCOREA.jpeg',
  },
  {
    label: 'Make up, Cabello y Cuerpo',
    desc: 'Productos diseñados para una piel saludable y luminosa con rutinas efectivas que mantienen la piel limpia, hidratada y protegida.',
    img: 'https://brovfbutfvqzbuwhsopd.supabase.co/storage/v1/object/public/Productos/MAQUILLAJEH2A.jpg',
  },
  {
    label: 'Nutrición y Suplementos',
    desc: 'Suplementos seleccionados para la salud de la piel, el bienestar del cuerpo y un sistema inmunológico fuerte desde adentro.',
    img: 'https://brovfbutfvqzbuwhsopd.supabase.co/storage/v1/object/public/Productos/NUTYSUP.avif',
  },
];

function BeneficioCard({ b, isMobile }: { b: typeof BENEFICIOS[0]; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const active = isMobile || hovered;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', borderRadius: '1.1rem', overflow: 'hidden',
        aspectRatio: isMobile ? '3 / 4' : '4 / 5',
        cursor: 'default',
        boxShadow: hovered
          ? '0 16px 40px rgba(0,0,0,0.22)'
          : '0 2px 12px rgba(0,0,0,0.1)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'box-shadow 0.35s ease, transform 0.35s ease',
      }}
    >
      {/* Imagen */}
      <img
        src={b.img}
        alt={b.label}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.55s ease',
        }}
      />

      {/* Overlay — reposo: gradiente sutil abajo / hover: cubre todo */}
      <div style={{
        position: 'absolute', inset: 0,
        background: active
          ? 'linear-gradient(to top, rgba(11,74,85,0.97) 0%, rgba(0,109,119,0.88) 55%, rgba(0,150,138,0.70) 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
        transition: 'background 0.4s ease',
      }} />

      {/* Línea acento superior — solo en hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, #00B7C4, #006d77)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }} />

      {/* Contenido */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: active ? 'center' : 'flex-end',
        padding: isMobile ? '1rem' : '1.25rem',
        transition: 'justify-content 0.1s',
      }}>
        {/* Punto decorativo */}
        <div style={{
          width: '28px', height: '3px', borderRadius: '2px',
          background: '#00B7C4',
          marginBottom: '0.65rem',
          opacity: active ? 1 : 0,
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s',
        }} />

        <div style={{
          fontWeight: 700, color: '#ffffff',
          fontSize: isMobile ? '0.88rem' : '0.95rem',
          lineHeight: 1.3,
          marginBottom: active ? '0.55rem' : 0,
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          transition: 'margin-bottom 0.3s ease',
        }}>
          {b.label}
        </div>

        <div style={{
          color: 'rgba(255,255,255,0.82)', fontSize: '0.78rem',
          lineHeight: 1.6,
          opacity: active ? 1 : 0,
          transform: active ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.35s ease 0.08s, transform 0.35s ease 0.08s',
          maxHeight: active ? '120px' : '0',
          overflow: 'hidden',
        }}>
          {b.desc}
        </div>
      </div>
    </div>
  );
}

function Home({ irA }: { irA: (vista: Vista) => void }) {
  const isMobile = useIsMobile();

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '1.5rem 0 3rem' : '2.5rem 0 5rem' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          borderRadius: isMobile ? '1.25rem' : '1.75rem',
          overflow: 'hidden',
          minHeight: isMobile ? '380px' : '480px',
          marginBottom: isMobile ? '2rem' : '3rem',
          background: 'linear-gradient(135deg, #0b4a55 0%, #006d77 40%, #00968a 75%, #00B7C4 100%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Burbujas H₂ decorativas */}
        {[
          { size: 420, top: '-100px', right: '-80px', op: 0.07 },
          { size: 200, bottom: '10px', right: '12%', op: 0.06 },
          { size: 90,  top: '35%',    right: '32%',  op: 0.08 },
          { size: 50,  top: '20%',    right: '22%',  op: 0.10 },
          { size: 140, bottom: '25%', right: '5%',   op: 0.05 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: b.size, height: b.size, borderRadius: '50%',
            top: (b as any).top, bottom: (b as any).bottom,
            right: (b as any).right, left: (b as any).left,
            background: `radial-gradient(circle, rgba(255,255,255,${b.op}) 0%, transparent 65%)`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Molécula H₂ decorativa — esquina derecha desktop */}
        {!isMobile && (
          <div style={{
            position: 'absolute', right: '6%', top: '50%', transform: 'translateY(-50%)',
            width: '220px', height: '220px', pointerEvents: 'none', opacity: 0.18,
          }}>
            <div style={{
              position: 'absolute', width: '90px', height: '90px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.8)', top: '20px', left: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1.4rem',
            }}>H</div>
            <div style={{
              position: 'absolute', width: '90px', height: '90px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.8)', top: '20px', right: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '1.4rem',
            }}>H</div>
            <div style={{
              position: 'absolute', height: '2px', width: '42px',
              backgroundColor: 'rgba(255,255,255,0.6)', top: '65px', left: '89px',
            }} />
            <div style={{
              position: 'absolute', width: '60px', height: '60px', borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.5)', bottom: '10px', left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem',
            }}>H₂</div>
          </div>
        )}

        <div style={{ position: 'relative', padding: isMobile ? '2.75rem 1.75rem' : '4rem 3.5rem', maxWidth: '600px' }}>
          <p style={{
            textTransform: 'uppercase', letterSpacing: '0.28em',
            fontSize: '0.68rem', marginBottom: '1.1rem',
            color: 'rgba(255,255,255,0.6)', fontWeight: 600,
          }}>
            H2AQUA · Hidrógeno Molecular · Wellness
          </p>

          <h1 style={{
            fontSize: isMobile ? '2.1rem' : '3.1rem',
            fontWeight: 200, letterSpacing: '0.02em',
            marginBottom: '1.25rem', lineHeight: 1.15, color: '#ffffff',
          }}>
            Bienestar
            <br />
            <span style={{ fontWeight: 600 }}>desde adentro</span>
          </h1>

          <p style={{
            fontSize: isMobile ? '0.97rem' : '1.05rem',
            lineHeight: 1.8, marginBottom: '2.25rem',
            color: 'rgba(255,255,255,0.72)', maxWidth: '460px',
          }}>
            La molécula más pequeña del universo penetra hasta el núcleo de tus células,
            neutralizando radicales libres y activando tu capacidad natural de sanar.
          </p>

          <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => irA('tienda')}
              style={{
                padding: '0.95rem 2rem', borderRadius: '999px', border: 'none',
                background: '#ffffff', color: TEAL,
                cursor: 'pointer', fontWeight: 700, fontSize: '0.92rem',
                boxShadow: '0 6px 24px rgba(0,0,0,0.18)', letterSpacing: '0.02em',
              }}
            >
              Explorar tienda
            </button>
            <button
              onClick={() => irA('citas')}
              style={{
                padding: '0.95rem 2rem', borderRadius: '999px',
                border: '1.5px solid rgba(255,255,255,0.5)',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#ffffff', cursor: 'pointer',
                fontWeight: 500, fontSize: '0.92rem', letterSpacing: '0.02em',
                backdropFilter: 'blur(4px)',
              }}
            >
              Agenda tu terapia
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────────── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: '1px',
        backgroundColor: BORDER,
        borderRadius: '1.25rem',
        overflow: 'hidden',
        marginBottom: isMobile ? '2rem' : '3rem',
        boxShadow: `0 2px 16px ${GOLD_GLOW}`,
      }}>
        {STATS.map((s) => (
          <div key={s.value} style={{
            backgroundColor: BG_CARD, padding: isMobile ? '1.25rem 1rem' : '1.5rem 1.75rem',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: isMobile ? '1.7rem' : '2.1rem', fontWeight: 700,
              color: TEAL, letterSpacing: '-0.02em', lineHeight: 1,
              marginBottom: '0.4rem',
            }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: TEXT_MUTED, lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── QUÉ ES EL HIDRÓGENO ──────────────────────────────────────────────── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '1.5rem' : '2rem',
        marginBottom: isMobile ? '2rem' : '3rem',
        alignItems: 'stretch',
      }}>
        <div style={{
          borderRadius: '1.5rem', overflow: 'hidden',
          background: 'linear-gradient(145deg, #0b4a55 0%, #006d77 50%, #00968a 100%)',
          padding: isMobile ? '2rem 1.75rem' : '2.75rem 2.5rem',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '-50px', right: '-50px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <p style={{ margin: '0 0 0.6rem', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
            La ciencia detrás
          </p>
          <h2 style={{ fontSize: isMobile ? '1.5rem' : '1.9rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.25, marginBottom: '1.1rem' }}>
            ¿Qué es el<br /><strong style={{ fontWeight: 700 }}>Hidrógeno Molecular?</strong>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Es la molécula <strong style={{ color: '#ffffff' }}>más pequeña que existe</strong> — tan diminuta que
            penetra membranas celulares, la barrera hematoencefálica y llega directamente al ADN.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.93rem', lineHeight: 1.8, margin: 0 }}>
            A diferencia de otros antioxidantes, el H₂ es <strong style={{ color: '#ffffff' }}>selectivo</strong>:
            solo neutraliza los radicales libres más dañinos (·OH y ONOO⁻) sin interferir
            con los beneficiosos.
          </p>
        </div>

        {/* Datos clave */}
        <div style={{
          borderRadius: '1.5rem',
          border: BORDER,
          backgroundColor: BG_CARD,
          padding: isMobile ? '1.75rem' : '2.5rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem',
        }}>
          <p style={{ margin: 0, fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
            ¿Cómo actúa?
          </p>
          {[
            { n: '01', titulo: 'Penetra cualquier célula', texto: 'Su tamaño subatómico le permite llegar a mitocondrias y al núcleo celular donde ningún otro antioxidante alcanza.' },
            { n: '02', titulo: 'Antioxidante selectivo', texto: 'Solo neutraliza los radicales hidroxilo (·OH) y peroxinitrito (ONOO⁻), los más destructivos, sin eliminar los beneficiosos.' },
            { n: '03', titulo: 'Sin efectos secundarios', texto: 'El subproducto de la reacción es agua pura. 100% natural, seguro y avalado por más de 1,000 estudios clínicos.' },
          ].map((item) => (
            <div key={item.n} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, color: TEAL,
                backgroundColor: `rgba(0,109,119,0.08)`,
                border: `1px solid rgba(0,109,119,0.18)`,
                borderRadius: '999px', padding: '0.2rem 0.55rem',
                flexShrink: 0, marginTop: '0.15rem',
              }}>{item.n}</span>
              <div>
                <div style={{ fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.titulo}</div>
                <div style={{ color: TEXT_SECONDARY, fontSize: '0.82rem', lineHeight: 1.6 }}>{item.texto}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFICIOS — full width ───────────────────────────────────────────── */}
      <section style={{ marginBottom: isMobile ? '2rem' : '3rem' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ margin: '0 0 0.3rem', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
              Beneficios comprobados
            </p>
            <h2 style={{ margin: 0, fontSize: isMobile ? '1.4rem' : '1.75rem', color: TEXT_PRIMARY, fontWeight: 300 }}>
              Lo que puedes <strong style={{ fontWeight: 700 }}>sentir y ver</strong>
            </h2>
          </div>
          {!isMobile && (
            <p style={{ margin: 0, fontSize: '0.78rem', color: TEXT_MUTED }}>
              Pasa el cursor para descubrir más
            </p>
          )}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '0.75rem' : '1rem',
        }}>
          {BENEFICIOS.map((b) => (
            <BeneficioCard key={b.label} b={b} isMobile={isMobile} />
          ))}
        </div>
      </section>

      {/* ── TERAPIAS DE HIDRÓGENO ─────────────────────────────────────────────── */}
      <section style={{ marginBottom: isMobile ? '2rem' : '3rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.3rem', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
            Lo esencial
          </p>
          <h2 style={{ margin: 0, fontSize: isMobile ? '1.4rem' : '1.75rem', color: TEXT_PRIMARY, fontWeight: 300 }}>
            Nuestras terapias de <strong style={{ fontWeight: 700 }}>Hidrógeno Molecular</strong>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '1.25rem',
        }}>
          {TERAPIAS_H2.map((t) => (
            <div key={t.numero} style={{
              borderRadius: '1.5rem', overflow: 'hidden',
              boxShadow: `0 4px 24px ${GOLD_GLOW}`,
              border: BORDER,
              backgroundColor: BG_CARD,
            }}>
              {/* Header degradado */}
              <div style={{
                background: t.grad, padding: '1.5rem 1.75rem',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: '-30px', right: '-30px',
                  width: '130px', height: '130px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)',
                  pointerEvents: 'none',
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '2rem', fontWeight: 200, color: 'rgba(255,255,255,0.35)',
                    lineHeight: 1, letterSpacing: '-0.03em',
                  }}>{t.numero}</span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    padding: '0.25rem 0.65rem', borderRadius: '999px',
                  }}>{t.tag}</span>
                </div>
                <h3 style={{
                  margin: '0.5rem 0 0', fontSize: isMobile ? '1.05rem' : '1.15rem',
                  color: '#ffffff', fontWeight: 500, lineHeight: 1.35,
                }}>{t.titulo}</h3>
              </div>

              {/* Cuerpo */}
              <div style={{ padding: '1.5rem 1.75rem' }}>
                <p style={{ margin: '0 0 1rem', color: TEXT_SECONDARY, fontSize: '0.92rem', lineHeight: 1.7 }}>
                  {t.descripcion}
                </p>
                {/* Keywords destacadas */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
                  {t.keywords.map((k) => (
                    <span key={k} style={{
                      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                      color: TEAL, backgroundColor: `rgba(0,109,119,0.09)`,
                      padding: '0.25rem 0.7rem', borderRadius: '999px',
                      border: `1px solid rgba(0,109,119,0.2)`,
                    }}>{k}</span>
                  ))}
                </div>
                {/* Sub-servicios */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {t.items.map((item) => (
                    <div key={item} style={{
                      display: 'flex', alignItems: 'center', gap: '0.65rem',
                      fontSize: '0.9rem', color: TEXT_PRIMARY,
                    }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: GOLD, flexShrink: 0,
                      }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICIOS COMPLEMENTARIOS ────────────────────────────────────────── */}
      <section style={{ marginBottom: isMobile ? '2rem' : '3rem' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ margin: '0 0 0.3rem', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
              Más de nosotros
            </p>
            <h2 style={{ margin: 0, fontSize: isMobile ? '1.4rem' : '1.75rem', color: TEXT_PRIMARY, fontWeight: 300 }}>
              También <strong style={{ fontWeight: 700 }}>ofrecemos</strong>
            </h2>
          </div>
          {!isMobile && (
            <p style={{ margin: 0, fontSize: '0.78rem', color: TEXT_MUTED }}>
              Pasa el cursor para descubrir más
            </p>
          )}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '0.75rem' : '1rem',
        }}>
          {SERVICIOS_COMPLEMENTARIOS.map((s) => (
            <BeneficioCard key={s.label} b={s} isMobile={isMobile} />
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section style={{
        borderRadius: '1.75rem', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0b4a55 0%, #006d77 50%, #00B7C4 100%)',
        padding: isMobile ? '2.25rem 1.75rem' : '3rem 3.5rem',
        position: 'relative',
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'center',
          justifyContent: 'space-between',
          gap: '1.75rem',
          position: 'relative',
        }}>
          <div>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
              Da el primer paso
            </p>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: isMobile ? '1.4rem' : '2rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.2 }}>
              Regálale a tu cuerpo<br /><strong style={{ fontWeight: 700 }}>una pausa profunda</strong>
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem' }}>
              Agenda tu sesión y comienza a sentir los beneficios del hidrógeno molecular.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
            <button
              onClick={() => irA('citas')}
              style={{
                padding: '1rem 2.25rem', borderRadius: '999px', border: 'none',
                background: '#ffffff', color: TEAL,
                cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem',
                boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
                whiteSpace: 'nowrap',
              }}
            >
              Agenda tu cita
            </button>
            <button
              onClick={() => irA('tienda')}
              style={{
                padding: '0.85rem 2.25rem', borderRadius: '999px',
                border: '1.5px solid rgba(255,255,255,0.4)',
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#ffffff', cursor: 'pointer',
                fontWeight: 400, fontSize: '0.92rem',
                whiteSpace: 'nowrap',
              }}
            >
              Ver tienda
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ─────────────────────────────────────────────────────────── */}
      <section style={{
        marginTop: isMobile ? '2rem' : '3rem',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        border: BORDER,
        backgroundColor: BG_CARD,
        boxShadow: `0 2px 20px ${GOLD_GLOW}`,
      }}>
        {/* Banda superior */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, ${TEAL}, ${GOLD}, ${TEAL})` }} />

        <div style={{ padding: isMobile ? '1.75rem 1.5rem' : '2rem 2.5rem' }}>
          {/* Encabezado */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
              Visítanos
            </p>
            <h2 style={{ margin: 0, fontSize: isMobile ? '1.2rem' : '1.4rem', color: TEXT_PRIMARY, fontWeight: 300 }}>
              Encuéntranos <strong style={{ fontWeight: 700 }}>aquí</strong>
            </h2>
          </div>

          {/* Los tres items en fila */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '0' : '0',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: BORDER,
          }}>
            {/* Dirección */}
            <div style={{
              padding: isMobile ? '1.25rem 1rem' : '1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              borderRight: isMobile ? 'none' : BORDER,
              borderBottom: isMobile ? BORDER : 'none',
              backgroundColor: BG_CARD,
            }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${TEAL}, #00968a)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiMapPin size={18} color="#ffffff" />
              </div>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>Dirección</p>
                <p style={{ margin: 0, color: TEXT_PRIMARY, fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.4 }}>Av. de las Fuentes 665</p>
                <p style={{ margin: 0, color: TEXT_SECONDARY, fontSize: '0.8rem', lineHeight: 1.5 }}>Jardines del Pedregal, Álvaro Obregón · C.P. 01900</p>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/525525601138"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: isMobile ? '1.25rem 1rem' : '1.5rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                borderRight: isMobile ? 'none' : BORDER,
                borderBottom: isMobile ? BORDER : 'none',
                backgroundColor: BG_CARD,
                textDecoration: 'none', cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = BG_CARD_ALT; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = BG_CARD; }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiPhone size={18} color="#ffffff" />
              </div>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>WhatsApp</p>
                <p style={{ margin: 0, color: TEXT_PRIMARY, fontWeight: 600, fontSize: '0.95rem' }}>55 2560 1138</p>
                <p style={{ margin: 0, color: '#25D366', fontSize: '0.78rem', fontWeight: 500 }}>Escríbenos →</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:info@h2aqua.com.mx"
              style={{
                padding: isMobile ? '1.25rem 1rem' : '1.5rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
                backgroundColor: BG_CARD,
                textDecoration: 'none', cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = BG_CARD_ALT; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = BG_CARD; }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiMail size={18} color="#ffffff" />
              </div>
              <div>
                <p style={{ margin: '0 0 0.2rem', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>Correo</p>
                <p style={{ margin: 0, color: TEXT_PRIMARY, fontWeight: 600, fontSize: '0.88rem' }}>info@h2aqua.com.mx</p>
                <p style={{ margin: 0, color: GOLD, fontSize: '0.78rem', fontWeight: 500 }}>Envíanos un mensaje →</p>
              </div>
            </a>
          </div>
        </div>
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
  const [exitoCita, setExitoCita] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [citasBackend, setCitasBackend] = useState<CitaApi[]>([]);
  const [cargandoCitas, setCargandoCitas] = useState(false);
  const [terapias, setTerapias] = useState<TerapiaApi[]>([]);
  const [terapiaSeleccionadaId, setTerapiaSeleccionadaId] = useState<number | null>(null);

  const telefonoValido = /^\+?[\d\s\-().]{10,15}$/.test(telefono.replace(/\s/g, '')) && telefono.replace(/\D/g, '').length >= 10;
  const correoValido   = correo === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

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
    setErrorForm(null);
    if (!horaSeleccionada) { setErrorForm('Selecciona un horario.'); return; }
    if (!terapiaSeleccionadaId) { setErrorForm('Elige una terapia.'); return; }
    if (!nombre.trim()) { setErrorForm('El nombre es obligatorio.'); return; }
    if (!telefono.trim()) { setErrorForm('El teléfono es obligatorio.'); return; }
    if (!telefonoValido) { setErrorForm('Ingresa un número de teléfono válido (mínimo 10 dígitos).'); return; }
    if (!correoValido) { setErrorForm('El formato del correo electrónico no es válido.'); return; }
    if (horariosOcupados.has(horaSeleccionada)) { setErrorForm('Ese horario ya está ocupado, elige otro.'); return; }

    try {
      setGuardando(true);
      const [horaStr, minutoStr] = horaSeleccionada.split(':');
      const fechaHora = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), parseInt(horaStr), parseInt(minutoStr), 0).toISOString();
      const terapia = terapias.find((t) => t.id === terapiaSeleccionadaId);

      const resp = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaHora,
          clienteId: 1,
          servicioId: 1,
          notas: `Nombre: ${nombre.trim()}, Tel: ${telefono.trim()}, Correo: ${correo.trim() || 'N/A'}, Terapia: ${terapia?.nombre ?? ''}`,
          estado: 'PENDIENTE',
          nombre:   nombre.trim(),
          telefono: telefono.trim(),
          correo:   correo.trim() || null,
          terapia:  terapia?.nombre ?? '',
          precio:   terapia?.precio ?? null,
        }),
      });

      if (!resp.ok) { setErrorForm('No se pudo guardar la cita. Intenta más tarde.'); return; }
      await cargarCitas();
      setExitoCita(true);
      setHoraSeleccionada(null); setNombre(''); setTelefono(''); setCorreo('');
    } catch { setErrorForm('No se pudo guardar la cita. Intenta más tarde.'); }
    finally { setGuardando(false); }
  }


  const inputStyle = {
    padding: '0.65rem 0.9rem',
    borderRadius: '0.6rem',
    border: BORDER,
    fontSize: '0.95rem',
    backgroundColor: BG_CARD,
    color: TEXT_PRIMARY,
    outline: 'none',
    width: '100%',
  } as const;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: isMobile ? '1.5rem 0 3rem' : '2.5rem 0 4rem' }}>

      <PageBanner label="H2AQUA" title="Agenda tu cita" subtitle="Elige tu terapia, día y horario." />

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
          <p style={{ margin: 0, fontSize: '0.82rem', color: TEXT_MUTED }}>Fecha seleccionada:</p>
          <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: 500, color: TEAL, textTransform: 'capitalize' }}>
            {fechaTexto}
          </p>
          {cargandoCitas && <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: TEXT_MUTED }}>Actualizando horarios…</p>}
        </div>
      </div>

      {/* Selector terapia */}
      <section
        style={{
          marginBottom: '1.75rem',
          borderRadius: '1rem',
          overflow: 'hidden',
          border: BORDER,
          boxShadow: `0 2px 12px ${GOLD_GLOW}`,
        }}
      >
        <div style={{ padding: '0.75rem 1.4rem', background: `linear-gradient(135deg, ${TEAL}, ${GOLD})` }}>
          <h2 style={{ margin: 0, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#ffffff', fontWeight: 600 }}>
            Terapia seleccionada
          </h2>
        </div>
        <div style={{ padding: '1.25rem 1.4rem', backgroundColor: BG_CARD }}>
          {terapias.length === 0 && <p style={{ margin: 0, color: TEXT_MUTED, fontSize: '0.95rem' }}>No hay terapias disponibles.</p>}
          {terapias.length > 0 && (
            <>
              <select
                value={terapiaSeleccionadaId ?? ''}
                onChange={(e) => setTerapiaSeleccionadaId(Number(e.target.value))}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '0.8rem 2.5rem 0.8rem 1rem',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2300A9C0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '20px',
                }}
              >
                {terapias.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre} – ${t.precio} MXN</option>
                ))}
              </select>
            </>
          )}
        </div>
      </section>

      {/* Horarios */}
      <section>
        <h2 style={{ fontSize: '0.72rem', marginBottom: '0.9rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: TEAL, fontWeight: 600 }}>
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
                  border: activo ? `1.5px solid ${GOLD}` : BORDER,
                  backgroundColor: ocupado ? '#f5f5f5' : activo ? GOLD_SUBTLE : BG_CARD,
                  cursor: ocupado ? 'not-allowed' : 'pointer',
                  color: ocupado ? TEXT_MUTED : activo ? TEAL : TEXT_SECONDARY,
                  fontSize: '0.88rem',
                  fontWeight: activo ? 600 : 400,
                  boxShadow: activo ? `0 2px 8px ${GOLD_GLOW}` : 'none',
                  transition: 'all 0.15s ease',
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
              borderRadius: '1rem',
              overflow: 'hidden',
              border: BORDER,
              boxShadow: `0 2px 12px ${GOLD_GLOW}`,
            }}
          >
            <div style={{ padding: '0.75rem 1.4rem', background: `linear-gradient(135deg, ${TEAL}, ${GOLD})` }}>
              <h2 style={{ margin: 0, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#ffffff', fontWeight: 600 }}>
                Datos para tu cita
              </h2>
            </div>
            <div style={{ padding: '1.4rem', backgroundColor: BG_CARD }}>
              {exitoCita ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 1rem', background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="20" viewBox="0 0 30 24" fill="none"><path d="M2 12L10 20L28 2" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <p style={{ margin: '0 0 0.4rem', fontWeight: 700, color: TEAL, fontSize: '1rem' }}>¡Cita registrada!</p>
                  <p style={{ margin: '0 0 1rem', color: TEXT_SECONDARY, fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Tu cita está <strong>pendiente de confirmación</strong>. Te contactaremos por WhatsApp o correo para confirmar el pago. Una vez confirmado recibirás un correo de confirmación.
                  </p>
                  <button onClick={() => setExitoCita(false)} style={{ padding: '0.6rem 1.5rem', borderRadius: '999px', border: 'none', background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`, color: '#fff', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>
                    Agendar otra cita
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ marginBottom: '1.2rem', color: TEXT_SECONDARY, fontSize: '0.9rem' }}>
                    Cita para <strong style={{ color: TEXT_PRIMARY }}>{fechaTexto}</strong> a las <strong style={{ color: GOLD }}>{horaSeleccionada}</strong>.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="text" placeholder="Nombre completo *" value={nombre}
                      onChange={(e) => { setNombre(e.target.value); setErrorForm(null); }}
                      style={inputStyle}
                    />
                    <div>
                      <input
                        type="tel" placeholder="Teléfono / WhatsApp * (10 dígitos)" value={telefono}
                        onChange={(e) => { setTelefono(e.target.value); setErrorForm(null); }}
                        style={{ ...inputStyle, borderColor: telefono && !telefonoValido ? '#e05569' : undefined }}
                      />
                      {telefono && !telefonoValido && (
                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#e05569' }}>Ingresa un número válido (mínimo 10 dígitos)</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="email" placeholder="Correo electrónico (para recibir confirmación)" value={correo}
                        onChange={(e) => { setCorreo(e.target.value); setErrorForm(null); }}
                        style={{ ...inputStyle, borderColor: correo && !correoValido ? '#e05569' : undefined }}
                      />
                      {correo && !correoValido && (
                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#e05569' }}>Formato de correo no válido</p>
                      )}
                    </div>
                    {errorForm && (
                      <div style={{ backgroundColor: 'rgba(224,85,106,0.08)', borderRadius: '0.6rem', padding: '0.65rem 0.9rem', border: '1px solid rgba(224,85,106,0.25)' }}>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#e05569' }}>{errorForm}</p>
                      </div>
                    )}
                    <button
                      onClick={confirmarCita}
                      disabled={guardando}
                      style={{
                        marginTop: '0.5rem', padding: '0.9rem', borderRadius: '999px', border: 'none',
                        background: guardando ? TEXT_MUTED : `linear-gradient(135deg, ${TEAL}, ${GOLD})`,
                        color: '#ffffff', cursor: guardando ? 'default' : 'pointer',
                        fontWeight: 600, fontSize: '0.95rem',
                        boxShadow: guardando ? 'none' : `0 4px 14px ${GOLD_GLOW}`,
                      }}
                    >
                      {guardando ? 'Guardando…' : 'Solicitar cita'}
                    </button>
                    <p style={{ margin: 0, textAlign: 'center', fontSize: '0.73rem', color: TEXT_MUTED }}>
                      Tu cita quedará pendiente hasta confirmar el pago por WhatsApp o correo
                    </p>
                  </div>
                </>
              )}
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
          border: `1px solid ${cantidadTotal > 0 ? GOLD : BORDER}`,
          backgroundColor: cantidadTotal > 0 ? GOLD_SUBTLE : 'transparent',
          color: cantidadTotal > 0 ? TEAL : TEXT_SECONDARY,
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
              background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`,
              color: '#ffffff',
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
            boxShadow: `0 16px 40px rgba(0,183,196,0.12), 0 2px 8px rgba(0,0,0,0.08)`,
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '0.85rem 1.1rem',
            borderBottom: BORDER_SUBTLE,
            background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <FiShoppingCart size={14} color="#ffffff" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', letterSpacing: '0.05em' }}>
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
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.55rem 1.1rem' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '0.4rem',
                      backgroundColor: BG_CARD_ALT, flexShrink: 0, overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: BORDER_SUBTLE,
                    }}>
                      {item.imagenUrl
                        ? <img src={item.imagenUrl} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '0.7rem', color: TEXT_MUTED }}>◆</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: TEXT_PRIMARY, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.nombre}
                      </p>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.78rem', color: TEXT_MUTED }}>
                        {item.cantidad} × ${item.precio.toLocaleString('es-MX')}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: TEAL, flexShrink: 0 }}>
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

              <div style={{
                borderTop: BORDER_SUBTLE,
                padding: '0.85rem 1.1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: BG_CARD_ALT,
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: TEXT_MUTED }}>Total</p>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: TEAL }}>
                    ${subtotal.toLocaleString('es-MX')} <span style={{ fontSize: '0.72rem', fontWeight: 400, color: TEXT_MUTED }}>MXN</span>
                  </p>
                </div>
                <button
                  onClick={onClick}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '999px',
                    border: 'none',
                    background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`,
                    color: '#ffffff',
                    fontWeight: 600,
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
    } catch { return []; }
  });
  const [vista, setVista] = useState<Vista>('home');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('h2aqua_admin') === '1');
  const [loginModal, setLoginModal] = useState(false);
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Detect return from Clip payment redirect (?clip=success)
  const [clipSuccessNombre, setClipSuccessNombre] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('clip') === 'success' ? (params.get('nombre') ?? 'Cliente') : null;
  });
  useEffect(() => {
    if (clipSuccessNombre) {
      // Clear cart — payment was completed on Clip's side
      setCarrito([]);
      const url = new URL(window.location.href);
      url.searchParams.delete('clip');
      url.searchParams.delete('nombre');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito)); }
    catch { /* sin localStorage */ }
  }, [carrito]);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'h2aqua2025';

  function handleLogin() {
    if (loginPass === ADMIN_PASSWORD) {
      sessionStorage.setItem('h2aqua_admin', '1');
      setIsAdmin(true);
      setLoginModal(false);
      setLoginPass('');
      setLoginError(false);
    } else {
      setLoginError(true);
      setLoginPass('');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('h2aqua_admin');
    setIsAdmin(false);
    if (['lista', 'nuevo', 'citas-calendario'].includes(vista)) setVista('home');
  }

  function irA(nuevaVista: Vista) { setVista(nuevaVista); setMenuAbierto(false); }

  function agregarAlCarrito(item: Omit<ItemCarrito, 'cantidad'>) {
    setCarrito((prev) => {
      const ex = prev.find((i) => i.id === item.id);
      if (ex) return prev.map((i) => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...item, cantidad: 1 }];
    });
  }

  function cambiarCantidad(id: number, delta: number) {
    setCarrito((prev) =>
      prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
        .filter((i) => i.cantidad > 0),
    );
  }

  function eliminarDelCarrito(id: number) { setCarrito((prev) => prev.filter((i) => i.id !== id)); }
  function vaciarCarrito() { setCarrito([]); }

  const navItemsPublicos = [
    { key: 'home',    label: 'Inicio' },
    { key: 'tienda',  label: 'Tienda' },
    { key: 'regalo',  label: 'Tarjeta Regalo' },
    { key: 'citas',   label: 'Citas' },
  ] as const;

  const navItemsAdmin = [
    { key: 'citas-calendario', label: 'Calendario' },
    { key: 'lista',            label: 'Productos' },
    { key: 'nuevo',            label: 'Nuevo producto' },
  ] as const;

  const navItems = isAdmin
    ? [...navItemsPublicos, ...navItemsAdmin]
    : navItemsPublicos;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG_DARK }}>

      {/* ── Clip payment success overlay ── */}
      {clipSuccessNombre && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            backgroundColor: BG_CARD, borderRadius: '1.5rem',
            padding: '2.5rem 2rem', maxWidth: '420px', width: '100%',
            textAlign: 'center',
            border: `1px solid ${TEAL}44`,
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              margin: '0 auto 1.25rem',
              background: `linear-gradient(135deg, ${TEAL}, #00B7C4)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                <path d="M2 11L10 19L26 2" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>
              ¡Pago recibido!
            </p>
            <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.6rem', color: TEXT_PRIMARY, fontWeight: 300 }}>
              Gracias, {clipSuccessNombre.split(' ')[0]}
            </h2>
            <p style={{ margin: '0 0 2rem', color: TEXT_SECONDARY, fontSize: '0.92rem', lineHeight: 1.7 }}>
              Tu pago con Clip fue procesado correctamente. Recibirás la confirmación de tu pedido y nos pondremos en contacto para coordinar la entrega.
            </p>
            <button
              onClick={() => setClipSuccessNombre(null)}
              style={{
                padding: '0.85rem 2rem', borderRadius: '999px', border: 'none',
                background: `linear-gradient(135deg, ${TEAL}, #00B7C4)`,
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: `0 4px 14px ${TEAL}55`,
              }}
            >
              Seguir explorando
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: BORDER,
          boxShadow: `0 1px 20px rgba(0,183,196,0.07)`,
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: isMobile ? '0.35rem 1rem' : '0.25rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="/logo-h2aqua.png" alt="H2AQUA" style={{ height: isMobile ? '90px' : '200px', width: 'auto' }} />
          </div>

          {/* Desktop: Nav + Carrito */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <nav style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
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
                      color: vista === item.key ? TEAL : TEXT_SECONDARY,
                      fontWeight: vista === item.key ? 600 : 400,
                      fontSize: '0.82rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div style={{ width: '1px', height: '20px', backgroundColor: BORDER, margin: '0 0.25rem' }} />
              {isAdmin ? (
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión admin"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', borderRadius: '999px', border: `1px solid ${BORDER}`, backgroundColor: 'transparent', color: TEXT_MUTED, fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  <FiLogOut size={13} /> Admin
                </button>
              ) : (
                <button
                  onClick={() => { setLoginModal(true); setLoginError(false); setLoginPass(''); }}
                  title="Acceso administrador"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${BORDER}`, backgroundColor: 'transparent', color: TEXT_MUTED, cursor: 'pointer' }}
                >
                  <FiLock size={13} />
                </button>
              )}
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
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '38px', height: '38px',
                  borderRadius: '0.5rem', border: BORDER,
                  backgroundColor: 'transparent', color: TEXT_PRIMARY, cursor: 'pointer',
                }}
              >
                {menuAbierto ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile: menú desplegable */}
        {isMobile && menuAbierto && (
          <div style={{
            backgroundColor: BG_CARD,
            borderTop: BORDER_SUBTLE,
            padding: '0.75rem 1rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
            boxShadow: '0 8px 24px rgba(0,183,196,0.08)',
          }}>
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
                  color: vista === item.key ? TEAL : TEXT_SECONDARY,
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

      {/* ── Modal login admin ── */}
      {loginModal && (
        <div
          onClick={() => setLoginModal(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: BG_CARD, borderRadius: '1.25rem', border: BORDER, padding: '2rem', width: '100%', maxWidth: '360px', boxShadow: `0 20px 60px rgba(0,0,0,0.2)` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiLock size={16} color="#fff" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>Acceso restringido</p>
                <h2 style={{ margin: 0, fontSize: '1.15rem', color: TEXT_PRIMARY, fontWeight: 600 }}>Panel de administración</h2>
              </div>
            </div>

            <input
              type="password"
              placeholder="Contraseña"
              value={loginPass}
              autoFocus
              onChange={(e) => { setLoginPass(e.target.value); setLoginError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '0.7rem 0.9rem', borderRadius: '0.6rem',
                border: loginError ? '1px solid #e0556a' : BORDER,
                backgroundColor: BG_CARD_ALT, color: TEXT_PRIMARY,
                fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            {loginError && (
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: '#e0556a' }}>Contraseña incorrecta</p>
            )}

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.1rem' }}>
              <button
                onClick={() => setLoginModal(false)}
                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.6rem', border: BORDER, backgroundColor: 'transparent', color: TEXT_SECONDARY, fontSize: '0.88rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleLogin}
                style={{ flex: 1, padding: '0.65rem', borderRadius: '0.6rem', border: 'none', background: `linear-gradient(135deg, ${TEAL}, ${GOLD})`, color: '#fff', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banda teal superior decorativa bajo el header */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${TEAL}, ${GOLD}, ${GOLD_LIGHT}, transparent)` }} />

      {/* ── Main ── */}
      <main style={{ padding: isMobile ? '0 1rem' : '0 2rem', overflowX: 'hidden' }}>
        {vista === 'home'             && <Home irA={irA} />}
        {vista === 'citas'            && <Citas />}
        {vista === 'lista'            && isAdmin && <Productos />}
        {vista === 'nuevo'            && isAdmin && <NuevoProducto />}
        {vista === 'citas-calendario' && isAdmin && <CitasCalendarioAdmin />}
        {vista === 'tienda'           && <TiendaProductos carrito={carrito} onAgregarAlCarrito={agregarAlCarrito} />}
        {vista === 'regalo'           && <TarjetaRegalo onAgregarAlCarrito={agregarAlCarrito} irAlCarrito={() => irA('carrito')} />}
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
