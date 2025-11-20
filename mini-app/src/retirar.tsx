import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import {
  BG_PURPLE,
  YELLOW_LEMON,
  FONT_HEADLINE,
  notifyStorageChange,
} from "./types";
import type { SliceData, Screen } from "./types";

// 🍋 LEMON SDK
import {
  authenticate,
  withdraw,
  isWebView,
  TransactionResult,
} from "./lemon-sdk";

const MessageModal: React.FC<{
  message: string;
  title: string;
  icon: string;
  buttonText: string;
  onClose: () => void;
}> = ({ message, title, icon, buttonText, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
    <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.18)', maxWidth: 420, width: '100%', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#5B21B6', marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#4B5563', marginBottom: 24, whiteSpace: 'pre-wrap' }}>{message}</p>

      <button
        onClick={onClose}
        style={{ width: '100%', padding: 12, borderRadius: 12, backgroundColor: YELLOW_LEMON, color: '#000', fontWeight: 600, border: 'none', cursor: 'pointer' }}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

// =====================================================================
//                           RETIRAR SCREEN
// =====================================================================
const RetirarScreen: React.FC<{
  slice: SliceData;
  navigate: (screen: Screen, data?: SliceData) => void;
}> = ({ slice, navigate }) => {
  const [wallet, setWallet] = useState<string | undefined>(undefined);

  const [monto, setMonto] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [modalState, setModalState] = useState<{
    visible: boolean;
    isSuccess: boolean;
    message: string;
  }>({
    visible: false,
    isSuccess: false,
    message: "",
  });

  // 🍋 Autenticación
  const handleAuthentication = async () => {
    try {
      const result = await authenticate();
      if (result.result === TransactionResult.SUCCESS) {
        setWallet(result.data.wallet);
      }
    } catch (err) {
      console.error("Error autenticación Lemon:", err);
    }
  };

  useEffect(() => {
    handleAuthentication();
  }, []);

  const handleGoBack = () => navigate("info", slice);

  // NORMALIZACIÓN DE TOKEN (ARREGLADO)
  const normalizeToken = (moneda: string): string => {
    const m = moneda.toUpperCase().trim();

    if (["ARS", "USDC", "BTC", "ETH"].includes(m)) return m;

    return "ARS"; // fallback seguro
  };

  // =====================================================
  //                     RETIRO ARREGLADO
  // =====================================================
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitización estricta del monto (ARREGLADO)
    const montoNum = Number(parseFloat(monto.replace(",", ".")).toFixed(2));

    if (isNaN(montoNum) || montoNum <= 0) {
      setModalState({
        visible: true,
        isSuccess: false,
        message: "Por favor, ingrese un monto de retiro válido.",
      });
      return;
    }

    if (montoNum > slice.montoInicial) {
      setModalState({
        visible: true,
        isSuccess: false,
        message: `El monto a retirar (${montoNum.toLocaleString(
          "es-AR"
        )} ${slice.moneda}) supera el monto actual (${slice.montoInicial.toLocaleString(
          "es-AR"
        )} ${slice.moneda}).`,
      });
      return;
    }

    if (!wallet) {
      setModalState({
        visible: true,
        isSuccess: false,
        message: "Debes autenticarte con Lemon antes de realizar un retiro.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // TOKEN NORMALIZADO (ARREGLADO)
      const tokenName = normalizeToken(slice.moneda);

      // AMOUNT FORMATEADO CORRECTAMENTE (ARREGLADO)
      const amount = montoNum.toFixed(2);

      const result = await withdraw({
        amount: amount.toString(),
        tokenName,
      });

      if (result.result !== TransactionResult.SUCCESS) {
        throw new Error("Error en Lemon");
      }

      // Actualizar LocalStorage (igual que original)
      const existingSlices: SliceData[] = JSON.parse(
        localStorage.getItem("slices") || "[]"
      );

      const updated = existingSlices.map((s) =>
        s.id_reserva === slice.id_reserva
          ? { ...s, montoInicial: s.montoInicial - montoNum }
          : s
      );

      localStorage.setItem("slices", JSON.stringify(updated));
      notifyStorageChange();

      setIsLoading(false);
      setMonto("");

      setModalState({
        visible: true,
        isSuccess: true,
        message: `Has retirado ${montoNum.toLocaleString(
          "es-AR"
        )} ${slice.moneda}.\n\nHash: ${result.data.txHash}`,
      });
    } catch (error) {
      console.error("Error retiro Lemon:", error);
      setIsLoading(false);
      setModalState({
        visible: true,
        isSuccess: false,
        message: "Ocurrió un error al procesar el retiro.",
      });
    }
  };

  const handleMontoChange = (value: string) => {
    const clean = value.replace(",", ".");
    if (/^\d*(\.\d*)?$/.test(clean) || clean === "") {
      setMonto(clean);
    }
  };

  const closeModal = () => {
    const success = modalState.isSuccess;

    setModalState({ visible: false, isSuccess: false, message: "" });

    if (success) handleGoBack();
  };

  if (!isWebView()) {
    return (
      <div style={{ color: '#fff', padding: 40, textAlign: 'center' }}>
        Esta Mini App solo funciona dentro de Lemon Cash.
      </div>
    );
  }

  const containerStyle: React.CSSProperties = { minHeight: '100vh', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: BG_PURPLE };
  const headerStyle: React.CSSProperties = { width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 40, paddingTop: 16, maxWidth: 480 };
  const mainStyle: React.CSSProperties = { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: 8, paddingRight: 8, maxWidth: 480 };
  const inputWrapperStyle: React.CSSProperties = { width: '100%', position: 'relative', backgroundColor: '#fff', borderRadius: 40, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', overflow: 'hidden', paddingTop: 16, paddingBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const inputStyle: React.CSSProperties = { flex: 1, textAlign: 'center' as const, outline: 'none', color: '#5B21B6', fontWeight: 800, fontSize: '8vw', border: 'none', background: 'transparent' };
  const currencyStyle: React.CSSProperties = { color: '#5B21B6', fontWeight: 800, paddingRight: 24, fontSize: '8vw' };
  const buttonStyle: React.CSSProperties = { width: 200, height: 50, borderRadius: 12, fontSize: 16, fontWeight: 700, transition: 'all 0.25s', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: isLoading ? '#9CA3AF' : YELLOW_LEMON, color: isLoading ? '#374151' : '#000' };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button onClick={handleGoBack} aria-label="Volver atrás" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <ArrowLeft style={{ color: '#fff', width: 28, height: 28 }} />
        </button>
      </header>

      <div style={mainStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: 40, fontWeight: 800, fontSize: '9vw', color: YELLOW_LEMON, fontFamily: FONT_HEADLINE }}>
          Retirar dinero
        </h1>

        <form onSubmit={handleWithdraw} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <div style={inputWrapperStyle}>
            <input
              type="text"
              value={monto}
              onChange={(e) => handleMontoChange(e.target.value)}
              placeholder="0.00"
              autoFocus
              style={inputStyle}
            />

            <span style={currencyStyle}>{slice.moneda}</span>
          </div>

          <button type="submit" disabled={isLoading} style={buttonStyle}>
            {isLoading ? 'Retirando...' : 'Retirar fondos'}
          </button>
        </form>
      </div>

      {modalState.visible && (
        <MessageModal
          message={modalState.message}
          title={modalState.isSuccess ? 'Operación Exitosa' : 'Error de Retiro'}
          icon={modalState.isSuccess ? '🎉' : '⚠️'}
          buttonText="Entendido"
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default RetirarScreen;