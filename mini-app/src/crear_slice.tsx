import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

// --- Constantes y Tipos ---

// Opciones de divisas para el dropdown
const CURRENCIES = ['ARS', 'USD', 'ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'POL'];

// Colores específicos para simular la tipografía
const VIOLET_LEMON = '#5E2CBA';
const YELLOW_LEMON = '#F0EE00';

// Interfaz para la data del formulario
interface NewSliceData {
  nombre: string;
  moneda: string; // id_divisa de la moneda seleccionada
  meta: string;
  montoInicial: string;
}

// --- Componentes Reutilizables ---

/**
 * Modal simple de éxito para la notificación.
 */
const SuccessModal: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center">
      <div className="text-4xl mb-4">🎉</div>
      <h3 className="text-xl font-bold text-violet-800 mb-2">¡Slice Creada!</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full p-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
      >
        Entendido
      </button>
    </div>
  </div>
);

/**
 * Campo de entrada estilizado con las dimensiones y colores específicos.
 */
const SliceInput: React.FC<{
  label: string;
  placeholder: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  readOnly?: boolean;
}> = ({ label, placeholder, value, onChange, type = 'text', readOnly = false }) => (
  <div className="w-full">
    <label className="sr-only" htmlFor={label}>{label}</label>
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden h-[60px] flex items-center">
      <span 
        className="p-4 font-semibold text-lg flex-shrink-0"
        style={{ color: VIOLET_LEMON, fontFamily: 'sans-serif' }} // Simulación de "Stack Sans Text"
      >
        {label}
      </span>
      <input
        id={label}
        type={type === 'number' ? 'text' : type} // Usamos text para controlar mejor la entrada de decimales
        value={value}
        onChange={(e) => {
            const newValue = e.target.value;
            // Permitir solo números y un punto decimal para campos numéricos
            if (type === 'number') {
                if (/^\d*(\.\d*)?$/.test(newValue) || newValue === '') {
                    onChange(newValue);
                }
            } else {
                onChange(newValue);
            }
        }}
        placeholder={placeholder}
        readOnly={readOnly}
        className="flex-grow p-4 text-right h-full border-l border-gray-100 focus:outline-none text-gray-900 font-semibold placeholder-gray-400 text-lg"
      />
    </div>
  </div>
);

/**
 * Campo Dropdown para la selección de Moneda.
 */
const CurrencyDropdown: React.FC<{
  selected: string;
  onSelect: (currency: string) => void;
  options: string[];
}> = ({ selected, onSelect, options }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full">
            <div className="relative bg-white rounded-xl shadow-md overflow-hidden h-[60px] flex items-center">
                <span 
                    className="p-4 font-semibold text-lg flex-shrink-0"
                    style={{ color: VIOLET_LEMON, fontFamily: 'sans-serif' }} // Simulación de "Stack Sans Text"
                >
                    Moneda
                </span>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex justify-end items-center w-full h-full p-4 text-right border-l border-gray-100 focus:outline-none text-gray-900 font-semibold text-lg"
                    aria-label="Seleccionar Moneda"
                    aria-expanded={isOpen}
                >
                    <span className={`flex-grow ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
                        {selected || 'Seleccionar'}
                    </span>
                    <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180 text-violet-600' : 'text-gray-400'}`} />
                </button>
            </div>

            {/* Opciones del Dropdown */}
            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                    {options.map((currency) => (
                        <button
                            key={currency}
                            onClick={() => {
                                onSelect(currency);
                                setIsOpen(false);
                            }}
                            className="w-full text-left p-3 hover:bg-gray-100 font-medium text-gray-800"
                        >
                            {currency}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Componente Principal CrearSlice ---

const CrearSlice: React.FC = () => {
  const [formData, setFormData] = useState<NewSliceData>({
    nombre: '',
    moneda: '',
    meta: '',
    montoInicial: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (field: keyof NewSliceData, value: string) => {
    // Para campos numéricos, guardar como string para permitir entrada de decimales temporalmente
    if (field === 'meta' || field === 'montoInicial') {
        setFormData(prev => ({ ...prev, [field]: value === '' ? '' : value }));
    } else {
        setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handleCurrencySelect = (currency: string) => {
    setFormData(prev => ({ ...prev, moneda: currency }));
  };

  const handleCreateSlice = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.moneda || formData.meta === '' || parseFloat(formData.meta.toString()) <= 0) {
      // Usar console.error o un mensaje de error en la UI en lugar de alert()
      console.error('Error: Por favor, completa el nombre, selecciona una moneda y define una meta válida (> 0).');
      return;
    }

    setIsLoading(true);

    // 1. Preparar datos para LocalStorage
    const newSlice = {
      ...formData,
      // Asegurar que los valores numéricos se guarden como números
      meta: parseFloat(formData.meta.toString()),
      montoInicial: parseFloat(formData.montoInicial.toString()) || 0,
      timestamp: new Date().toISOString(),
      id_reserva: `slice-${Date.now()}`, // ID único simple
    };

    // 2. Guardar en LocalStorage
    try {
      const existingSlices = JSON.parse(localStorage.getItem('slices') || '[]');
      existingSlices.push(newSlice);
      localStorage.setItem('slices', JSON.stringify(existingSlices));
      console.log('✅ Slice guardada en LocalStorage:', newSlice);
      
      // Simulación de tiempo de carga/API
      setTimeout(() => {
        setIsLoading(false);
        setShowModal(true); // Mostrar modal de éxito
      }, 500);

    } catch (error) {
      setIsLoading(false);
      console.error('Error al guardar en LocalStorage:', error);
      // Aquí podrías mostrar un modal de error
    }
  };


  return (
    <div className="min-h-screen bg-violet-600 p-4 font-sans flex flex-col items-center">
      {/* Encabezado y Título */}
      <header className="w-full max-w-md flex justify-start items-center mb-6 pt-4">
        <button onClick={() => console.log('Volver atrás')} aria-label="Volver atrás">
          <ArrowLeft className="text-white w-7 h-7" />
        </button>
      </header>

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Título de la página */}
        <h1 
          className="text-4xl font-extrabold mb-10 text-center"
          style={{ 
            fontSize: '36px', 
            color: YELLOW_LEMON, 
            fontFamily: 'sans-serif' // Simulación de "Stack Sans Text"
          }}
        >
          Crear Slice
        </h1>

        <form onSubmit={handleCreateSlice} className="w-full flex flex-col space-y-4">
          
          {/* Campo 1: Nombre (texto corto) */}
          <SliceInput
            label="Nombre"
            placeholder="Insertar nombre"
            value={formData.nombre}
            onChange={(v) => handleInputChange('nombre', v)}
            type="text"
          />

          {/* Campo 2: Moneda (Dropdown) */}
          <CurrencyDropdown
            selected={formData.moneda}
            onSelect={handleCurrencySelect}
            options={CURRENCIES}
          />

          {/* Campo 3: Meta (numérico/decimal) */}
          <SliceInput
            label="Meta"
            placeholder="Insertar meta"
            value={formData.meta}
            onChange={(v) => handleInputChange('meta', v)}
            type="number"
          />

          {/* Campo 4: Reservar / Monto Inicial (numérico/decimal) */}
          <SliceInput
            label="Reservar"
            placeholder="Insertar fondos"
            value={formData.montoInicial}
            onChange={(v) => handleInputChange('montoInicial', v)}
            type="number"
          />

          {/* Botón de Creación */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full h-[60px] p-4 mt-8 rounded-xl text-lg font-bold transition duration-300 shadow-xl
              ${isLoading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
              }
            `}
          >
            {isLoading ? 'Creando Slice...' : 'Crear Slice'}
          </button>
        </form>
      </div>
      
      {/* Modal de éxito */}
      {showModal && (
        <SuccessModal
          message={`La Slice "${formData.nombre}" ha sido registrada exitosamente con un monto inicial de ${formData.montoInicial || 0} ${formData.moneda}.`}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CrearSlice;