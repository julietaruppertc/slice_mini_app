import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { 
  BG_PURPLE, YELLOW_LEMON, VIOLET_LEMON, 
  FONT_HEADLINE, FONT_SERIF, notifyStorageChange
} from './types';
import type { SliceData, DisplaySliceData, Screen } from './types';


// Simulación de cotizaciones de criptomonedas (para el cálculo de USD)
const CRYPTO_PRICES: { [key: string]: number } = {
  'ETH': 3500, // 1 ETH = 3500 USD
  'BTC': 70000, // 1 BTC = 70000 USD
  'USDC': 1,
  'USDT': 1,
  'DAI': 1,
  'POL': 0.7, // Ejemplo
};

// Función de utilidad para calcular la DisplaySliceData
const calculateDisplayData = (slice: SliceData): DisplaySliceData => {
  const isCrypto = ['ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'POL'].includes(slice.moneda);
  const monto_actual = slice.montoInicial;
  
  let dolar_conversion: number | undefined;
  if (isCrypto) {
    const price = CRYPTO_PRICES[slice.moneda] || 0;
    dolar_conversion = monto_actual * price;
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

// ----------------------------------------------------------------------
// Componente Tarjeta de Slice
// ----------------------------------------------------------------------

const SliceCard: React.FC<{ slice: DisplaySliceData; onClick: (slice: DisplaySliceData) => void }> = ({ slice, onClick }) => {
  const { nombre, monto_actual, meta, moneda, percentageCompleted, isCrypto, dolar_conversion } = slice;

  return (
    <button 
      onClick={() => onClick(slice)} 
      className="w-full p-4 bg-white rounded-3xl shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98] text-left"
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold" style={{ color: VIOLET_LEMON }}>{nombre}</h2>
        <div className={`px-3 py-1 text-xs font-semibold rounded-full ${percentageCompleted >= 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {percentageCompleted >= 100 ? '¡Meta!' : `${percentageCompleted.toFixed(0)}%`}
        </div>
      </div>
      
      {/* Monto principal */}
      <p className="text-3xl font-extrabold text-gray-800">
        {monto_actual.toLocaleString('es-AR')} <span className="text-xl font-medium">{moneda}</span>
      </p>

      {/* Conversión y Meta */}
      <div className="text-sm mt-1 text-gray-500">
        {isCrypto && dolar_conversion !== undefined && (
            <p className="font-medium">{dolar_conversion.toLocaleString('es-AR', { style: 'currency', currency: 'USD' })} USD</p>
        )}
        <p>Meta: {meta.toLocaleString('es-AR')} {moneda}</p>
      </div>

      {/* Barra de Progreso */}
      <div className="mt-3">
        <div className="h-1 bg-gray-200 rounded-full">
          <div
            className="h-full rounded-full"
            style={{ 
              width: `${percentageCompleted}%`, 
              backgroundColor: percentageCompleted >= 100 ? '#4CAF50' : YELLOW_LEMON 
            }}
          ></div>
        </div>
      </div>
    </button>
  );
};


// ----------------------------------------------------------------------
// Componente Dashboard (Inicio)
// ----------------------------------------------------------------------

const InicioScreen: React.FC<{ navigate: (screen: Screen, data?: DisplaySliceData) => void }> = ({ navigate }) => {
  const [slices, setSlices] = useState<DisplaySliceData[]>([]);
  const [loading, setLoading] = useState(true);

  // Carga los datos de LocalStorage
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

  // Efecto para cargar datos y escuchar cambios en LocalStorage
  useEffect(() => {
    loadSlices();

    // Escuchar el evento 'storage' para recargar cuando otras pantallas modifiquen los datos
    window.addEventListener('storage', loadSlices);
    return () => {
      window.removeEventListener('storage', loadSlices);
    };
  }, []);

  // Calcula el monto total reservado
  const totalReservado = slices.reduce((sum, slice) => {
    // Para simplificar, sumaremos el monto en ARS y el valor en USD de las criptos.
    // Una aplicación real usaría una moneda base (ej. USD o ARS) para la suma total.
    const value = slice.isCrypto && slice.dolar_conversion !== undefined 
      ? slice.dolar_conversion 
      : slice.monto_actual;
    
    // Aquí asumimos que las monedas que no son cripto son ARS/USD fijos. 
    // Si la moneda es ARS, asumimos el valor nominal. Si es USD, sumamos USD.
    if (slice.moneda === 'ARS' || slice.moneda === 'USD') {
        return sum + value;
    }
    // Si es crypto, sumamos el valor en USD.
    if (slice.isCrypto && slice.dolar_conversion) {
        return sum + slice.dolar_conversion;
    }
    return sum;
  }, 0);


  return (
    <div className="min-h-screen p-4 flex flex-col items-center" style={{ backgroundColor: BG_PURPLE }}>
      <header className="w-full max-w-md pt-4 mb-8">
        <h1 
          className="text-5xl font-extrabold text-center"
          style={{ color: YELLOW_LEMON, fontFamily: FONT_HEADLINE }}
        >
          Slice
        </h1>
      </header>

      <div className="w-full max-w-md flex flex-col space-y-6">
        
        {/* Total Reservado Card */}
        <div className="p-6 rounded-[50px] shadow-2xl text-center" style={{ backgroundColor: VIOLET_LEMON }}>
          <p className="text-white/80 text-lg font-medium mb-1 uppercase tracking-wider">Total Reservado</p>
          <h2 
            className="text-4xl font-extrabold"
            style={{ color: YELLOW_LEMON, fontFamily: FONT_SERIF }}
          >
            {totalReservado.toLocaleString('es-AR', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD~
          </h2>
          <p className="text-white/60 text-xs mt-1">
            (Valor aproximado en USD)
          </p>
        </div>

        {/* Botón Flotante para Crear Slice */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('crear')}
            className="flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-bold shadow-2xl transition transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: YELLOW_LEMON, color: BG_PURPLE }}
          >
            <Plus className="w-6 h-6" />
            <span>Crear Slice</span>
          </button>
        </div>


        {/* Lista de Slices */}
        <div className="space-y-4 pt-4">
          <h3 className="text-2xl font-bold text-white mb-4">Mis Reservas</h3>
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
    </div>
  );
};

export default InicioScreen;