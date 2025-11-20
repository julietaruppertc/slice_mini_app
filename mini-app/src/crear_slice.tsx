import React, { useState, useEffect } from 'react';
// 1. CORRECCIÓN: 'Screen' lleva 'type' porque es solo una definición
import type { Screen } from './types'; 

// 2. CORRECCIÓN: El SDK NO lleva 'type' porque usas las funciones reales
import { authenticate, deposit, TransactionResult } from './lemon-sdk';
import { ArrowLeft, ChevronDown } from 'lucide-react'; // Asumo que usas iconos, si no, borra esta línea
import styles from './crearSliceStyles';

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
      // Solo intentamos el depósito si hay monto inicial y wallet conectada
      if (montoInicialNum > 0 && wallet && formData.moneda !== "ARS") {
        const result = await deposit({
          amount: montoInicialNum.toString(),
          tokenName: newSlice.moneda as any,
        });

        if (result.result !== TransactionResult.SUCCESS) {
          alert("Depósito fallido. No se creó el slice.");
          setIsLoading(false);
          return;
        }
      }

      // Guardar slice en localStorage
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

 
  return (
    <div style={styles.container}>
      {/* Header Simple */}
      <div style={styles.headerRow}>
        <button onClick={() => navigate('inicio')} style={styles.backButton} aria-label="Volver">
          <ArrowLeft style={styles.icon} />
        </button>
        <h1 style={styles.title}>Nuevo Slice</h1>
      </div>

      <form onSubmit={handleCreateSlice} style={styles.form}>
        {/* NOMBRE */}
        <div>
          <label style={styles.label}>Nombre del objetivo</label>
          <input
            type="text"
            style={styles.input}
            placeholder="Ej: Ahorro PC Gamer"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
          />
        </div>

        {/* MONEDA (SELECT) */}
        <div>
          <label style={styles.label}>Moneda</label>
          <div style={styles.selectWrapper}>
            <select
              style={styles.select}
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
            <ChevronDown style={styles.chevron} />
          </div>
        </div>

        {/* META */}
        <div>
          <label style={styles.label}>Meta a alcanzar</label>
          <input
            type="text"
            inputMode="decimal"
            style={styles.input}
            placeholder="0.00"
            value={formData.meta}
            onChange={(e) => handleInputChange('meta', e.target.value)}
          />
        </div>

        {/* MONTO INICIAL (OPCIONAL) */}
        <div>
          <label style={styles.label}>
            Depósito inicial <span style={{ fontWeight: 400, color: '#9ca3af' }}>(Opcional)</span>
          </label>
          <input
            type="text"
            inputMode="decimal"
            style={styles.input}
            placeholder="0.00"
            value={formData.montoInicial}
            onChange={(e) => handleInputChange('montoInicial', e.target.value)}
          />
          <p style={styles.optionalNote}>
            Este monto se descontará de tu wallet Lemon ahora.
          </p>
        </div>

        {/* BOTÓN CREAR */}
        <div style={styles.footerButtons}>
          <button
            type="submit"
            disabled={isLoading}
            style={isLoading ? styles.disabledButton : styles.primaryButton}
          >
            {isLoading ? 'Procesando...' : 'Crear Slice'}
          </button>
        </div>

      </form>

      {/* MODAL DE ÉXITO */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalIconWrapper}>
              <span style={{ fontSize: '1.5rem' }}>🎉</span>
            </div>
            <h2 style={styles.modalTitle}>¡Slice Creado!</h2>
            <p style={styles.modalText}>
              Tu objetivo <strong>{formData.nombre}</strong> ya está en marcha.
            </p>

            <button onClick={handleAceptar} style={styles.modalButton}>
              Ir al Inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearSlice;