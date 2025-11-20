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
  VIOLET_LEMON,
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
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }}>
    <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', maxWidth: 480, width: '100%', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: VIOLET_LEMON, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#4B5563', marginBottom: 18, whiteSpace: 'pre-line' }}>{message}</p>
      <button
        onClick={onClose}
        style={{ width: '100%', padding: 12, borderRadius: 12, backgroundColor: YELLOW_LEMON, color: '#000', fontWeight: 600, border: 'none' }}
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
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }}>
    <div style={{ backgroundColor: '#fff', width: 320, padding: 20, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', textAlign: 'center' }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: VIOLET_LEMON, marginBottom: 12 }}>Depósito exitoso</h2>
      <p style={{ color: '#4B5563', marginBottom: 16 }}>
        Tu depósito en <strong>{slice.nombre}</strong> fue procesado correctamente.
      </p>

      <button
        onClick={onConfirm}
        style={{ width: '100%', backgroundColor: YELLOW_LEMON, padding: 12, borderRadius: 12, color: '#000', fontWeight: 600, border: 'none' }}
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
      <div style={{ color: '#fff', padding: 40, textAlign: 'center' }}>
        Esta Mini App solo funciona dentro de Lemon Cash.
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: '100vh', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: BG_PURPLE }}
    >
      <header style={{ width: '100%', maxWidth: 420, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 80, paddingTop: 16 }}>
        <button onClick={handleGoBack} style={{ background: 'transparent', border: 'none', padding: 8, cursor: 'pointer' }}>
          <ArrowLeft color="#fff" size={28} />
        </button>
      </header>

      <div className="w-full max-w-md flex flex-col items-center">
        <h1
          className="text-4xl font-extrabold mb-10 text-center"
          style={{ fontSize: '36px', color: YELLOW_LEMON, fontFamily: FONT_HEADLINE }}
        >
          Depositar dinero
        </h1>

        <form onSubmit={handleDeposit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div style={{ width: '100%', backgroundColor: '#fff', borderRadius: 50, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 12, paddingRight: 12 }}>
            <input
              type="text"
              value={monto}
              onChange={(e) => handleMontoChange(e.target.value)}
              placeholder="0.00"
              style={{ flexGrow: 1, padding: 16, textAlign: 'center', height: '100%', outline: 'none', color: VIOLET_LEMON, fontWeight: 800, fontSize: 40, border: 'none', background: 'transparent' }}
            />

            <span style={{ color: VIOLET_LEMON, fontWeight: 800, paddingRight: 32, fontSize: 40 }}>
              {slice.moneda}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: 200, height: 50, borderRadius: 12, fontSize: 16, fontWeight: 700, boxShadow: '0 8px 20px rgba(0,0,0,0.12)', border: 'none', backgroundColor: isLoading ? '#9CA3AF' : YELLOW_LEMON, color: isLoading ? '#4B5563' : '#000', cursor: isLoading ? 'not-allowed' : 'pointer' }}
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