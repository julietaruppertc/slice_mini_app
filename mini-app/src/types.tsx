// --- Constantes y Colores de Diseño ---
export const BG_PURPLE = '#806CF2';
export const VIOLET_LEMON = '#5E2CBA';
export const YELLOW_LEMON = '#F0EE00';
export const CURRENCIES = ['ARS', 'USD', 'ETH', 'BTC', 'USDC', 'USDT', 'DAI', 'POL'];
export const FONT_HEADLINE = 'sans-serif'; // Simulación de "Stack Sans Headline"
export const FONT_TEXT = 'sans-serif'; // Simulación de "Stack Sans Text"
export const FONT_SERIF = 'serif'; // Simulación de "Stack Sans Serif"


export interface SliceData {
  id_reserva: string;
  nombre: string;
  moneda: string; 
  montoInicial: number; 
  timestamp: string;
}


export interface DisplaySliceData extends SliceData {
  monto_actual: number;
  isCrypto: boolean;
  meta: number;    
  dolar_conversion?: number;
  percentageCompleted: number;
  remainingAmount: number;
}


export type Screen = 'splash' | 'inicio' | 'crear' | 'info' | 'depositar' | 'retirar' | 'editar'; 


export const notifyStorageChange = () => {
    window.dispatchEvent(new Event('storage'));
};