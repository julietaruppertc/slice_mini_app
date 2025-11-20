import React from 'react';
// Importamos los colores necesarios desde nuestro archivo de tipos para consistencia visual
import { BG_PURPLE, YELLOW_LEMON, VIOLET_LEMON } from './types'; 
import { X, CheckCircle, AlertTriangle, Loader } from 'lucide-react';

/**
 * Define las propiedades que acepta el componente ModalAviso.
 */
interface ModalProps {
    // Estado del modal: 'success', 'error', 'loading', o 'custom'
    type: 'success' | 'error' | 'loading' | 'custom';
    
    // Título principal del modal (p. ej., "¡Operación Exitosa!")
    title: string;
    
    // Mensaje descriptivo (p. ej., "Se depositaron 50 USD correctamente.")
    message: string;
    
    // Texto del botón de acción (p. ej., "Volver al Inicio" o "Reintentar")
    buttonText: string;
    
    // Función a ejecutar al hacer clic en el botón principal.
    onConfirm: () => void;
    
    // Opcional: Si se proporciona, muestra un botón de cierre (X) y lo ejecuta.
    onClose?: () => void; 
}

/**
 * Componente ModalAviso: Muestra un aviso de sistema (éxito, error, carga) 
 * de manera limpia y centrada.
 */
const ModalAviso: React.FC<ModalProps> = ({ 
    type, 
    title, 
    message, 
    buttonText, 
    onConfirm, 
    onClose 
}) => {

    // --- Lógica de Iconos y Estilos por Tipo ---
    let iconComponent;
    let iconColor = '#111827';
    let buttonColor = YELLOW_LEMON;
    let buttonTextColor = '#000';
    let isButtonDisabled = false;
    
    switch (type) {
        case 'success':
            iconComponent = <CheckCircle size={48} color={String(YELLOW_LEMON)} />;
            iconColor = String(YELLOW_LEMON);
            buttonColor = YELLOW_LEMON;
            buttonTextColor = '#000';
            break;
        case 'error':
            iconComponent = <AlertTriangle size={48} color="#EF4444" />;
            iconColor = '#EF4444';
            buttonColor = '#EF4444';
            buttonTextColor = '#FFF';
            break;
        case 'loading':
            // Icono de carga (estático)
            iconComponent = <Loader size={48} color={String(VIOLET_LEMON)} />;
            iconColor = VIOLET_LEMON;
            isButtonDisabled = true; // Deshabilita el botón durante la carga
            buttonColor = '#D1D5DB';
            buttonTextColor = '#6B7280';
            break;
        case 'custom':
        default:
            iconComponent = <div style={{ fontSize: 28 }}>💡</div>; // Icono por defecto o personalizado
            iconColor = VIOLET_LEMON;
            buttonColor = YELLOW_LEMON;
            buttonTextColor = '#000';
            break;
    }

    // --- Renderizado del Modal ---
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }}>
            <div style={{ backgroundColor: '#fff', padding: 32, borderRadius: 24, boxShadow: '0 20px 40px rgba(2,6,23,0.2)', maxWidth: 360, width: '100%', textAlign: 'center', position: 'relative' }}>

                {/* Botón de Cierre (X) */}
                {onClose && type !== 'loading' && (
                    <button
                        onClick={onClose}
                        aria-label="Cerrar aviso"
                        style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 6 }}
                    >
                        <X size={20} color="#9CA3AF" />
                    </button>
                )}

                {/* Área del Icono */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    {iconComponent}
                </div>

                {/* Título y Mensaje */}
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: VIOLET_LEMON }}>
                    {title}
                </h3>
                <p style={{ color: '#4B5563', marginBottom: 18, fontWeight: 500 }}>
                    {message}
                </p>

                {/* Botón Principal (Acción de Confirmación) */}
                <button
                    onClick={onConfirm}
                    disabled={isButtonDisabled}
                    style={{ width: '100%', padding: 12, borderRadius: 12, fontSize: 16, fontWeight: 600, boxShadow: '0 8px 20px rgba(2,6,23,0.08)', border: 'none', backgroundColor: isButtonDisabled ? '#D1D5DB' : buttonColor, color: buttonTextColor, cursor: isButtonDisabled ? 'not-allowed' : 'pointer' }}
                >
                    {buttonText}
                </button>

                {/* Indicador de Carga */}
                {type === 'loading' && (
                    <p style={{ fontSize: 13, marginTop: 12, color: '#6B7280' }}>
                        Por favor, espera...
                    </p>
                )}

            </div>
        </div>
    );
};

export default ModalAviso;