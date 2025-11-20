import React from 'react';
import { ArrowLeft, Download, Upload, Edit3 } from 'lucide-react';
import { BG_PURPLE, YELLOW_LEMON, VIOLET_LEMON } from './types';
import type { DisplaySliceData, Screen, SliceData } from './types';

interface Props {
  slice: DisplaySliceData;
  navigate: (screen: Screen, data?: SliceData) => void;
}

const InfoSlice: React.FC<Props> = ({ slice, navigate }) => {
  // Desestructuramos los datos REALES que vienen por props
  const { nombre, monto_actual, meta, moneda, isCrypto, dolar_conversion, percentageCompleted, remainingAmount } = slice;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center" style={{ backgroundColor: BG_PURPLE }}>
      {/* Header */}
      <header className="w-full max-w-md flex justify-start items-center mb-6 pt-4">
        <button onClick={() => navigate('inicio')} aria-label="Volver atrás">
          <ArrowLeft className="text-white w-7 h-7" />
        </button>
      </header>

      <div className="w-full max-w-md flex flex-col space-y-4">
        {/* 1. Tarjeta Principal: Monto */}
        <div className="bg-white p-6 rounded-[40px] shadow-xl text-center py-10">
          <p className="text-gray-500 text-sm font-bold mb-2 uppercase tracking-wider" style={{ color: VIOLET_LEMON }}>
            {nombre}
          </p>
          <h1 className="text-5xl font-extrabold text-violet-800 mb-1 break-words">
             {monto_actual.toLocaleString('es-AR')} <span className="text-3xl">{moneda}</span>
          </h1>
          {isCrypto && dolar_conversion !== undefined && (
            <p className="text-lg text-gray-500 font-semibold mt-2">
              ≈ {dolar_conversion.toLocaleString('es-AR', { style: 'currency', currency: 'USD' })} USD
            </p>
          )}
        </div>

        {/* 2. Tarjeta de Progreso */}
        <div className="bg-white p-6 rounded-[40px] shadow-xl flex flex-col space-y-4">
          <h2 className="text-xl font-bold text-violet-800 mb-2">Progreso de la Meta</h2>
          
          <div className="flex justify-between items-end text-sm text-gray-600">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-green-600">{percentageCompleted.toFixed(0)}%</span>
              <span className="text-xs font-bold text-gray-400">COMPLETADO</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-violet-800">{meta.toLocaleString('es-AR')} {moneda}</span>
              <span className="text-xs font-bold text-gray-400 uppercase">Meta</span>
            </div>
          </div>

          {/* Barra */}
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full transition-all duration-700 ease-out"
              style={{ width: `${percentageCompleted}%`, backgroundColor: YELLOW_LEMON }}
            ></div>
          </div>

          <p className="text-center text-sm text-gray-500 pt-2 font-medium">
            Faltan <span className="font-bold text-violet-800">{remainingAmount.toLocaleString('es-AR')} {moneda}</span> para llegar.
          </p>
        </div>

        {/* 3. Botonera de Acciones */}
        <div className="flex justify-around py-6">
          {/* Depositar */}
          <button onClick={() => navigate('depositar', slice)} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition transform group-active:scale-95" style={{ backgroundColor: YELLOW_LEMON }}>
              <Download className="w-8 h-8" style={{ color: BG_PURPLE }} />
            </div>
            <span className="text-white font-bold text-sm">Depositar</span>
          </button>

          {/* Retirar */}
          <button onClick={() => navigate('retirar', slice)} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transition transform group-active:scale-95">
              <Upload className="w-8 h-8 text-violet-600" />
            </div>
            <span className="text-white font-bold text-sm">Retirar</span>
          </button>

          {/* Editar */}
          <button onClick={() => navigate('editar', slice)} className="flex flex-col items-center gap-2 group">
             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transition transform group-active:scale-95">
              <Edit3 className="w-8 h-8 text-violet-600" />
            </div>
            <span className="text-white font-bold text-sm">Editar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoSlice;