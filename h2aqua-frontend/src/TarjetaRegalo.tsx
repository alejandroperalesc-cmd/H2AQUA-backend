import { useState, type ReactElement } from 'react';
import { useIsMobile } from './useIsMobile';
import type { ItemCarrito } from './App';
import {
  BG_CARD, BG_CARD_ALT,
  GOLD, TEAL,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER, BORDER_SUBTLE,
} from './theme';

// ─── Diseños SVG de tarjetas de regalo ────────────────────────────────────────

function CardDesign1() {
  // Esencial — teal mint + burbujas de agua
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 225" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="g1a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#006d77" />
          <stop offset="55%" stopColor="#00A9C0" />
          <stop offset="100%" stopColor="#00B7C4" />
        </linearGradient>
        <radialGradient id="g1b" cx="80%" cy="20%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="360" height="225" rx="16" fill="url(#g1a)" />
      <rect width="360" height="225" rx="16" fill="url(#g1b)" />
      {/* Burbujas de agua decorativas */}
      <circle cx="290" cy="42" r="52" fill="rgba(255,255,255,0.07)" />
      <circle cx="290" cy="42" r="36" fill="rgba(255,255,255,0.07)" />
      <circle cx="290" cy="42" r="20" fill="rgba(255,255,255,0.09)" />
      <circle cx="42" cy="185" r="38" fill="rgba(255,255,255,0.06)" />
      <circle cx="42" cy="185" r="22" fill="rgba(255,255,255,0.07)" />
      <circle cx="155" cy="198" r="18" fill="rgba(255,255,255,0.06)" />
      <circle cx="320" cy="170" r="25" fill="rgba(255,255,255,0.05)" />
      {/* Gotas de agua — motivo principal */}
      <ellipse cx="200" cy="105" rx="4" ry="6" fill="rgba(255,255,255,0.25)" />
      <ellipse cx="218" cy="98" rx="3" ry="5" fill="rgba(255,255,255,0.18)" />
      <ellipse cx="233" cy="108" rx="3.5" ry="5.5" fill="rgba(255,255,255,0.20)" />
      <ellipse cx="215" cy="118" rx="2.5" ry="4" fill="rgba(255,255,255,0.15)" />
      {/* Onda inferior sutil */}
      <path d="M0 180 Q90 165 180 180 Q270 195 360 180 L360 225 L0 225 Z" fill="rgba(255,255,255,0.05)" />
      <path d="M0 195 Q90 183 180 195 Q270 207 360 195 L360 225 L0 225 Z" fill="rgba(255,255,255,0.04)" />
    </svg>
  );
}

function CardDesign2() {
  // Ritual — rose / mauve con motivos florales
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 225" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="g2a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7b2d6a" />
          <stop offset="50%" stopColor="#c46a9a" />
          <stop offset="100%" stopColor="#e8a0c0" />
        </linearGradient>
        <radialGradient id="g2b" cx="20%" cy="80%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="360" height="225" rx="16" fill="url(#g2a)" />
      <rect width="360" height="225" rx="16" fill="url(#g2b)" />
      {/* Pétalos decorativos */}
      <ellipse cx="300" cy="50" rx="35" ry="18" fill="rgba(255,255,255,0.09)" transform="rotate(-35 300 50)" />
      <ellipse cx="320" cy="65" rx="35" ry="18" fill="rgba(255,255,255,0.07)" transform="rotate(25 320 65)" />
      <ellipse cx="295" cy="70" rx="28" ry="15" fill="rgba(255,255,255,0.08)" transform="rotate(-70 295 70)" />
      <ellipse cx="315" cy="42" rx="28" ry="14" fill="rgba(255,255,255,0.06)" transform="rotate(60 315 42)" />
      {/* Pétalo pequeño derecho */}
      <ellipse cx="50" cy="40" rx="22" ry="11" fill="rgba(255,255,255,0.08)" transform="rotate(-20 50 40)" />
      <ellipse cx="65" cy="55" rx="22" ry="11" fill="rgba(255,255,255,0.06)" transform="rotate(40 65 55)" />
      {/* Líneas elegantes */}
      <line x1="0" y1="145" x2="360" y2="145" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <line x1="0" y1="155" x2="360" y2="155" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      {/* Puntos decorativos */}
      <circle cx="180" cy="40" r="2.5" fill="rgba(255,255,255,0.22)" />
      <circle cx="192" cy="34" r="1.8" fill="rgba(255,255,255,0.16)" />
      <circle cx="170" cy="35" r="1.5" fill="rgba(255,255,255,0.14)" />
    </svg>
  );
}

function CardDesign3() {
  // Experiencia — deep emerald con patrón molecular
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 225" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="g3a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b4a55" />
          <stop offset="45%" stopColor="#00496b" />
          <stop offset="100%" stopColor="#006d77" />
        </linearGradient>
        <radialGradient id="g3b" cx="70%" cy="30%" r="50%">
          <stop offset="0%" stopColor="rgba(0,183,196,0.20)" />
          <stop offset="100%" stopColor="rgba(0,183,196,0)" />
        </radialGradient>
      </defs>
      <rect width="360" height="225" rx="16" fill="url(#g3a)" />
      <rect width="360" height="225" rx="16" fill="url(#g3b)" />
      {/* Patrón molecular H₂ */}
      <circle cx="265" cy="55" r="14" fill="rgba(255,255,255,0)" stroke="rgba(0,183,196,0.45)" strokeWidth="1.5" />
      <circle cx="295" cy="55" r="14" fill="rgba(255,255,255,0)" stroke="rgba(0,183,196,0.45)" strokeWidth="1.5" />
      <line x1="279" y1="55" x2="281" y2="55" stroke="rgba(0,183,196,0.5)" strokeWidth="2" />
      <circle cx="280" cy="80" r="9" fill="rgba(255,255,255,0)" stroke="rgba(0,183,196,0.30)" strokeWidth="1.2" />
      {/* Red hexagonal de fondo */}
      <polygon points="310,100 325,109 325,127 310,136 295,127 295,109" fill="rgba(0,183,196,0.05)" stroke="rgba(0,183,196,0.12)" strokeWidth="0.8" />
      <polygon points="335,87 350,96 350,114 335,123 320,114 320,96" fill="rgba(0,183,196,0.04)" stroke="rgba(0,183,196,0.10)" strokeWidth="0.8" />
      <polygon points="285,113 300,122 300,140 285,149 270,140 270,122" fill="rgba(0,183,196,0.04)" stroke="rgba(0,183,196,0.10)" strokeWidth="0.8" />
      {/* Puntos de nodo */}
      <circle cx="50" cy="170" r="3" fill="rgba(0,183,196,0.35)" />
      <circle cx="80" cy="155" r="2" fill="rgba(0,183,196,0.25)" />
      <circle cx="110" cy="168" r="2.5" fill="rgba(0,183,196,0.28)" />
      <line x1="50" y1="170" x2="80" y2="155" stroke="rgba(0,183,196,0.20)" strokeWidth="0.8" />
      <line x1="80" y1="155" x2="110" y2="168" stroke="rgba(0,183,196,0.20)" strokeWidth="0.8" />
      <line x1="110" y1="168" x2="140" y2="158" stroke="rgba(0,183,196,0.15)" strokeWidth="0.8" />
      <circle cx="140" cy="158" r="2" fill="rgba(0,183,196,0.22)" />
    </svg>
  );
}

function CardDesign4() {
  // Lujo — champagne gold / amber con geometría elegante
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 225" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="g4a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5c3a00" />
          <stop offset="40%" stopColor="#9a6200" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
        <linearGradient id="g4b" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,220,100,0.18)" />
          <stop offset="100%" stopColor="rgba(255,220,100,0)" />
        </linearGradient>
      </defs>
      <rect width="360" height="225" rx="16" fill="url(#g4a)" />
      <rect width="360" height="225" rx="16" fill="url(#g4b)" />
      {/* Rombo central decorativo */}
      <polygon points="295,30 330,65 295,100 260,65" fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.20)" strokeWidth="0.8" />
      <polygon points="295,42 318,65 295,88 272,65" fill="rgba(255,215,0,0.06)" stroke="rgba(255,215,0,0.16)" strokeWidth="0.6" />
      <polygon points="295,54 306,65 295,76 284,65" fill="rgba(255,215,0,0.09)" stroke="rgba(255,215,0,0.22)" strokeWidth="0.5" />
      {/* Líneas diagonales sutiles */}
      <line x1="0" y1="225" x2="160" y2="0" stroke="rgba(255,215,0,0.06)" strokeWidth="30" />
      {/* Ornamento izquierdo */}
      <line x1="28" y1="160" x2="100" y2="160" stroke="rgba(255,215,0,0.30)" strokeWidth="0.7" />
      <circle cx="28" cy="160" r="2.5" fill="rgba(255,215,0,0.50)" />
      <circle cx="100" cy="160" r="2.5" fill="rgba(255,215,0,0.50)" />
      <line x1="28" y1="165" x2="100" y2="165" stroke="rgba(255,215,0,0.15)" strokeWidth="0.5" />
      {/* Estrellas/destellos de lujo */}
      <line x1="230" y1="38" x2="230" y2="48" stroke="rgba(255,215,0,0.55)" strokeWidth="1" />
      <line x1="225" y1="43" x2="235" y2="43" stroke="rgba(255,215,0,0.55)" strokeWidth="1" />
      <line x1="227" y1="40" x2="233" y2="46" stroke="rgba(255,215,0,0.35)" strokeWidth="0.7" />
      <line x1="233" y1="40" x2="227" y2="46" stroke="rgba(255,215,0,0.35)" strokeWidth="0.7" />
      <line x1="50" y1="55" x2="50" y2="62" stroke="rgba(255,215,0,0.40)" strokeWidth="0.8" />
      <line x1="46.5" y1="58.5" x2="53.5" y2="58.5" stroke="rgba(255,215,0,0.40)" strokeWidth="0.8" />
    </svg>
  );
}

function CardDesign5() {
  // Platino — medianoche profunda + constelaciones
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 225" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="g5a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d0d2b" />
          <stop offset="50%" stopColor="#1a1054" />
          <stop offset="100%" stopColor="#2d1f7a" />
        </linearGradient>
        <radialGradient id="g5b" cx="60%" cy="30%" r="55%">
          <stop offset="0%" stopColor="rgba(160,130,255,0.18)" />
          <stop offset="100%" stopColor="rgba(160,130,255,0)" />
        </radialGradient>
      </defs>
      <rect width="360" height="225" rx="16" fill="url(#g5a)" />
      <rect width="360" height="225" rx="16" fill="url(#g5b)" />
      {/* Estrellas/constelación */}
      {[
        [280,30],[305,22],[295,50],[320,40],[312,65],
        [260,55],[340,35],[330,60],[275,70],[345,15],
        [30,35],[55,28],[45,55],[70,42],[20,60],
        [200,18],[215,30],[225,15],[190,25],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 1.5 : 1} fill="rgba(200,190,255,0.65)" />
      ))}
      {/* Líneas constelación */}
      <line x1="280" y1="30" x2="305" y2="22" stroke="rgba(160,140,255,0.20)" strokeWidth="0.6" />
      <line x1="305" y1="22" x2="295" y2="50" stroke="rgba(160,140,255,0.18)" strokeWidth="0.6" />
      <line x1="295" y1="50" x2="320" y2="40" stroke="rgba(160,140,255,0.20)" strokeWidth="0.6" />
      <line x1="320" y1="40" x2="312" y2="65" stroke="rgba(160,140,255,0.15)" strokeWidth="0.6" />
      {/* Círculo nebulosa */}
      <circle cx="310" cy="155" r="55" fill="rgba(80,60,180,0.10)" />
      <circle cx="310" cy="155" r="35" fill="rgba(80,60,180,0.08)" />
      {/* Arco plateado decorativo */}
      <path d="M30 145 Q180 120 330 145" fill="none" stroke="rgba(200,190,255,0.18)" strokeWidth="0.8" />
      <path d="M30 152 Q180 130 330 152" fill="none" stroke="rgba(200,190,255,0.12)" strokeWidth="0.5" />
    </svg>
  );
}

function CardDesign6() {
  // Tu Cantidad — gradiente iridiscente teal→oro
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 225" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="g6a" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#006d77" />
          <stop offset="35%" stopColor="#00968a" />
          <stop offset="65%" stopColor="#7a9e3b" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
        <linearGradient id="g6b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.14)" />
        </linearGradient>
      </defs>
      <rect width="360" height="225" rx="16" fill="url(#g6a)" />
      <rect width="360" height="225" rx="16" fill="url(#g6b)" />
      {/* Efecto iridiscente — bandas diagonales */}
      <rect x="-50" y="-10" width="80" height="280" fill="rgba(255,255,255,0.04)" transform="rotate(-25 0 0)" />
      <rect x="70" y="-10" width="40" height="280" fill="rgba(255,255,255,0.035)" transform="rotate(-25 0 0)" />
      <rect x="160" y="-10" width="70" height="280" fill="rgba(255,255,255,0.04)" transform="rotate(-25 0 0)" />
      <rect x="270" y="-10" width="35" height="280" fill="rgba(255,255,255,0.03)" transform="rotate(-25 0 0)" />
      {/* Símbolo infinito — personalización */}
      <path d="M155 112 Q165 100 178 112 Q191 124 205 112 Q219 100 232 112 Q219 124 205 112 Q191 100 178 112 Q165 124 155 112 Z"
        fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.30)" strokeWidth="0.8" />
      {/* Puntos decorativos */}
      <circle cx="60" cy="165" r="3.5" fill="rgba(255,255,255,0.22)" />
      <circle cx="80" cy="155" r="2.5" fill="rgba(255,255,255,0.18)" />
      <circle cx="100" cy="168" r="3" fill="rgba(255,255,255,0.20)" />
      <circle cx="120" cy="158" r="2" fill="rgba(255,255,255,0.15)" />
      <line x1="60" y1="165" x2="80" y2="155" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
      <line x1="80" y1="155" x2="100" y2="168" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
      <line x1="100" y1="168" x2="120" y2="158" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
    </svg>
  );
}

const DESIGNS = [CardDesign1, CardDesign2, CardDesign3, CardDesign4, CardDesign5, CardDesign6];

// ─── Datos de tarjetas ─────────────────────────────────────────────────────────

interface TarjetaOpc {
  id: number;
  nombre: string;
  monto: number | null;
  tagline: string;
  accentColor: string;
  textColor: string;
  etiqueta: string;
}

const TARJETAS: TarjetaOpc[] = [
  {
    id: 1, nombre: 'Bienestar Esencial', monto: 100,
    tagline: 'El primer paso hacia tu bienestar',
    accentColor: '#00B7C4', textColor: '#ffffff', etiqueta: 'Inicio perfecto',
  },
  {
    id: 2, nombre: 'Ritual de Cuidado', monto: 200,
    tagline: 'Un momento de cuidado profundo',
    accentColor: '#e8a0c0', textColor: '#ffffff', etiqueta: 'Más elegida',
  },
  {
    id: 3, nombre: 'Experiencia H₂', monto: 500,
    tagline: 'Terapia molecular de siguiente nivel',
    accentColor: '#00B7C4', textColor: '#ffffff', etiqueta: 'Premium',
  },
  {
    id: 4, nombre: 'Lujo Terapéutico', monto: 1000,
    tagline: 'Una experiencia wellness completa',
    accentColor: '#c9a84c', textColor: '#ffffff', etiqueta: 'Exclusivo',
  },
  {
    id: 5, nombre: 'Platino H₂', monto: 2000,
    tagline: 'El máximo en bienestar molecular',
    accentColor: '#a082ff', textColor: '#ffffff', etiqueta: 'Ultra Lujo',
  },
  {
    id: 6, nombre: 'Tu Cantidad', monto: null,
    tagline: 'Personaliza el valor de tu regalo',
    accentColor: '#c9a84c', textColor: '#ffffff', etiqueta: 'A tu medida',
  },
];

// ─── Componente tarjeta visual ─────────────────────────────────────────────────

function GiftCard({
  tarjeta, Design, selected, onClick, isMobile,
}: {
  tarjeta: TarjetaOpc;
  Design: () => ReactElement;
  selected: boolean;
  onClick: () => void;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '1rem',
        overflow: 'hidden',
        aspectRatio: '1.6 / 1',
        cursor: 'pointer',
        boxShadow: selected
          ? `0 0 0 3px ${tarjeta.accentColor}, 0 12px 40px rgba(0,0,0,0.22)`
          : hovered
          ? '0 10px 32px rgba(0,0,0,0.20)'
          : '0 2px 16px rgba(0,0,0,0.12)',
        transform: selected ? 'translateY(-4px) scale(1.01)' : hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Diseño SVG de fondo */}
      <Design />

      {/* Contenido sobre el SVG */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: isMobile ? '0.9rem 1rem' : '1.1rem 1.25rem',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Fila superior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              margin: 0, fontSize: '0.55rem', letterSpacing: '0.22em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.70)', fontWeight: 600,
            }}>
              H2AQUA
            </p>
            <p style={{
              margin: '0.2rem 0 0', fontSize: '0.55rem', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 500,
            }}>
              Tarjeta de Regalo
            </p>
          </div>
          {/* Etiqueta */}
          <span style={{
            fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '0.22rem 0.55rem', borderRadius: '999px',
            backgroundColor: 'rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.90)', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {tarjeta.etiqueta}
          </span>
        </div>

        {/* Monto central */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            margin: 0,
            fontSize: isMobile ? '1.65rem' : '2rem',
            fontWeight: 200,
            color: '#ffffff',
            letterSpacing: '0.02em',
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}>
            {tarjeta.monto !== null ? `$${tarjeta.monto.toLocaleString()}` : '$ — —'}
          </p>
          <p style={{
            margin: '0.2rem 0 0',
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.62)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {tarjeta.monto !== null ? 'MXN' : 'Monto personalizado'}
          </p>
        </div>

        {/* Fila inferior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{
              margin: 0,
              fontSize: isMobile ? '0.68rem' : '0.75rem',
              color: '#ffffff',
              fontWeight: 600,
              letterSpacing: '0.03em',
            }}>
              {tarjeta.nombre}
            </p>
            <p style={{
              margin: '0.1rem 0 0',
              fontSize: '0.55rem',
              color: 'rgba(255,255,255,0.60)',
              fontStyle: 'italic',
            }}>
              {tarjeta.tagline}
            </p>
          </div>
          {/* Check de selección */}
          {selected && (
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              backgroundColor: tarjeta.accentColor,
              border: '2px solid rgba(255,255,255,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generarCodigo(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `H2-${seg()}-${seg()}-${seg()}`;
}

// ─── Componente principal ──────────────────────────────────────────────────────

export default function TarjetaRegalo({
  onAgregarAlCarrito,
  irAlCarrito,
}: {
  onAgregarAlCarrito: (item: Omit<ItemCarrito, 'cantidad'>) => void;
  irAlCarrito: () => void;
}) {
  const isMobile = useIsMobile();
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [montoCustom, setMontoCustom] = useState('');
  const [para, setPara] = useState('');
  const [de, setDe] = useState('');
  const [emailDest, setEmailDest] = useState('');
  const [mensaje, setMensaje] = useState('');

  const tarjetaActual = seleccionada !== null ? TARJETAS.find((t) => t.id === seleccionada) : null;
  const montoFinal = tarjetaActual?.monto ?? (montoCustom ? Number(montoCustom) : null);
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDest);
  const puedeAgregar =
    seleccionada !== null &&
    montoFinal !== null && montoFinal >= 50 &&
    para.trim().length > 0 &&
    de.trim().length > 0 &&
    emailValido;

  function agregarAlCarrito() {
    if (!puedeAgregar || !tarjetaActual) return;
    const codigo = generarCodigo();
    onAgregarAlCarrito({
      id: -(Date.now()),            // ID negativo único → no colisiona con productos reales
      nombre: `Tarjeta de Regalo · ${tarjetaActual.nombre}`,
      precio: montoFinal!,
      imagenUrl: null,
      esRegalo: true,
      codigoRegalo: codigo,
      emailDestinatario: emailDest.trim(),
      paraRegalo: para.trim(),
      deRegalo: de.trim(),
      mensajeRegalo: mensaje.trim() || undefined,
      nombreTarjeta: tarjetaActual.nombre,
    });
    irAlCarrito();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.65rem',
    border: `1px solid ${BORDER}`,
    backgroundColor: BG_CARD_ALT,
    color: TEXT_PRIMARY,
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: isMobile ? '1.5rem 0 3rem' : '2.5rem 0 5rem' }}>

      {/* ── Banner ── */}
      <div style={{
        position: 'relative', borderRadius: isMobile ? '1.25rem' : '1.75rem', overflow: 'hidden',
        marginBottom: isMobile ? '2rem' : '3rem',
        background: 'linear-gradient(135deg, #0b4a55 0%, #006d77 40%, #00968a 75%, #00B7C4 100%)',
        padding: isMobile ? '2.5rem 1.75rem' : '3.5rem 3.5rem',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '2rem',
      }}>
        {[
          { size: 380, top: '-80px', right: '-60px', op: 0.07 },
          { size: 160, bottom: '-20px', right: '15%', op: 0.06 },
          { size: 70, top: '30%', right: '28%', op: 0.09 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: b.size, height: b.size, borderRadius: '50%',
            top: (b as any).top, bottom: (b as any).bottom, right: (b as any).right,
            background: `radial-gradient(circle, rgba(255,255,255,${b.op}) 0%, transparent 65%)`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'relative', flex: 1 }}>
          <p style={{ margin: '0 0 0.9rem', textTransform: 'uppercase', letterSpacing: '0.28em', fontSize: '0.65rem', color: 'rgba(255,255,255,0.60)', fontWeight: 600 }}>
            H2AQUA · Regalo Perfecto
          </p>
          <h1 style={{ margin: '0 0 0.75rem', fontSize: isMobile ? '1.9rem' : '2.6rem', fontWeight: 200, letterSpacing: '0.02em', color: '#ffffff', lineHeight: 1.15 }}>
            Tarjeta de Regalo
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: '1rem', maxWidth: '440px', lineHeight: 1.7 }}>
            Regala una experiencia de bienestar molecular. La persona que más quieres
            elige lo que necesita — desde terapias de hidrógeno hasta skincare coreano.
          </p>
        </div>

        {!isMobile && (
          <div style={{
            position: 'relative', flexShrink: 0, width: '220px',
            borderRadius: '0.85rem', overflow: 'hidden', aspectRatio: '1.6 / 1',
            boxShadow: '0 12px 40px rgba(0,0,0,0.30)', transform: 'rotate(-4deg)',
          }}>
            <CardDesign4 />
            <div style={{ position: 'absolute', inset: 0, padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: '0.48rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>H2AQUA · Tarjeta de Regalo</p>
              <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 200, color: '#fff', textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>$1,000</p>
              <p style={{ margin: 0, fontSize: '0.6rem', color: '#fff', fontWeight: 600 }}>Lujo Terapéutico</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Intro pasos ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem', marginBottom: isMobile ? '2rem' : '3rem' }}>
        {[
          { icon: '🎁', titulo: 'Elige tu tarjeta', desc: 'Selecciona el monto — desde $100 hasta $2,000 o el valor que tú elijas.' },
          { icon: '✉️', titulo: 'Personaliza el regalo', desc: 'Agrega el correo del destinatario, un mensaje y los nombres.' },
          { icon: '🛒', titulo: 'Agrega al carrito', desc: 'Se genera un código único que se enviará por correo al completar el pago.' },
        ].map((item) => (
          <div key={item.titulo} style={{ backgroundColor: BG_CARD, borderRadius: '1rem', padding: '1.25rem 1.5rem', border: `1px solid ${BORDER_SUBTLE}`, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
            <div>
              <p style={{ margin: '0 0 0.3rem', fontWeight: 600, color: TEXT_PRIMARY, fontSize: '0.88rem' }}>{item.titulo}</p>
              <p style={{ margin: 0, color: TEXT_MUTED, fontSize: '0.78rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Paso 1: Elegir tarjeta ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: '0 0 0.35rem', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>Paso 1</p>
        <h2 style={{ margin: 0, fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 300, color: TEXT_PRIMARY }}>Elige tu tarjeta de regalo</h2>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? '0.75rem' : '1.25rem', marginBottom: isMobile ? '2.5rem' : '3.5rem',
      }}>
        {TARJETAS.map((t, i) => (
          <GiftCard key={t.id} tarjeta={t} Design={DESIGNS[i]} selected={seleccionada === t.id} onClick={() => setSeleccionada(t.id)} isMobile={isMobile} />
        ))}
      </div>

      {/* ── Monto custom ── */}
      {seleccionada === 6 && (
        <div style={{ backgroundColor: BG_CARD, borderRadius: '1rem', padding: '1.5rem', border: `1px solid ${BORDER}`, marginBottom: '2rem' }}>
          <p style={{ margin: '0 0 0.35rem', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>Monto personalizado</p>
          <p style={{ margin: '0 0 1rem', color: TEXT_SECONDARY, fontSize: '0.88rem' }}>Escribe el valor que deseas para tu tarjeta de regalo (mínimo $50 MXN)</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '260px' }}>
            <span style={{ fontSize: '1.25rem', color: TEXT_MUTED, fontWeight: 300 }}>$</span>
            <input type="number" placeholder="Ej. 750" min="50" value={montoCustom} onChange={(e) => setMontoCustom(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <span style={{ fontSize: '0.8rem', color: TEXT_MUTED, flexShrink: 0 }}>MXN</span>
          </div>
        </div>
      )}

      {/* ── Paso 2: Personalizar ── */}
      {seleccionada !== null && (
        <div style={{ backgroundColor: BG_CARD, borderRadius: '1.25rem', padding: isMobile ? '1.5rem' : '2rem', border: `1px solid ${BORDER}`, boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 0.35rem', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, fontWeight: 600 }}>Paso 2</p>
            <h2 style={{ margin: 0, fontSize: isMobile ? '1.3rem' : '1.6rem', fontWeight: 300, color: TEXT_PRIMARY }}>Personaliza tu regalo</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: TEXT_SECONDARY, marginBottom: '0.4rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Para (destinatario) *</label>
              <input type="text" placeholder="¿A quién va dirigido?" value={para} onChange={(e) => setPara(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: TEXT_SECONDARY, marginBottom: '0.4rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>De (tu nombre) *</label>
              <input type="text" placeholder="¿De parte de quién?" value={de} onChange={(e) => setDe(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: TEXT_SECONDARY, marginBottom: '0.4rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Correo del destinatario *
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={emailDest}
              onChange={(e) => setEmailDest(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: emailDest && !emailValido ? '#e0556a' : BORDER,
              }}
            />
            {emailDest && !emailValido && (
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#e0556a' }}>Ingresa un correo válido</p>
            )}
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: TEXT_MUTED }}>
              El código de regalo se enviará a este correo al completar el pago.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: TEXT_SECONDARY, marginBottom: '0.4rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Mensaje personal (opcional)</label>
            <textarea
              placeholder="Escribe un mensaje especial para acompañar tu regalo..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          {/* Resumen */}
          {puedeAgregar && (
            <div style={{
              backgroundColor: BG_CARD_ALT, borderRadius: '0.75rem', padding: '1rem 1.25rem',
              marginBottom: '1.25rem', border: `1px solid ${BORDER_SUBTLE}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
            }}>
              <div>
                <p style={{ margin: '0 0 0.15rem', fontSize: '0.7rem', color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Resumen</p>
                <p style={{ margin: 0, fontWeight: 700, color: TEXT_PRIMARY, fontSize: '0.95rem' }}>
                  {tarjetaActual?.nombre} · ${montoFinal?.toLocaleString()} MXN
                </p>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.78rem', color: TEXT_SECONDARY }}>
                  Para: {para} &nbsp;·&nbsp; Envío a: {emailDest}
                </p>
              </div>
              <div style={{ padding: '0.3rem 0.85rem', borderRadius: '999px', backgroundColor: 'rgba(31,186,122,0.12)', color: '#1fba7a', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Listo
              </div>
            </div>
          )}

          <button
            onClick={agregarAlCarrito}
            disabled={!puedeAgregar}
            style={{
              width: '100%', padding: '1rem', borderRadius: '0.75rem', border: 'none',
              background: puedeAgregar
                ? `linear-gradient(135deg, ${TEAL}, #00B7C4)`
                : `linear-gradient(135deg, rgba(0,109,119,0.25), rgba(0,183,196,0.25))`,
              color: puedeAgregar ? '#ffffff' : TEXT_MUTED,
              fontSize: '0.95rem', fontWeight: 700,
              cursor: puedeAgregar ? 'pointer' : 'default',
              letterSpacing: '0.04em', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Agregar al carrito
          </button>

          {!puedeAgregar && (
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.76rem', color: TEXT_MUTED, textAlign: 'center' }}>
              Completa todos los campos obligatorios para continuar
            </p>
          )}
        </div>
      )}
    </div>
  );
}
