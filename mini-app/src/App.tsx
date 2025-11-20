import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Download, Upload, Trash2, Edit } from 'lucide-react';

// Importa los tipos y constantes (Corregida la ruta de importación a './types.ts')
import { 
  BG_PURPLE, YELLOW_LEMON, VIOLET_LEMON, CURRENCIES, 
  FONT_HEADLINE, 
  notifyStorageChange 
} from './types';
import type { SliceData, DisplaySliceData, Screen } from './types';

// Importa las pantallas modulares
import Inicio from './inicio';
import DepositarScreen from './depositar';
import RetirarScreen from './retirar';
import EditarScreen from './editar'; // Importación de la nueva pantalla de edición


// ----------------------------------------------------------------------
// Implementación SIMULADA de CrearSliceScreen
// ----------------------------------------------------------------------
const CrearSliceScreen: React.FC<{ navigate: (screen: Screen) => void }> = ({ navigate }) => {
  const [formData, setFormData] = useState<SliceData>({
    nombre: '', moneda: '', meta: 0, montoInicial: 0, id_reserva: '', timestamp: ''
  } as SliceData);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Componentes de input y dropdown simplificados
  const SliceInput = ({ label, value, onChange }: any) => (
    <div className="relative bg-white rounded-xl h-[60px] flex items-center shadow-md overflow-hidden">
      <span className="p-4 font-semibold text-lg flex-shrink-0" style={{ color: VIOLET_LEMON }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="flex-grow p-4 text-right h-full focus:outline-none text-gray-900 font-semibold"
      />
    </div>
  );
  
  const CurrencyDropdown = ({ selected, onSelect, options }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative w-full">
            <div className="relative bg-white rounded-xl shadow-md h-[60px] flex items-center overflow-visible">
                <span className="p-4 font-semibold text-lg flex-shrink-0" style={{ color: VIOLET_LEMON }}>Moneda</span>
                <button type="button" onClick={() => setIsOpen(!isOpen)} 
                    className="flex justify-end items-center w-full h-full p-4 text-right border-l border-gray-100 focus:outline-none text-gray-900 font-semibold text-lg"
                    aria-expanded={isOpen}>
                    <span className={`flex-grow text-right ${selected ? 'text-gray-900' : 'text-gray-400'}`}>{selected || 'Seleccionar'}</span>
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


  const handleInputChange = (field: keyof SliceData, value: string) => {
    // Permitir decimales en los campos numéricos como string
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCurrencySelect = (currency: string) => {
    setFormData(prev => ({ ...prev, moneda: currency }));
  };

  const handleCreateSlice = (e: React.FormEvent) => {
    e.preventDefault();
    const metaNum = parseFloat(formData.meta as any);
    if (!formData.nombre || !formData.moneda || isNaN(metaNum) || metaNum <= 0) {
      console.error('Error: Por favor, completa los campos obligatorios.');
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
      
      notifyStorageChange(); // Notifica al Dashboard para que recargue los datos

      setTimeout(() => {
        setIsLoading(false);
        setShowModal(true); 
      }, 500);

    } catch (error) {
      setIsLoading(false);
      console.error('Error al guardar:', error);
    }
  };

  const SliceSuccessModal: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-violet-800 mb-2">¡Slice Creada!</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => { onClose(); navigate('inicio'); }}
          className="w-full p-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen p-4 flex flex-col items-center" style={{ backgroundColor: BG_PURPLE }}>
      <header className="w-full max-w-md flex justify-start items-center mb-6 pt-4">
        <button onClick={() => navigate('inicio')} aria-label="Volver atrás"><ArrowLeft className="text-white w-7 h-7" /></button>
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
        <SliceSuccessModal
          message={`La Slice "${formData.nombre}" ha sido registrada exitosamente.`}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};


// ----------------------------------------------------------------------
// Implementación de InfoSliceScreen (Añadido botón Editar)
// ----------------------------------------------------------------------

const InfoSliceScreen: React.FC<{ slice: DisplaySliceData; navigate: (screen: Screen, data?: SliceData) => void }> = ({ slice, navigate }) => {
  const { nombre, monto_actual, meta, moneda, isCrypto, dolar_conversion, percentageCompleted } = slice;

  return (
    <div className="min-h-screen p-4 flex flex-col items-center" style={{ backgroundColor: BG_PURPLE }}>
      <header className="w-full max-w-md flex justify-start items-center mb-10 pt-4">
        <button onClick={() => navigate('inicio')} aria-label="Volver atrás"><ArrowLeft className="text-white w-7 h-7" /></button>
      </header>
      <div className="w-full max-w-md flex flex-col space-y-6">
        
        {/* Contenedor Superior con Monto Actual */}
        <div className="bg-white p-6 rounded-[50px] shadow-xl text-center">
          <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">{nombre}</p>
          <h1 className="text-5xl font-extrabold text-violet-800 mb-1">
            {monto_actual.toLocaleString('es-AR')} {moneda}
          </h1>
          {isCrypto && dolar_conversion !== undefined && (
            <p className="text-lg text-gray-600 font-semibold">
              {dolar_conversion.toLocaleString('es-AR', { style: 'currency', currency: 'USD' })} USD
            </p>
          )}
        </div>

        {/* Barra de Progreso */}
        <div className="flex items-center space-x-2 px-2">
            <p className="text-white text-sm" style={{ color: VIOLET_LEMON }}>{monto_actual.toLocaleString('es-AR')}</p>
            <div className="relative h-2 flex-grow bg-white/30 rounded-full">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${percentageCompleted}%`, backgroundColor: YELLOW_LEMON }}
                ></div>
            </div>
            <p className="text-white text-sm">{percentageCompleted.toFixed(0)}%</p>
        </div>


        {/* Botones Depositar, Retirar y Editar */}
        <div className="flex justify-center items-center pt-4 space-x-8">
            {/* Botón Depositar */}
            <button 
                onClick={() => navigate('depositar', slice)}
                className="flex flex-col items-center p-3 rounded-xl transition hover:bg-white/10"
            >
                <div className="p-3 rounded-full shadow-lg" style={{ backgroundColor: YELLOW_LEMON }}>
                    <Download className="w-6 h-6" style={{ color: BG_PURPLE }} />
                </div>
                <span className="text-white text-xs mt-2 font-bold">DEPOSITAR</span>
            </button>
            
            {/* Botón Retirar */}
            <button 
                onClick={() => navigate('retirar', slice)}
                className="flex flex-col items-center p-3 rounded-xl transition hover:bg-white/10"
            >
                <div className="p-3 rounded-full shadow-lg" style={{ backgroundColor: YELLOW_LEMON }}>
                    <Upload className="w-6 h-6" style={{ color: BG_PURPLE }} />
                </div>
                <span className="text-white text-xs mt-2 font-bold">RETIRAR</span>
            </button>

             {/* Botón Editar (NUEVO) */}
            <button 
                onClick={() => navigate('editar', slice)}
                className="flex flex-col items-center p-3 rounded-xl transition hover:bg-white/10"
            >
                <div className="p-3 rounded-full shadow-lg" style={{ backgroundColor: YELLOW_LEMON }}>
                    <Edit className="w-6 h-6" style={{ color: BG_PURPLE }} />
                </div>
                <span className="text-white text-xs mt-2 font-bold">EDITAR</span>
            </button>
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

const App: React.FC = () => {
  // Añadido 'editar' al tipo de Screen
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
  const navigate = (screen: Screen, data?: any) => {
    // Incluir 'editar' en las pantallas que requieren datos de la Slice
    if (screen === 'info' || screen === 'depositar' || screen === 'retirar' || screen === 'editar') {
      // Si navegamos a 'info', la data debe ser DisplaySliceData, si viene de editar/depositar/retirar
      // puede ser SliceData simple, pero la convertimos a DisplaySliceData si viene de ahí.
      setSelectedSlice(data as DisplaySliceData);
      setCurrentScreen(screen);
    } else {
      setCurrentScreen(screen);
      setSelectedSlice(null);
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
          <span className="text-6xl font-extrabold animate-pulse" style={{ color: YELLOW_LEMON, fontFamily: FONT_HEADLINE }}>
            Slice
          </span>
        </div>
      );
    case 'crear':
      return <CrearSliceScreen navigate={navigate} />;
    case 'info':
      // Asegurarse de que selectedSlice tiene el formato DisplaySliceData para InfoSliceScreen
      return selectedSlice ? <InfoSliceScreen slice={selectedSlice} navigate={navigate} /> : null;
    case 'depositar':
        return selectedSlice ? <DepositarScreen slice={selectedSlice} navigate={navigate} /> : null;
    case 'retirar':
        return selectedSlice ? <RetirarScreen slice={selectedSlice} navigate={navigate} /> : null;
    case 'editar': // Nueva ruta de navegación
        // Si bien EditarScreen espera SliceData, como DisplaySliceData extiende SliceData, es compatible.
        return selectedSlice ? <EditarScreen slice={selectedSlice} navigate={navigate} /> : null;
    case 'inicio':
    default:
      return <Inicio navigate={navigate} />;
  }
};

export default App;