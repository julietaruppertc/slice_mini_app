import React from 'react';
import { Download, Upload, Edit3, ArrowLeft } from 'lucide-react';

// --- Tipos de Datos (Basado en el Modelo de Datos de la documentación) ---

// Definición de la entidad Divisa/Token
interface Currency {
  id_divisa: string; // Ej: 'ETH', 'ARS', 'USD'
  nombre: string;
  isCrypto: boolean;
  symbol: string; // Símbolo para mostrar (ej: $, ETH)
}

// Definición de la entidad Slice/Reserva
interface Slice {
  id_reserva: string;
  nombre: string;
  meta: number;
  monto_actual: number;
  id_divisa: string;
  divisa: Currency;
  dolar_conversion?: number; // Valor actual en USD si es crypto
}

// --- Datos Simulados (Ejemplo de una Slice/Reserva) ---

const ETH: Currency = {
  id_divisa: 'ETH',
  nombre: 'Ethereum',
  isCrypto: true,
  symbol: 'ETH',
};

const sliceData: Slice = {
  id_reserva: '12345',
  nombre: 'Auto',
  meta: 98, // Meta en ETH
  monto_actual: 80, // Monto actual en ETH
  id_divisa: ETH.id_divisa,
  divisa: ETH,
  dolar_conversion: 23120, // Monto actual en USD (80 ETH * $289/ETH)
};

// --- Componentes Reutilizables ---

/**
 * Componente que simula la navegación a otras pantallas,
 * imprimiendo la acción y los parámetros en consola.
 * En una app real de Lemon Mini, esto usaría el SDK de navegación.
 */
const NavButton: React.FC<{
  icon: React.ReactNode;
  color: 'yellow' | 'white';
  label: string;
  action: () => void;
}> = ({ icon, color, label, action }) => (
  <button
    onClick={action}
    aria-label={label}
    className={`
      w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition duration-200
      ${color === 'yellow'
        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
        : 'bg-white text-violet-700 hover:bg-gray-100'
      }
    `}
  >
    {icon}
  </button>
);


// --- Componente Principal InfoSlice ---

const InfoSlice: React.FC = () => {
  const { nombre, monto_actual, meta, divisa, dolar_conversion } = sliceData;
  const isCrypto = divisa.isCrypto;

  // Cálculo del porcentaje completado
  const percentageCompleted = Math.min(100, (monto_actual / meta) * 100);
  const remainingAmount = meta - monto_actual;

  // Funcionalidades de Navegación (Simuladas)
  const goToDeposit = () => {
    console.log(`Navegar a 'Depositar.tsx' con moneda: ${divisa.id_divisa}`);
    // Simular la acción de navegación
  };

  const goToWithdraw = () => {
    console.log(`Navegar a 'Retirar.tsx' con moneda: ${divisa.id_divisa}`);
    // Simular la acción de navegación
  };

  const goToEdit = () => {
    console.log(`Navegar a 'Editar.tsx' con moneda: ${divisa.id_divisa}`);
    // Simular la acción de navegación
  };


  return (
    <div className="min-h-screen bg-violet-600 p-4 font-sans flex flex-col items-center">
      {/* Encabezado Fijo (simulando la barra superior de la app Lemon) */}
      <header className="w-full max-w-md flex justify-between items-center mb-6 pt-4">
        <button onClick={() => console.log('Volver a Dashboard')} aria-label="Volver atrás">
          <ArrowLeft className="text-white w-7 h-7" />
        </button>
        <span className="text-white text-xl font-semibold">Slice</span>
      </header>

      <div className="w-full max-w-md flex flex-col space-y-4">

        {/* 1. Contenedor Superior: Nombre, Monto Actual y Conversión USD */}
        <div className="bg-white p-6 rounded-3xl shadow-xl text-center">
          <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">
            {nombre}
          </p>
          <h1 className="text-5xl font-extrabold text-violet-800 mb-1">
            {monto_actual.toLocaleString('es-AR')} {divisa.symbol}
          </h1>
          {isCrypto && dolar_conversion && (
            <p className="text-lg text-gray-600 font-semibold">
              {dolar_conversion.toLocaleString('es-AR', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} USD
            </p>
          )}
        </div>

        {/* 2. Contenedor de Meta y Progreso */}
        <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col space-y-4">
          <h2 className="text-xl font-bold text-violet-800 mb-2">
            Progreso de la Meta
          </h2>

          {/* Información de Progreso */}
          <div className="flex justify-between items-end text-sm text-gray-600">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-green-600">
                {percentageCompleted.toFixed(1)}%
              </span>
              <span className="text-xs">Completado</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-violet-800">
                {meta.toLocaleString('es-AR')} {divisa.symbol}
              </span>
              <span className="text-xs">Meta</span>
            </div>
          </div>

          {/* Barra de Progreso */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-700 ease-out"
              style={{ width: `${percentageCompleted}%` }}
              role="progressbar"
              aria-valuenow={monto_actual}
              aria-valuemin={0}
              aria-valuemax={meta}
              aria-label={`Progreso del ${percentageCompleted.toFixed(1)}%`}
            ></div>
          </div>

          {/* Falta para la meta */}
          <p className="text-center text-sm text-gray-600 pt-2">
            Faltan <span className="font-bold text-violet-800">
              {remainingAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span> {divisa.symbol} para alcanzar la meta.
          </p>
        </div>

        {/* 3. Fila de Botones Circulares */}
        <div className="flex justify-around py-4">
          {/* Botón 1: Depositar (Download, Amarillo) */}
          <NavButton
            icon={<Download className="w-6 h-6" />}
            color="yellow"
            label="Depositar"
            action={goToDeposit}
          />

          {/* Botón 2: Retirar (Upload, Blanco) */}
          <NavButton
            icon={<Upload className="w-6 h-6" />}
            color="white"
            label="Retirar"
            action={goToWithdraw}
          />

          {/* Botón 3: Editar (Edit3, Blanco) */}
          <NavButton
            icon={<Edit3 className="w-6 h-6" />}
            color="white"
            label="Editar Slice"
            action={goToEdit}
          />
        </div>

        {/* 4. Historial de Movimientos (Simulado) - Basado en wireframes */}
        <h3 className="text-lg font-semibold text-white mt-4 mb-2">Historial de Movimientos</h3>
        <div className="bg-white rounded-3xl p-4 divide-y divide-gray-100 shadow-xl">
          {[
            { type: 'Retiro', amount: -1.54, date: '18 de Julio', symbol: 'ETH' },
            { type: 'Depósito', amount: 0.0034, date: '18 de Julio', symbol: 'ETH' },
            { type: 'Retiro', amount: -3.90, date: '5 de Mayo', symbol: 'ETH' },
          ].map((mov, index) => (
            <div key={index} className="flex justify-between items-center py-3">
              <div className="flex items-center space-x-3">
                {/* Icono de Divisa (Simulado con un círculo violeta) */}
                <div className="bg-violet-100 p-2 rounded-full">
                  <span className="text-violet-600 font-bold">{mov.symbol[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{mov.type} de {divisa.nombre}</p>
                  <p className="text-xs text-gray-500">{mov.date}</p>
                </div>
              </div>
              <p className={`font-semibold ${mov.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {mov.amount > 0 ? '+' : ''}{mov.amount.toLocaleString('es-AR', { minimumFractionDigits: 4 })} {mov.symbol}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoSlice;