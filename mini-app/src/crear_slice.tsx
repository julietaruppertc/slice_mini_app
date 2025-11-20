import React, { useState, useEffect } from 'react';
// 1. CORRECCIÓN: 'Screen' lleva 'type' porque es solo una definición
import type { Screen } from './types'; 

// 2. CORRECCIÓN: El SDK NO lleva 'type' porque usas las funciones reales
import { authenticate, deposit, TransactionResult } from '@lemoncash/mini-app-sdk';
import { ArrowLeft, ChevronDown } from 'lucide-react'; // Asumo que usas iconos, si no, borra esta línea

interface CrearSliceProps {
  navigate: (screen: Screen, data?: any) => void;
}

interface NewSliceData {
  nombre: string;
  moneda: string;
  meta: string;
  montoInicial: string;
}

const CrearSlice: React.FC<CrearSliceProps> = ({ navigate }) => {
  const [formData, setFormData] = useState<NewSliceData>({
    nombre: '',
    moneda: '', // Empezamos vacío para obligar a elegir
    meta: '',
    montoInicial: '',
  });

  const [wallet, setWallet] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // --- AUTENTICACIÓN LEMON ---
  useEffect(() => {
    const init = async () => {
      try {
        const result = await authenticate();
        if (result.result === TransactionResult.SUCCESS) {
          setWallet(result.data.wallet);
          console.log("Wallet conectada:", result.data.wallet); // Usamos wallet en un log para que no de error de 'unused'
        }
      } catch (error) {
        console.error("Error auth:", error);
      }
    };
    init();
  }, []);

  const handleInputChange = (field: keyof NewSliceData, value: string) => {
    // Validación simple para números
    if (field === 'meta' || field === 'montoInicial') {
        // Permitir solo números y un punto decimal
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // --- CREAR SLICE + DEPOSITAR ---
  const handleCreateSlice = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.nombre) { alert("Por favor escribe un nombre"); setIsLoading(false); return; }
    if (!formData.moneda) { alert("Por favor selecciona una moneda"); setIsLoading(false); return; }
    if (!formData.meta || parseFloat(formData.meta) <= 0) { alert("La meta debe ser mayor a 0"); setIsLoading(false); return; }

    setIsLoading(true);

    const montoInicialNum = parseFloat(formData.montoInicial) || 0;
    const newSlice = {
      ...formData,
      meta: parseFloat(formData.meta),
      montoInicial: montoInicialNum,
      timestamp: new Date().toISOString(),
      id_reserva: `slice-${Date.now()}`,
    };

    try {
      // 1. Validar saldo suficiente si hay monto inicial
      if (montoInicialNum > 0) {
        if (!wallet) {
          alert("No tienes wallet conectada");
          setIsLoading(false);
          return;
        }

        let balance = 0;

        if (formData.moneda === "ARS") {
          // Para ARS, usamos un saldo simulado en localStorage
          balance = parseFloat(localStorage.getItem('walletARS') || '0');
        } else {
          // Para cripto/stablecoins, pedimos saldo real (ejemplo)
          const balanceResult = await fetch(`/api/getWalletBalance?wallet=${wallet}&token=${formData.moneda}`);
          balance = await balanceResult.json();
        }

        if (balance < montoInicialNum) {
          alert("No tienes saldo suficiente para este depósito inicial");
          setIsLoading(false);
          return;
        }

        // 2. Realizar depósito solo para cripto/stablecoins
        if (formData.moneda !== "ARS") {
          const result = await deposit({
            amount: montoInicialNum.toString(),
            tokenName: newSlice.moneda as any,
          });

          if (result.result !== TransactionResult.SUCCESS) {
            alert("Depósito fallido. No se creó el slice.");
            setIsLoading(false);
            return;
          }
        } else {
          // Para ARS, descontamos saldo simulado
          localStorage.setItem('walletARS', (balance - montoInicialNum).toString());
        }
      }

      // 3. Guardar slice solo si depósito exitoso o monto inicial = 0
      const existing = JSON.parse(localStorage.getItem('slices') || '[]');
      existing.push(newSlice);
      localStorage.setItem('slices', JSON.stringify(existing));

      setIsLoading(false);
      setShowModal(true);

    } catch (err) {
      setIsLoading(false);
      console.error('Error creando slice:', err);
      alert("Hubo un error al crear el Slice");
    }
  };


    const handleAceptar = () => {
      navigate('inicio'); 
    };

  // ------------------------------------------
  // AQUÍ CONECTAMOS LAS VARIABLES AL HTML
  // ------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      {/* Header Simple */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('inicio')} className="p-2 hover:bg-gray-200 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold ml-2 text-gray-800">Nuevo Slice</h1>
      </div>

      <form onSubmit={handleCreateSlice} className="flex-1 flex flex-col gap-4">
        
        {/* NOMBRE */}
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Nombre del objetivo</label>
            <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="Ej: Ahorro PC Gamer"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
            />
        </div>

        {/* MONEDA (SELECT) */}
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Moneda</label>
            <div className="relative">
                <select
                    className="w-full p-3 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.moneda}
                    onChange={(e) => handleInputChange('moneda', e.target.value)}
                >
                    <option value="" disabled>Seleccionar moneda</option>
                    <option value="USDC">USDC</option>
                    <option value="USDT">USDT</option>
                    <option value="ETH">ETH</option>
                    <option value="BTC">BTC</option>
                    <option value="ARS">Pesos (ARS)</option> 
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>

        {/* META */}
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Meta a alcanzar</label>
            <input
                type="text"
                inputMode="decimal"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="0.00"
                value={formData.meta}
                onChange={(e) => handleInputChange('meta', e.target.value)}
            />
        </div>

        {/* MONTO INICIAL (OPCIONAL) */}
        <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
                Depósito inicial <span className="font-normal text-gray-400">(Opcional)</span>
            </label>
            <input
                type="text"
                inputMode="decimal"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="0.00"
                value={formData.montoInicial}
                onChange={(e) => handleInputChange('montoInicial', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
                Este monto se descontará de tu wallet Lemon ahora.
            </p>
        </div>

        {/* BOTÓN CREAR */}
        <div className="mt-auto pt-6 pb-4">
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition active:scale-95 ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                }`}
            >
                {isLoading ? 'Procesando...' : 'Crear Slice'}
            </button>
        </div>

      </form>

      {/* MODAL DE ÉXITO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-xs p-6 rounded-3xl text-center shadow-2xl transform transition-all scale-100">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">¡Slice Creado!</h2>
            <p className="text-gray-500 mb-6">
              Tu objetivo <strong>{formData.nombre}</strong> ya está en marcha.
            </p>

            <button
              onClick={handleAceptar}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold active:scale-95 transition"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearSlice;