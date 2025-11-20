import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  authenticate,
  deposit,
  isWebView,
  TransactionResult,
} from './lemon-sdk';

import {
  BG_PURPLE,
  YELLOW_LEMON,
  FONT_HEADLINE,
  notifyStorageChange,
} from './types';
import type { SliceData, Screen } from './types';

// Modal de éxito/error (solo se usa para errores ahora)
const MessageModal: React.FC<{
  message: string;
  title: string;
  icon: string;
  buttonText: string;
  onClose: () => void;
}> = ({ message, title, icon, buttonText, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-violet-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 whitespace-pre-line">{message}</p>
      <button
        onClick={onClose}
        className="w-full p-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
      >
        {buttonText}
      </button>
    </div>
  </div>
);

// 🔵 NUEVO MODAL — éxito final → redirige
const SuccessRedirectModal: React.FC<{
  slice: SliceData;
  onConfirm: () => void;
}> = ({ slice, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white w-80 p-6 rounded-3xl shadow-xl text-center">
      <h2 className="text-xl font-bold text-violet-800 mb-3">Depósito exitoso</h2>
      <p className="text-gray-600 mb-6">
        Tu depósito en <strong>{slice.nombre}</strong> fue procesado correctamente.
      </p>

      <button
        onClick={onConfirm}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl transition active:scale-95"
      >
        Aceptar
      </button>
    </div>
  </div>
);

const DepositarScreen: React.FC<{
  slice: SliceData;
  navigate: (screen: Screen, data?: SliceData) => void;
}> = ({ slice, navigate }) => {
  const [wallet, setWallet] = useState<string | undefined>();
  const [monto, setMonto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [modalState, setModalState] = useState({
    visible: false,
    isSuccess: false,
    message: '',
  });

  const [showSuccessRedirect, setShowSuccessRedirect] = useState(false);

  // Autenticación
  const initAuth = async () => {
    try {
      const result = await authenticate();
      if (result.result === TransactionResult.SUCCESS) {
        setWallet(result.data.wallet);
      }
    } catch (err) {
      console.error('Error de auth:', err);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const handleGoBack = () => navigate('info', slice);

  // DEPÓSITO + actualizacion localStorage
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNumber = parseFloat(monto);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setModalState({
        visible: true,
        isSuccess: false,
        message: 'Por favor, ingrese un monto de depósito válido.',
      });
      return;
    }

    if (!wallet) {
      setModalState({
        visible: true,
        isSuccess: false,
        message: 'Debes autenticarte antes de depositar.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Depósito real
      const sdkResult = await deposit({
        amount: amountNumber.toString(),
        tokenName: slice.moneda as any,
      });

      if (sdkResult.result !== TransactionResult.SUCCESS) {
        throw new Error('Falló el depósito en Lemon');
      }

      // 2. Actualizar LocalStorage
      const existingSlices: SliceData[] =
        JSON.parse(localStorage.getItem('slices') || '[]');

      const updatedSlices = existingSlices.map((s) => {
        if (s.id_reserva === slice.id_reserva) {
          return { ...s, montoInicial: s.montoInicial + amountNumber };
        }
        return s;
      });

      localStorage.setItem('slices', JSON.stringify(updatedSlices));
      notifyStorageChange();

      setIsLoading(false);
      setMonto('');

      // 👉 En vez de mostrar tu modal original, mostramos el modal final
      setModalState({ visible: false, isSuccess: false, message: '' });
      setShowSuccessRedirect(true);

    } catch (err) {
      console.error('Error en depósito:', err);
      setIsLoading(false);

      setModalState({
        visible: true,
        isSuccess: false,
        message: 'Ocurrió un error al intentar realizar el depósito.',
      });
    }
  };

  const handleMontoChange = (value: string) => {
    const clean = value.replace(',', '.');
    if (/^\d*(\.\d*)?$/.test(clean) || clean === '') {
      setMonto(clean);
    }
  };

  const closeModal = () => {
    // Solo errores usan este modal
    setModalState({ visible: false, isSuccess: false, message: '' });
  };

  const goToInfoSlice = () => {
    navigate('info', slice);
  };

  if (!isWebView()) {
    return (
      <div className="text-white p-10 text-center">
        Esta Mini App solo funciona dentro de Lemon Cash.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 flex flex-col items-center"
      style={{ backgroundColor: BG_PURPLE }}
    >
      <header className="w-full max-w-md flex justify-start items-center mb-20 pt-4">
        <button onClick={handleGoBack}>
          <ArrowLeft className="text-white w-7 h-7" />
        </button>
      </header>

      <div className="w-full max-w-md flex flex-col items-center">
        <h1
          className="text-4xl font-extrabold mb-10 text-center"
          style={{ fontSize: '36px', color: YELLOW_LEMON, fontFamily: FONT_HEADLINE }}
        >
          Depositar dinero
        </h1>

        <form
          onSubmit={handleDeposit}
          className="w-full flex flex-col items-center space-y-8"
        >
          <div className="w-full bg-white rounded-[50px] shadow-xl h-[80px] flex items-center justify-center">
            <input
              type="text"
              value={monto}
              onChange={(e) => handleMontoChange(e.target.value)}
              placeholder="0.00"
              className="flex-grow p-4 text-center h-full focus:outline-none text-violet-800 font-extrabold placeholder-gray-400"
              style={{ fontSize: '40px' }}
            />

            <span
              className="text-violet-800 font-extrabold pr-8"
              style={{ fontSize: '40px' }}
            >
              {slice.moneda}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-[200px] h-[50px] rounded-xl text-lg font-bold transition duration-300 shadow-xl
            ${
              isLoading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
            }`}
          >
            {isLoading ? 'Depositando...' : 'Depositar fondos'}
          </button>
        </form>
      </div>

      {/* Modal de error */}
      {modalState.visible && (
        <MessageModal
          message={modalState.message}
          title="Error en el Depósito"
          icon="⚠️"
          buttonText="Entendido"
          onClose={closeModal}
        />
      )}

      {/* Modal final de éxito */}
      {showSuccessRedirect && (
        <SuccessRedirectModal slice={slice} onConfirm={goToInfoSlice} />
      )}
    </div>
  );
};

export default DepositarScreen;
