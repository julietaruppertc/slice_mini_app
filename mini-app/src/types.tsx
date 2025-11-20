// --- Constantes y Colores de Diseño ---
export const BG_PURPLE = '#806CF2';
export const VIOLET_LEMON = '#5E2CBA';
export const YELLOW_LEMON = '#F0EE00';
export const CURRENCIES = ['ARS', 'USD', 'ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'POL'];
export const FONT_HEADLINE = 'sans-serif'; // Simulación de "Stack Sans Headline"
export const FONT_TEXT = 'sans-serif'; // Simulación de "Stack Sans Text"
export const FONT_SERIF = 'serif'; // Simulación de "Stack Sans Serif"


// --- Tipos de Datos Compartidos ---

/**
 * Interfaz para los datos base de una Slice (Reserva) almacenados en LocalStorage.
 */
export interface SliceData {
  id_reserva: string;
  nombre: string;
  moneda: string; // Ej: 'ETH', 'ARS', 'USD'
  meta: number;
  montoInicial: number; // Monto actual reservado
  timestamp: string;
}

/**
 * Interfaz extendida para mostrar los datos en el Dashboard (con cálculos).
 */
export interface DisplaySliceData extends SliceData {
  monto_actual: number;
  isCrypto: boolean;
  dolar_conversion?: number;
  percentageCompleted: number;
  remainingAmount: number;
}

// *** IMPORTANTE: Añadido 'editar' a los tipos de pantalla ***
export type Screen = 'splash' | 'inicio' | 'crear' | 'info' | 'depositar' | 'retirar' | 'editar'; 

/**
 * Función utilitaria para notificar cambios en LocalStorage entre componentes.
 */
export const notifyStorageChange = () => {
    // Almacenamiento en LocalStorage por ahora, pero se migraría a Firestore
    window.dispatchEvent(new Event('storage'));
};