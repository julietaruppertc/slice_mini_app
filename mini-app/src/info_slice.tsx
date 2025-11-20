import React from 'react';
import { ArrowLeft, Download, Upload, Edit3 } from 'lucide-react';
import { BG_PURPLE, YELLOW_LEMON } from './types';
import type { DisplaySliceData, Screen, SliceData } from './types';
import styles, { progressBarInner, actionIconCircle } from './infoSliceStyles';

interface Props {
  slice: DisplaySliceData;
  navigate: (screen: Screen, data?: SliceData) => void;
}

const InfoSlice: React.FC<Props> = ({ slice, navigate }) => {
  // Desestructuramos los datos REALES que vienen por props
  const { nombre, monto_actual, meta, moneda, isCrypto, dolar_conversion, percentageCompleted, remainingAmount } = slice;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('inicio')} aria-label="Volver atrás" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <ArrowLeft style={{ color: '#ffffff', width: 28, height: 28 }} />
        </button>
      </header>

      <div style={styles.wrapper}>
        {/* 1. Tarjeta Principal: Monto */}
        <div style={styles.card}>
          <p style={styles.subLabel}>
            {nombre}
          </p>
          <h1 style={styles.amount}>
             {monto_actual.toLocaleString('es-AR')} <span style={styles.amountSmall}>{moneda}</span>
          </h1>
          {isCrypto && dolar_conversion !== undefined && (
            <p style={{ fontSize: '1.125rem', color: '#6b7280', fontWeight: 600, marginTop: 8 }}>
              ≈ {dolar_conversion.toLocaleString('es-AR', { style: 'currency', currency: 'USD' })} USD
            </p>
          )}
        </div>

        {/* 2. Tarjeta de Progreso */}
        <div style={styles.progCard}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#4c1d95', marginBottom: 8 }}>Progreso de la Meta</h2>
          
          <div style={styles.progressRow}>
            <div style={styles.progressBoxLeft}>
              <span style={styles.progressPercent}>{percentageCompleted.toFixed(0)}%</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af' }}>COMPLETADO</span>
            </div>
            <div style={styles.progressBoxRight}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#4c1d95' }}>{meta.toLocaleString('es-AR')} {moneda}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Meta</span>
            </div>
          </div>

          {/* Barra */}
          <div style={styles.progressBarOuter}>
            <div style={progressBarInner(percentageCompleted)} />
          </div>

          <p style={styles.progressText}>
            Faltan <span style={{ fontWeight: 700, color: '#4c1d95' }}>{remainingAmount.toLocaleString('es-AR')} {moneda}</span> para llegar.
          </p>
        </div>

        {/* 3. Botonera de Acciones */}
        <div style={styles.actionsRow}>
          {/* Depositar */}
          <button onClick={() => navigate('depositar', slice)} style={styles.actionButton}>
            <div style={actionIconCircle(YELLOW_LEMON)}>
              <Download style={{ color: BG_PURPLE, width: 24, height: 24 }} />
            </div>
            <span style={styles.actionLabelWhite}>Depositar</span>
          </button>

          {/* Retirar */}
          <button onClick={() => navigate('retirar', slice)} style={styles.actionButton}>
            <div style={actionIconCircle('#ffffff')}>
              <Upload style={{ color: '#4c1d95', width: 24, height: 24 }} />
            </div>
            <span style={styles.actionLabelWhite}>Retirar</span>
          </button>

          {/* Editar */}
          <button onClick={() => navigate('editar', slice)} style={styles.actionButton}>
            <div style={actionIconCircle('#ffffff')}>
              <Edit3 style={{ color: '#4c1d95', width: 24, height: 24 }} />
            </div>
            <span style={styles.actionLabelWhite}>Editar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoSlice;