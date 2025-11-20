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
    let iconColor = 'text-gray-900';
    let buttonStyle = 'bg-yellow-400 hover:bg-yellow-500 text-black';
    let isButtonDisabled = false;
    
    switch (type) {
        case 'success':
            iconComponent = <CheckCircle className="w-12 h-12" style={{ color: YELLOW_LEMON }} />;
            iconColor = YELLOW_LEMON;
            break;
        case 'error':
            iconComponent = <AlertTriangle className="w-12 h-12 text-red-500" />;
            iconColor = 'text-red-500';
            buttonStyle = 'bg-red-500 hover:bg-red-600 text-white';
            break;
        case 'loading':
            // Icono de carga giratorio
            iconComponent = <Loader className="w-12 h-12 text-violet-600 animate-spin" style={{ color: VIOLET_LEMON }} />;
            iconColor = VIOLET_LEMON;
            isButtonDisabled = true; // Deshabilita el botón durante la carga
            buttonStyle = 'bg-gray-300 text-gray-500 cursor-not-allowed';
            break;
        case 'custom':
        default:
            iconComponent = <div className="text-4xl">💡</div>; // Icono por defecto o personalizado
            iconColor = VIOLET_LEMON;
            break;
    }

    // --- Renderizado del Modal ---
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-xs w-full text-center transform transition-transform duration-300 scale-100">
                
                {/* Botón de Cierre (X) */}
                {onClose && type !== 'loading' && (
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        aria-label="Cerrar aviso"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}

                {/* Área del Icono */}
                <div className="flex justify-center mb-4">
                    {iconComponent}
                </div>

                {/* Título y Mensaje */}
                <h3 className="text-2xl font-bold mb-2" style={{ color: VIOLET_LEMON }}>
                    {title}
                </h3>
                <p className="text-gray-600 mb-6 font-medium">
                    {message}
                </p>

                {/* Botón Principal (Acción de Confirmación) */}
                <button
                    onClick={onConfirm}
                    disabled={isButtonDisabled}
                    className={`
                        w-full p-3 rounded-xl text-lg font-semibold transition shadow-md
                        ${buttonStyle}
                    `}
                >
                    {buttonText}
                </button>
                
                {/* Indicador de Carga */}
                {type === 'loading' && (
                    <p className="text-sm mt-3 text-gray-500">
                        Por favor, espera...
                    </p>
                )}

            </div>
        </div>
    );
};

export default ModalAviso;