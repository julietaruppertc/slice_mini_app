import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BG_PURPLE, YELLOW_LEMON, FONT_HEADLINE, SliceData, Screen, notifyStorageChange } from './types.tsx';

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

/**
 * Pantalla para depositar fondos en una Slice específica.
 * Recibe los datos de la Slice y una función de navegación.
 */
const DepositarScreen: React.FC<{ slice: SliceData; navigate: (screen: Screen, data?: SliceData) => void }> = ({ slice, navigate }) => {
  const [monto, setMonto] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState<{ visible: boolean, isSuccess: boolean, message: string }>({ visible: false, isSuccess: false, message: '' });

  // Vuelve a la pantalla de información de la Slice
  const handleGoBack = () => navigate('info', slice);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const montoDeposito = parseFloat(monto);

    if (isNaN(montoDeposito) || montoDeposito <= 0) {
      setModalState({
        visible: true,
        isSuccess: false,
        message: 'Por favor, ingrese un monto de depósito válido.',
      });
      return;
    }

    setIsLoading(true);

    // Lógica para actualizar el monto en LocalStorage (sumar)
    try {
      const existingSlices: SliceData[] = JSON.parse(localStorage.getItem('slices') || '[]');
      
      const updatedSlices = existingSlices.map(s => {
        if (s.id_reserva === slice.id_reserva) {
          // Aumenta el monto actual (montoInicial) de la Slice
          const newMonto = s.montoInicial + montoDeposito;
          return { ...s, montoInicial: newMonto }; 
        }
        return s;
      });

      localStorage.setItem('slices', JSON.stringify(updatedSlices));
      notifyStorageChange(); // Notifica al Dashboard para que recargue los datos

      // Simulación de tiempo de carga/API
      setTimeout(() => {
        setIsLoading(false);
        setMonto(''); // Limpiar el input después del éxito
        setModalState({
            visible: true,
            isSuccess: true,
            message: `Has depositado exitosamente ${montoDeposito.toLocaleString('es-AR')} ${slice.moneda} en la Slice "${slice.nombre}".`,
        });
      }, 500);

    } catch (error) {
      setIsLoading(false);
      setModalState({
        visible: true,
        isSuccess: false,
        message: 'Ocurrió un error al intentar depositar los fondos.',
      });
      console.error('Error al actualizar LocalStorage:', error);
    }
  };

  const handleMontoChange = (value: string) => {
    // Permitir solo números y un punto/coma decimal. Reemplaza coma por punto.
    const cleanValue = value.replace(',', '.');
    // Regex para permitir números enteros o decimales (punto como separador)
    if (/^\d*(\.\d*)?$/.test(cleanValue) || cleanValue === '') {
        setMonto(cleanValue);
    }
  };

  const closeModal = () => {
    setModalState({ visible: false, isSuccess: false, message: '' });
    // Si fue exitoso, volver a la pantalla anterior
    if (modalState.isSuccess) {
        handleGoBack();
    }
  };


  return (
    <div className="min-h-screen p-4 flex flex-col items-center" style={{ backgroundColor: BG_PURPLE }}>
      <header className="w-full max-w-md flex justify-start items-center mb-20 pt-4">
        <button onClick={handleGoBack} aria-label="Volver atrás"><ArrowLeft className="text-white w-7 h-7" /></button>
      </header>

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Título estático: Depositar dinero */}
        <h1 
          className="text-4xl font-extrabold mb-10 text-center"
          style={{ 
            fontSize: '36px', 
            color: YELLOW_LEMON, 
            fontFamily: FONT_HEADLINE 
          }}
        >
          Depositar dinero
        </h1>

        <form onSubmit={handleDeposit} className="w-full flex flex-col items-center space-y-8">
          
          {/* Campo Numérico de Depósito (Container Blanco) */}
          <div className="w-full relative bg-white rounded-[50px] shadow-xl overflow-hidden h-[80px] flex items-center justify-center">
            <input
              type="text" // Usamos text para controlar la entrada de decimales
              value={monto}
              onChange={(e) => handleMontoChange(e.target.value)}
              placeholder="0.00"
              autoFocus
              className="flex-grow p-4 text-center h-full focus:outline-none text-violet-800 font-extrabold placeholder-gray-400"
              style={{ fontSize: '40px' }} // Fuente grande para el monto
            />
            {/* Abreviatura de la Cripto/Moneda (Variable) */}
            <span 
              className="text-violet-800 font-extrabold pr-8"
              style={{ fontSize: '40px' }}
            >
                {slice.moneda}
            </span>
          </div>

          {/* Botón de Depósito de Fondos */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-[200px] h-[50px] rounded-xl text-lg font-bold transition duration-300 shadow-xl
              ${isLoading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
              }
            `}
          >
            {isLoading ? 'Depositando...' : 'Depositar fondos'}
          </button>
        </form>
      </div>
      
      {/* Modal de Mensaje (Éxito o Error) */}
      {modalState.visible && (
        <MessageModal
          message={modalState.message}
          title={modalState.isSuccess ? '¡Operación Exitosa!' : 'Error de Depósito'}
          icon={modalState.isSuccess ? '🎉' : '⚠️'}
          buttonText="Entendido"
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default DepositarScreen;