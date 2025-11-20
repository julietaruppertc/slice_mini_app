import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import {
  BG_PURPLE,
  YELLOW_LEMON,
  FONT_HEADLINE,
  notifyStorageChange,
} from "./types";
import type { SliceData, Screen } from "./types";

// 🍋 LEMON SDK (ÚNICO AGREGADO REAL)
import {
  authenticate,
  withdraw,
  isWebView,
  TransactionResult,
} from "@lemoncash/mini-app-sdk";

// -------------------------------
//  Modal — SIN CAMBIOS
// -------------------------------
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

// ===========================================================
//      RETIRAR SCREEN — ORIGINAL + INTEGRACIÓN LEMON
// ===========================================================
const RetirarScreen: React.FC<{
  slice: SliceData;
  navigate: (screen: Screen, data?: SliceData) => void;
}> = ({ slice, navigate }) => {
  // 🍋 AGREGADO: wallet
  const [wallet, setWallet] = useState<string | undefined>(undefined);

  // -------------------------
  // ORIGINAL — NO TOCADO
  // -------------------------
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

  // 🍋 AUTENTICACIÓN (AGREGADO)
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

  // VOLVER — ORIGINAL
  const handleGoBack = () => navigate("info", slice);

  // =====================================================
  // 🔵 RETIRO — ORIGINAL + INTEGRACIÓN LEMON ÚNICAMENTE
  // =====================================================
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const montoRetiro = parseFloat(monto);

    // VALIDACIONES ORIGINALES
    if (isNaN(montoRetiro) || montoRetiro <= 0) {
      setModalState({
        visible: true,
        isSuccess: false,
        message: "Por favor, ingrese un monto de retiro válido.",
      });
      return;
    }

    if (montoRetiro > slice.montoInicial) {
      setModalState({
        visible: true,
        isSuccess: false,
        message: `El monto a retirar (${montoRetiro.toLocaleString(
          "es-AR"
        )} ${slice.moneda}) supera el monto actual (${slice.montoInicial.toLocaleString(
          "es-AR"
        )} ${slice.moneda}).`,
      });
      return;
    }

    // 🍋 Validación nueva: wallet requerida
    if (!wallet) {
      setModalState({
        visible: true,
        isSuccess: false,
        message:
          "Debes autenticarte con Lemon antes de realizar un retiro.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 🍋 RETIRO REAL LEMON
      const result = await withdraw({
        amount: montoRetiro.toString(),
        tokenName: slice.moneda as any,
      });

      if (result.result !== TransactionResult.SUCCESS) {
        throw new Error("Error en Lemon");
      }

      // -----------------------------------
      // ORIGINAL — actualizar LocalStorage
      // -----------------------------------
      const existingSlices: SliceData[] = JSON.parse(
        localStorage.getItem("slices") || "[]"
      );

      const updated = existingSlices.map((s) =>
        s.id_reserva === slice.id_reserva
          ? { ...s, montoInicial: s.montoInicial - montoRetiro }
          : s
      );

      localStorage.setItem("slices", JSON.stringify(updated));
      notifyStorageChange();

      setIsLoading(false);
      setMonto("");

      // Modal original + agregado del hash 🍋
      setModalState({
        visible: true,
        isSuccess: true,
        message: `Has retirado ${montoRetiro.toLocaleString(
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

  // ORIGINAL
  const handleMontoChange = (value: string) => {
    const clean = value.replace(",", ".");
    if (/^\d*(\.\d*)?$/.test(clean) || clean === "") {
      setMonto(clean);
    }
  };

  // ORIGINAL
  const closeModal = () => {
    const success = modalState.isSuccess;

    setModalState({ visible: false, isSuccess: false, message: "" });

    if (success) handleGoBack();
  };

  // 🍋 Solo MiniApp
  if (!isWebView()) {
    return (
      <div className="text-white p-10 text-center">
        Esta Mini App solo funciona dentro de Lemon Cash.
      </div>
    );
  }

  // =====================================================
  // JSX ORIGINAL — NO CAMBIADO
  // =====================================================
  return (
  <div
    className="min-h-screen p-4 flex flex-col items-center"
    style={{ backgroundColor: BG_PURPLE }}
  >
    <header className="w-full flex justify-start items-center mb-20 pt-4">
      <button onClick={handleGoBack} aria-label="Volver atrás">
        <ArrowLeft className="text-white w-7 h-7" />
      </button>
    </header>

    <div className="w-full flex flex-col items-center px-2">
      <h1
        className="text-center mb-10 font-extrabold"
        style={{
          fontSize: "9vw",
          color: YELLOW_LEMON,
          fontFamily: FONT_HEADLINE,
        }}
      >
        Retirar dinero
      </h1>

      <form
        onSubmit={handleWithdraw}
        className="w-full flex flex-col items-center space-y-8"
      >
        <div className="w-full relative bg-white rounded-[40px] shadow-xl overflow-hidden py-4 flex items-center justify-center">
          <input
            type="text"
            value={monto}
            onChange={(e) => handleMontoChange(e.target.value)}
            placeholder="0.00"
            autoFocus
            className="flex-grow text-center focus:outline-none text-violet-800 font-extrabold placeholder-gray-400"
            style={{ fontSize: "8vw" }}
          />

          <span
            className="text-violet-800 font-extrabold pr-6"
            style={{ fontSize: "8vw" }}
          >
            {slice.moneda}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-[200px] h-[50px] rounded-xl text-lg font-bold transition duration-300 shadow-xl ${
            isLoading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-500"
          }`}
        >
          {isLoading ? "Retirando..." : "Retirar fondos"}
        </button>
      </form>
    </div>

    {modalState.visible && (
      <MessageModal
        message={modalState.message}
        title={modalState.isSuccess ? "¡Operación Exitosa!" : "Error de Retiro"}
        icon={modalState.isSuccess ? "🎉" : "⚠️"}
        buttonText="Entendido"
        onClose={closeModal}
      />
    )}
  </div>
);};
