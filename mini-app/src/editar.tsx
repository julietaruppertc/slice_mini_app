import React, { useState } from 'react';
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
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
    <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.18)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: VIOLET_LEMON, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#4B5563', marginBottom: 24 }}>{message}</p>
      <button
        onClick={onClose}
        style={{ width: '100%', padding: 12, borderRadius: 12, backgroundColor: YELLOW_LEMON, color: '#000', fontWeight: 600, border: 'none', cursor: 'pointer' }}
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
      <div style={{ backgroundColor: '#fff', borderRadius: 12, height: 60, display: 'flex', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <span style={{ padding: 16, fontWeight: 600, fontSize: 18, flexShrink: 0, color: VIOLET_LEMON }}>{label}</span>
        <input 
          type={inputType} 
          value={value} 
          onChange={handleInternalChange}
          placeholder={isNumber ? '0.00' : `Escribe el ${label.toLowerCase()}`}
          style={{ flex: 1, padding: 16, textAlign: 'right', height: '100%', outline: 'none', color: '#111827', fontWeight: 600, border: 'none', background: 'transparent' }}
        />
        {isNumber && currency && (
          <span style={{ paddingRight: 16, fontSize: 18, fontWeight: 600, color: '#374151' }}>{currency}</span>
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

  const containerStyle: React.CSSProperties = { minHeight: '100vh', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: BG_PURPLE };
  const headerStyle: React.CSSProperties = { width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 40, paddingTop: 16 };
  const mainStyle: React.CSSProperties = { width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center' };
  const formStyle: React.CSSProperties = { width: '100%', display: 'flex', flexDirection: 'column', gap: 16 };
  const buttonStyle: React.CSSProperties = {
    width: '100%', height: 60, padding: 16, marginTop: 32, borderRadius: 12, fontSize: 18, fontWeight: 700, boxShadow: '0 6px 18px rgba(0,0,0,0.12)', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', backgroundColor: isLoading ? '#9CA3AF' : YELLOW_LEMON, color: isLoading ? '#374151' : '#000'
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button onClick={handleGoBack} aria-label="Volver atrás" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <ArrowLeft style={{ color: '#fff', width: 28, height: 28 }} />
        </button>
      </header>

      <div style={mainStyle}>
        <h1 style={{ fontSize: 36, color: YELLOW_LEMON, fontFamily: FONT_HEADLINE, fontWeight: 800, marginBottom: 40, textAlign: 'center' }}>
          Editar Slice
        </h1>

        <form onSubmit={handleUpdate} style={formStyle}>
          <EditInput label="Nombre" value={nombre} onChange={setNombre} />

          <EditInput label="Meta" value={meta} onChange={setMeta} isNumber={true} currency={slice.moneda} />

          <button type="submit" disabled={isLoading} style={buttonStyle}>
            {isLoading ? 'Guardando...' : 'Editar Slice'}
          </button>
        </form>
      </div>

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