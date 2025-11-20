import React, { useState, useEffect, useCallback } from 'react';
import { PlusCircle, ArrowLeft, ChevronDown } from 'lucide-react';

// --- Constantes y Colores de Diseño ---
const BG_PURPLE = '#806CF2';
const VIOLET_LEMON = '#5E2CBA';
const YELLOW_LEMON = '#F0EE00';
const CURRENCIES = ['ARS', 'USD', 'ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'POL'];
const FONT_HEADLINE = 'sans-serif'; // Simulación de "Stack Sans Headline"
const FONT_TEXT = 'sans-serif'; // Simulación de "Stack Sans Text"
const FONT_SERIF = 'serif'; // Simulación de "Stack Sans Serif"

// --- Tipos de Datos Compartidos ---

interface SliceData {
  id_reserva: string;
  nombre: string;
  moneda: string; // Ej: 'ETH', 'ARS', 'USD'
  meta: number;
  montoInicial: number; // Monto inicial, usado como monto_actual en este contexto simple
  timestamp: string;
}

// Interfaz para la data de la Slice con cálculo para simulación
interface DisplaySliceData extends SliceData {
  monto_actual: number;
  isCrypto: boolean;
  dolar_conversion?: number;
  percentageCompleted: number;
  remainingAmount: number;
}

// --- Componente de Tarjeta de Slice (SliceCard) ---

const SliceCard: React.FC<{ slice: DisplaySliceData; onSelect: (slice: DisplaySliceData) => void }> = ({ slice, onSelect }) => {
  const { nombre, monto_actual, moneda, meta, isCrypto, dolar_conversion, percentageCompleted, remainingAmount } = slice;

  return (
    <button
      onClick={() => onSelect(slice)}
      className="w-full max-w-md bg-white p-6 rounded-[50px] shadow-xl transition transform hover:scale-[1.01] text-center h-[370px] flex flex-col justify-around items-center"
      style={{ minWidth: '370px', minHeight: '164px' }} // Dimensiones especificadas
    >
      {/* Nombre de la Slice (Parte Superior) */}
      <h3 
        className="font-bold uppercase tracking-wider mb-2"
        style={{ fontSize: '16px', color: BG_PURPLE, fontFamily: FONT_TEXT }}
      >
        {nombre}
      </h3>

      {/* Monto Actual y Moneda */}
      <div className="flex flex-col items-center">
        <p 
          className="font-extrabold"
          style={{ fontSize: '40px', color: VIOLET_LEMON, fontFamily: FONT_TEXT, lineHeight: 1.1 }}
        >
          {monto_actual.toLocaleString('es-AR', { minimumFractionDigits: monto_actual % 1 !== 0 ? 2 : 0 })} {moneda}
        </p>

        {/* Equivalente en Dólares (Solo si es Crypto) */}
        {isCrypto && dolar_conversion && (
          <p 
            className="font-semibold mt-1"
            style={{ fontSize: '20px', color: VIOLET_LEMON, fontFamily: FONT_TEXT }}
          >
            {dolar_conversion.toLocaleString('es-AR', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} USD
          </p>
        )}
      </div>

      {/* Porcentaje y Meta (Parte Inferior) */}
      <div className="mt-4">
        <p 
          className="font-normal"
          style={{ fontSize: '12px', color: BG_PURPLE, fontFamily: FONT_SERIF }}
        >
          {percentageCompleted.toFixed(1)}% para alcanzar la meta de {meta.toLocaleString('es-AR', { minimumFractionDigits: meta % 1 !== 0 ? 2 : 0 })} {moneda}
        </p>
      </div>
    </button>
  );
};


// --- Componente de Dashboard (Inicio) ---

const Inicio: React.FC<{ navigate: (screen: 'crear' | 'info', data?: SliceData) => void }> = ({ navigate }) => {
  const [slices, setSlices] = useState<DisplaySliceData[]>([]);

  // Función de carga y procesamiento de Slices
  const loadSlices = useCallback(() => {
    try {
      const rawSlices: SliceData[] = JSON.parse(localStorage.getItem('slices') || '[]');
      
      const processedSlices: DisplaySliceData[] = rawSlices.map(s => {
        const isCrypto = ['ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'POL'].includes(s.moneda);
        const monto_actual = s.montoInicial; // Usamos montoInicial como monto_actual
        const percentageCompleted = Math.min(100, (monto_actual / s.meta) * 100);
        const remainingAmount = s.meta - monto_actual;
        
        // Simulación de conversión a USD (solo para cryptos)
        let dolar_conversion: number | undefined = undefined;
        if (isCrypto) {
            // Valor simulado de 23.120 USD para 80 ETH, lo usaremos como factor
            const simulatedEthValue = 23120; 
            if (s.moneda === 'ETH' && monto_actual !== 0) {
                 // Usar un factor de conversión simple (ej: $289 USD por unidad de ETH)
                 dolar_conversion = monto_actual * 289; 
            } else if (s.moneda !== 'ARS') {
                // Otras cryptos/dolares simulado a 1 USD por unidad
                 dolar_conversion = monto_actual * 1.05; 
            }
        }

        return {
          ...s,
          monto_actual,
          isCrypto,
          dolar_conversion: dolar_conversion ? Math.round(dolar_conversion) : undefined,
          percentageCompleted,
          remainingAmount,
        };
      });
      setSlices(processedSlices);
    } catch (error) {
      console.error('Error al cargar Slices desde LocalStorage:', error);
      setSlices([]);
    }
  }, []);

  // Cargar Slices al inicio y cada vez que el componente se monta
  useEffect(() => {
    loadSlices();
  }, [loadSlices]);


  // Handler para seleccionar una Slice
  const handleSelectSlice = (slice: DisplaySliceData) => {
    // Aquí se navega a InfoSlice pasándole todos los datos de la Slice
    navigate('info', slice);
  };

  return (
    <div 
      className="min-h-screen p-4 flex flex-col items-center pt-8"
      style={{ backgroundColor: BG_PURPLE }}
    >
      {/* Botón Principal: Crear Slice */}
      <button
        onClick={() => navigate('crear')}
        className="flex items-center justify-center rounded-full shadow-lg transition duration-200 hover:scale-105"
        style={{ 
          backgroundColor: YELLOW_LEMON, 
          width: '200px', 
          height: '50px', 
          marginBottom: '40px' 
        }}
      >
        <span 
          className="font-bold"
          style={{ 
            color: VIOLET_LEMON, 
            fontSize: '20px', 
            fontFamily: FONT_HEADLINE 
          }}
        >
          Crear Slice
        </span>
      </button>

      {/* Lista de Slices (Contenedores) */}
      <div className="w-full max-w-md flex flex-col space-y-6 items-center">
        {slices.length === 0 ? (
          <div className="text-center p-8 bg-white/20 rounded-xl mt-12">
            <PlusCircle className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
            <p className="text-white font-medium">
              No tienes Slices creadas. ¡Presiona "Crear Slice" para empezar!
            </p>
          </div>
        ) : (
          slices.map(slice => (
            <SliceCard key={slice.id_reserva} slice={slice} onSelect={handleSelectSlice} />
          ))
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Implementación Simplificada de CrearSlice (para navegación)
// ----------------------------------------------------------------------

// Este código es una copia simplificada de CrearSlice.tsx para que la navegación funcione.
const CrearSliceScreen: React.FC<{ navigate: () => void }> = ({ navigate }) => {
  const [formData, setFormData] = useState<SliceData>({
    nombre: '', moneda: '', meta: 0, montoInicial: 0, id_reserva: '', timestamp: ''
  } as SliceData);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (field: keyof SliceData, value: string) => {
    const numericValue = ['meta', 'montoInicial'].includes(field) ? parseFloat(value) || '' : value;
    setFormData(prev => ({ ...prev, [field]: numericValue }));
  };
  
  const handleCurrencySelect = (currency: string) => {
    setFormData(prev => ({ ...prev, moneda: currency }));
  };

  const handleCreateSlice = (e: React.FormEvent) => {
    e.preventDefault();
    const metaNum = parseFloat(formData.meta as any);
    if (!formData.nombre || !formData.moneda || metaNum <= 0) {
      console.error('Error: Completa todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);
    const newSlice: SliceData = {
      ...formData,
      meta: metaNum,
      montoInicial: parseFloat(formData.montoInicial as any) || 0,
      timestamp: new Date().toISOString(),
      id_reserva: `slice-${Date.now()}`,
    };

    try {
      const existingSlices: SliceData[] = JSON.parse(localStorage.getItem('slices') || '[]');
      existingSlices.push(newSlice);
      localStorage.setItem('slices', JSON.stringify(existingSlices));
      
      setTimeout(() => {
        setIsLoading(false);
        setShowModal(true); 
      }, 500);

    } catch (error) {
      setIsLoading(false);
      console.error('Error al guardar:', error);
    }
  };

  const SuccessModal: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-violet-800 mb-2">¡Slice Creada!</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => { onClose(); navigate(); }}
          className="w-full p-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
  
  // Componentes de input simplificados para esta simulación
  const SliceInput = ({ label, value, onChange, type = 'text' }: any) => (
    <div className="relative bg-white rounded-xl h-[60px] flex items-center shadow-md">
      <span className="p-4 font-semibold text-lg" style={{ color: VIOLET_LEMON }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="flex-grow p-4 text-right h-full focus:outline-none text-gray-900 font-semibold"
      />
    </div>
  );
  
  const CurrencyDropdown = ({ selected, onSelect, options }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative w-full">
            <div className="relative bg-white rounded-xl shadow-md h-[60px] flex items-center">
                <span className="p-4 font-semibold text-lg" style={{ color: VIOLET_LEMON }}>Moneda</span>
                <button type="button" onClick={() => setIsOpen(!isOpen)} 
                    className="flex justify-end items-center w-full h-full p-4 text-right focus:outline-none text-gray-900 font-semibold text-lg"
                    aria-expanded={isOpen}>
                    <span className={`flex-grow ${selected ? 'text-gray-900' : 'text-gray-400'}`}>{selected || 'Seleccionar'}</span>
                    <ChevronDown className={`w-5 h-5 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                    {options.map((currency: string) => (
                        <button key={currency} onClick={() => { onSelect(currency); setIsOpen(false); }}
                            className="w-full text-left p-3 hover:bg-gray-100 font-medium text-gray-800">
                            {currency}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
  };


  return (
    <div className="min-h-screen p-4 flex flex-col items-center" style={{ backgroundColor: BG_PURPLE }}>
      <header className="w-full max-w-md flex justify-start items-center mb-6 pt-4">
        <button onClick={navigate} aria-label="Volver atrás"><ArrowLeft className="text-white w-7 h-7" /></button>
      </header>
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-10 text-center" style={{ fontSize: '36px', color: YELLOW_LEMON }}>Crear Slice</h1>
        <form onSubmit={handleCreateSlice} className="w-full flex flex-col space-y-4">
          <SliceInput label="Nombre" value={formData.nombre} onChange={(v: string) => handleInputChange('nombre', v)} type="text" />
          <CurrencyDropdown selected={formData.moneda} onSelect={handleCurrencySelect} options={CURRENCIES} />
          <SliceInput label="Meta" value={formData.meta} onChange={(v: string) => handleInputChange('meta', v)} type="number" />
          <SliceInput label="Reservar" value={formData.montoInicial} onChange={(v: string) => handleInputChange('montoInicial', v)} type="number" />
          <button type="submit" disabled={isLoading} className={`w-full h-[60px] p-4 mt-8 rounded-xl text-lg font-bold transition duration-300 shadow-xl ${isLoading ? 'bg-gray-400' : 'bg-yellow-400'}`}>
            {isLoading ? 'Creando Slice...' : 'Crear Slice'}
          </button>
        </form>
      </div>
      {showModal && (
        <SuccessModal
          message={`La Slice "${formData.nombre}" ha sido registrada exitosamente.`}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};


// ----------------------------------------------------------------------
// Implementación Simplificada de InfoSlice (para navegación)
// ----------------------------------------------------------------------

const InfoSliceScreen: React.FC<{ slice: DisplaySliceData; navigate: () => void }> = ({ slice, navigate }) => {
  const { nombre, monto_actual, meta, moneda, isCrypto, dolar_conversion, percentageCompleted, remainingAmount } = slice;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center" style={{ backgroundColor: BG_PURPLE }}>
      <header className="w-full max-w-md flex justify-start items-center mb-10 pt-4">
        <button onClick={navigate} aria-label="Volver atrás"><ArrowLeft className="text-white w-7 h-7" /></button>
      </header>
      <div className="w-full max-w-md flex flex-col space-y-6">
        
        {/* Contenedor Superior (similar al wireframe) */}
        <div className="bg-white p-6 rounded-[50px] shadow-xl text-center">
          <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">{nombre}</p>
          <h1 className="text-5xl font-extrabold text-violet-800 mb-1">
            {monto_actual.toLocaleString('es-AR')} {moneda}
          </h1>
          {isCrypto && dolar_conversion && (
            <p className="text-lg text-gray-600 font-semibold">
              {dolar_conversion.toLocaleString('es-AR', { style: 'currency', currency: 'USD' })} USD
            </p>
          )}
        </div>

        {/* Contenedor de Progreso (Simulado) */}
        <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col space-y-4">
          <h2 className="text-xl font-bold text-violet-800">Progreso de la Meta</h2>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-700 ease-out"
              style={{ width: `${percentageCompleted}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600">
            Faltan <span className="font-bold text-violet-800">{remainingAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span> {moneda} para alcanzar la meta.
          </p>
        </div>

        <p className="text-white/80 text-center mt-4">
          Esta es la pantalla InfoSlice para "{nombre}".
        </p>
      </div>
    </div>
  );
};


// ----------------------------------------------------------------------
// Componente de Navegación Principal (App)
// ----------------------------------------------------------------------

type Screen = 'splash' | 'inicio' | 'crear' | 'info';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedSlice, setSelectedSlice] = useState<DisplaySliceData | null>(null);

  // Simulación del Splash.tsx
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('inicio');
    }, 2000); // 2 segundos

    return () => clearTimeout(timer);
  }, []);

  // Handler de navegación
  const navigate = (screen: 'crear' | 'info' | 'inicio', data?: any) => {
    if (screen === 'info' && data) {
      setSelectedSlice(data);
      setCurrentScreen('info');
    } else if (screen === 'crear') {
      setCurrentScreen('crear');
    } else {
      setCurrentScreen('inicio');
    }
  };

  // Renderizar la pantalla actual
  switch (currentScreen) {
    case 'splash':
      return (
        <div 
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: BG_PURPLE }}
        >
          <span className="text-6xl font-extrabold animate-pulse" style={{ color: YELLOW_LEMON }}>
            Slice
          </span>
        </div>
      );
    case 'crear':
      return <CrearSliceScreen navigate={() => navigate('inicio')} />;
    case 'info':
      return selectedSlice ? <InfoSliceScreen slice={selectedSlice} navigate={() => navigate('inicio')} /> : null;
    case 'inicio':
    default:
      return <Inicio navigate={navigate} />;
  }
};

export default App;