import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BG_PURPLE, YELLOW_LEMON, VIOLET_LEMON, FONT_HEADLINE, notifyStorageChange } from './types'; // Corregida la importación
import type { SliceData, Screen } from './types';

// Componente para mostrar mensajes (éxito y error)
const MessageModal: React.FC<{ 
  message: string; 
  title: string; 
  icon: string;
  buttonText: string;
  onClose: () => void 
}> = ({ message, title, icon, buttonText, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-violet-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full p-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
      >
        {buttonText}
      </button>
    </div>
  </div>
);

// Componente de entrada para la edición (similar a CrearSlice)
const EditInput: React.FC<{ label: string; value: string; onChange: (value: string) => void; isNumber?: boolean; currency?: string }> = ({ label, value, onChange, isNumber = false, currency }) => {
    
    // Si es numérico, muestra la divisa, de lo contrario, muestra un campo de texto
    const inputType = isNumber ? 'text' : 'text';

    const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (isNumber) {
            // Permite solo números y un punto/coma decimal. Reemplaza coma por punto.
            const cleanValue = val.replace(',', '.');
            // Regex para permitir números enteros o decimales (punto como separador)
            if (/^\d*(\.\d*)?$/.test(cleanValue) || cleanValue === '') {
                onChange(cleanValue);
            }
        } else {
            onChange(val);
        }
    };

    return (
        <div className="relative bg-white rounded-xl h-[60px] flex items-center shadow-md overflow-hidden">
            <span className="p-4 font-semibold text-lg flex-shrink-0" style={{ color: VIOLET_LEMON }}>{label}</span>
            <input 
                type={inputType} 
                value={value} 
                onChange={handleInternalChange}
                placeholder={isNumber ? '0.00' : `Escribe el ${label.toLowerCase()}`}
                className="flex-grow p-4 text-right h-full focus:outline-none text-gray-900 font-semibold"
            />
            {isNumber && currency && (
                <span className="pr-4 text-lg font-semibold text-gray-700">{currency}</span>
            )}
        </div>
    );
};

/**
 * Pantalla para editar el nombre y la meta de una Slice.
 */
const EditarScreen: React.FC<{ slice: SliceData; navigate: (screen: Screen, data?: SliceData) => void }> = ({ slice, navigate }) => {
  const [nombre, setNombre] = useState(slice.nombre);
  const [meta, setMeta] = useState(String(slice.meta)); // Convertir a string para el input
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState<{ visible: boolean, isSuccess: boolean, message: string }>({ visible: false, isSuccess: false, message: '' });

  // Vuelve a la pantalla de información de la Slice
  const handleGoBack = () => navigate('info', slice);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const metaNum = parseFloat(meta);

    if (!nombre.trim()) {
        setModalState({ visible: true, isSuccess: false, message: 'El nombre de la Slice no puede estar vacío.' });
        return;
    }
    if (isNaN(metaNum) || metaNum <= 0) {
      setModalState({ visible: true, isSuccess: false, message: 'Por favor, ingrese una meta válida (mayor a 0).' });
      return;
    }

    setIsLoading(true);

    // Lógica para actualizar el nombre y la meta en LocalStorage
    try {
      const existingSlices: SliceData[] = JSON.parse(localStorage.getItem('slices') || '[]');
      
      const updatedSlices = existingSlices.map(s => {
        if (s.id_reserva === slice.id_reserva) {
          // Actualiza solo el nombre y la meta
          return { 
            ...s, 
            nombre: nombre.trim(), 
            meta: metaNum 
          }; 
        }
        return s;
      });

      localStorage.setItem('slices', JSON.stringify(updatedSlices));
      notifyStorageChange(); // Notifica al Dashboard para que recargue los datos

      // Simulación de tiempo de carga/API
      setTimeout(() => {
        setIsLoading(false);
        setModalState({
            visible: true,
            isSuccess: true,
            message: `La Slice "${nombre}" ha sido actualizada exitosamente.`,
        });
        
        // Actualiza el objeto slice en la navegación para que la pantalla de info refleje los cambios inmediatamente
        const updatedSliceData = updatedSlices.find(s => s.id_reserva === slice.id_reserva);
        if (updatedSliceData) {
            navigate('info', updatedSliceData);
        }

      }, 500);

    } catch (error) {
      setIsLoading(false);
      setModalState({
        visible: true,
        isSuccess: false,
        message: 'Ocurrió un error al intentar actualizar la Slice.',
      });
      console.error('Error al actualizar LocalStorage:', error);
    }
  };

  const closeModal = () => {
    setModalState({ visible: false, isSuccess: false, message: '' });
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center" style={{ backgroundColor: BG_PURPLE }}>
      <header className="w-full max-w-md flex justify-start items-center mb-10 pt-4">
        <button onClick={handleGoBack} aria-label="Volver atrás"><ArrowLeft className="text-white w-7 h-7" /></button>
      </header>

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Título estático: Editar Slice */}
        <h1 
          className="text-4xl font-extrabold mb-10 text-center"
          style={{ 
            fontSize: '36px', 
            color: YELLOW_LEMON, 
            fontFamily: FONT_HEADLINE 
          }}
        >
          Editar Slice
        </h1>

        <form onSubmit={handleUpdate} className="w-full flex flex-col space-y-4">
          
          {/* Campo Nombre */}
          <EditInput 
            label="Nombre" 
            value={nombre} 
            onChange={setNombre} 
          />
          
          {/* Campo Meta */}
          <EditInput 
            label="Meta" 
            value={meta} 
            onChange={setMeta}
            isNumber={true}
            currency={slice.moneda} // Muestra la abreviatura de la divisa
          />

          {/* Botón de Edición */}
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
            {isLoading ? 'Guardando...' : 'Editar Slice'}
          </button>
        </form>
      </div>
      
      {/* Modal de Mensaje (Éxito o Error) */}
      {modalState.visible && (
        <MessageModal
          message={modalState.message}
          title={modalState.isSuccess ? '¡Operación Exitosa!' : 'Error de Edición'}
          icon={modalState.isSuccess ? '🎉' : '⚠️'}
          buttonText="Entendido"
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default EditarScreen;