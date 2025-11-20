import React, { useState, useEffect } from 'react';
import { HeartIcon, Plus } from 'lucide-react';
import { 
  BG_PURPLE, YELLOW_LEMON, VIOLET_LEMON, 
  FONT_HEADLINE, FONT_SERIF, notifyStorageChange,
  // Asumiendo que hay un color para el progreso menor a 100% y un gris para el fondo
} from './types';
import type { SliceData, DisplaySliceData, Screen } from './types';


// Simulación de cotizaciones de criptomonedas (para el cálculo de USD)
const CRYPTO_PRICES: { [key: string]: number } = {
  'ARS': 1,
  'USDC': 1,
  'ETH': 3500, // 1 ETH = 3500 USD
  'BTC': 70000, // 1 BTC = 70000 USD
  'USDT': 1,
  'DAI': 1,
  'POL': 0.7, // Ejemplo
};

// Función de utilidad para calcular la DisplaySliceData
const calculateDisplayData = (slice: SliceData): DisplaySliceData => {
  const isCrypto = ['ARS','ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'POL'].includes(slice.moneda);
  const monto_actual = slice.montoInicial;
  
  let dolar_conversion: number | undefined;
  if (isCrypto) {
    const price = CRYPTO_PRICES[slice.moneda] || 0;
    dolar_conversion = monto_actual * price;
  } else if (slice.moneda === 'USD') {
      dolar_conversion = monto_actual;
  }
  
  // Calcular porcentaje completado, asegurando que no exceda el 100%
  const percentageCompleted = slice.meta > 0 
    ? Math.min((monto_actual / slice.meta) * 100, 100) 
    : (monto_actual > 0 ? 100 : 0);
    
  const remainingAmount = slice.meta - monto_actual;


  return {
    ...slice,
    monto_actual: monto_actual,
    isCrypto,
    dolar_conversion,
    percentageCompleted,
    remainingAmount: remainingAmount > 0 ? remainingAmount : 0,
  };
};


const SliceCard: React.FC<{ slice: DisplaySliceData; onClick: (slice: DisplaySliceData) => void }> = ({ slice, onClick }) => {
  const { nombre, monto_actual, meta, moneda, percentageCompleted, isCrypto, dolar_conversion } = slice;

  // Formateo del monto principal y meta
  const formatAmount = (amount: number) => 
    amount.toLocaleString('es-AR', { maximumFractionDigits: isCrypto ? 3 : 0 });

  // Cálculo del porcentaje para la línea de progreso
  const progressLine = percentageCompleted.toFixed(0);
  
  // Texto de la meta
  const metaText = `para alcanzar la meta de ${formatAmount(meta)} ${moneda}`;
  
  // Cálculo del monto en USD para criptos (como en la imagen de ejemplo)
  const usdText = (dolar_conversion !== undefined && isCrypto) ? 
    dolar_conversion.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', '').replace(',', '.') : '';


  return (
    <button 
      onClick={() => onClick(slice)} 
      className="w-full p-4 rounded-[30px] shadow-2xl transition transform hover:scale-[1.02] active:scale-[0.98] text-left overflow-hidden"
      style={{ 
        backgroundColor: VIOLET_LEMON, 
        // Desactivamos el autoescalado de texto (si se refiere a que la tarjeta no cambie de tamaño)
        // El autoescalado de fuente se controla a nivel de CSS global o con la configuración de font-size.
        // Aquí aseguramos que el padding y tamaño sean fijos.
      }}
    >
      <div className="relative z-10 flex flex-col justify-start items-start">
        {/* Nombre del Slice */}
        <h2 className="text-white/80 text-xl font-medium mb-1">{nombre}</h2>
        
        {/* Monto principal */}
        <p 
          className="text-5xl font-extrabold"
          style={{ color: YELLOW_LEMON, fontFamily: FONT_SERIF }}
        >
          {formatAmount(monto_actual)} <span className="text-3xl font-light">{moneda}</span>
        </p>

        {/* Conversión a USD (solo para criptos) */}
        {isCrypto && dolar_conversion !== undefined && (
            <p className="text-white/70 text-lg font-medium mt-1 mb-2">
                {usdText} USD
            </p>
        )}
        
        {/* Progreso */}
        <p className="text-white/70 text-sm mt-2 mb-4">
            <span className="font-bold">{progressLine}%</span> {metaText}
        </p>
      </div>

      {/* Barra de Progreso - Estilo de la imagen */}
      <div 
        className="absolute bottom-0 left-0 h-full rounded-[30px] opacity-20" 
        style={{ 
          width: `${percentageCompleted}%`, 
          backgroundColor: YELLOW_LEMON, 
          transition: 'width 0.5s ease-in-out'
        }}
      ></div>
      {/* Indicador de meta alcanzada, si se desea un estilo diferente */}
      {percentageCompleted >= 100 && (
          <div className="absolute top-0 right-0 m-4 px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
              ¡Meta!
          </div>
      )}
    </button>
  );
};


// ----------------------------------------------------------------------
// Componente Dashboard (Inicio)
// ----------------------------------------------------------------------

const InicioScreen: React.FC<{ navigate: (screen: Screen, data?: DisplaySliceData) => void }> = ({ navigate }) => {
  const [slices, setSlices] = useState<DisplaySliceData[]>([]);
  const [loading, setLoading] = useState(true);

  // ... (loadSlices y useEffect se mantienen iguales)
  const loadSlices = () => {
    setLoading(true);
    try {
      const storedSlices: SliceData[] = JSON.parse(localStorage.getItem('slices') || '[]');
      const displaySlices = storedSlices.map(calculateDisplayData);
      setSlices(displaySlices);
    } catch (e) {
      console.error("Error al cargar las Slices:", e);
      setSlices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlices();
    window.addEventListener('storage', loadSlices);
    return () => {
      window.removeEventListener('storage', loadSlices);
    };
  }, []);
  // ... (totalReservado se mantiene, aunque no se usa en el UI final)
  const totalReservado = slices.reduce((sum, slice) => {
    const value = slice.isCrypto && slice.dolar_conversion !== undefined 
      ? slice.dolar_conversion 
      : slice.monto_actual;
    
    if (slice.moneda === 'ARS' || slice.moneda === 'USD') {
        return sum + value;
    }
    if (slice.isCrypto && slice.dolar_conversion) {
        return sum + slice.dolar_conversion;
    }
    return sum;
  }, 0);


  return (
    <div  style={{ minHeight: '100vh', backgroundColor: BG_PURPLE, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
      

      <div>
        
        {/* Botón Principal para Crear Slice - Estilo de la imagen */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => navigate('crear')}
            className="w-full px-6 py-4 rounded-[20px] text-xl font-extrabold shadow-2xl transition transform hover:scale-[1.01] active:scale-[0.99] uppercase"
            style={{ backgroundColor: YELLOW_LEMON, color: BG_PURPLE }}
          >
            <span>Crear Slice</span>
          </button>
        </div>

        {/* Lista de Slices (Sin el título "Mis Reservas" para seguir el diseño) */}
        <div className="space-y-4 pt-2" style={{ minHeight: '100%' }}>
          {loading ? (
            <p className="text-white/70 text-center">Cargando Slices...</p>
          ) : slices.length === 0 ? (
            <div className="text-center p-6 bg-white/10 rounded-xl">
              <p className="text-white font-medium">No tienes Slices activas. ¡Crea una para empezar a ahorrar!</p>
            </div>
          ) : (
            slices.map(slice => (
              <SliceCard 
                key={slice.id_reserva} 
                slice={slice} 
                onClick={(s) => navigate('info', s)} 
              />
            ))
          )}
        </div>
      </div>
      
      {/* Espaciado al final */}
      <div className='pb-10'></div>
    </div>
  );
};

export default InicioScreen;