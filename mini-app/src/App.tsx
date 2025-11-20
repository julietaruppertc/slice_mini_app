import React, { useState, useEffect } from 'react';
// Tus imports de estilos y tipos
import { BG_PURPLE, YELLOW_LEMON, FONT_HEADLINE } from './types';
import type { DisplaySliceData, SliceData, Screen } from './types';

// --- IMPORTAR LAS PANTALLAS (Asegurate que las rutas './archivo' sean correctas) ---
import Inicio from './inicio';
import CrearSlice from './crear_slice'; // O el nombre que tenga tu archivo
import InfoSlice from './info_slice';    // El archivo nuevo que te pasé antes
import DepositarScreen from './depositar';
import RetirarScreen from './retirar';
import EditarScreen from './editar';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash'); 
  const [selectedSlice, setSelectedSlice] = useState<DisplaySliceData | null>(null);

  // Simulación del Splash
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('inicio');
    }, 2500); // Le di medio segundo más para que se aprecie
    return () => clearTimeout(timer);
  }, []);

  // Handler de navegación
  const navigate = (screen: Screen, data?: any) => {
    if (screen === 'info' || screen === 'depositar' || screen === 'retirar' || screen === 'editar') {
      // Guardamos la data de la slice seleccionada para pasarla a la pantalla
      setSelectedSlice(data as DisplaySliceData);
      setCurrentScreen(screen);
    } else {
      setCurrentScreen(screen);
      setSelectedSlice(null);
    }
  };

  // Renderizar la pantalla actual
  switch (currentScreen) {
    case 'splash':
      return (
        <div className="min-h-screen flex items-center justify-center flex-col animate-pulse" style={{ backgroundColor: BG_PURPLE }}>
           {/* Si tenés la imagen de la rueda, ponela acá. Si no, dejá este texto o un emoji grande */}
           <span className="text-8xl mb-4">🍋</span> 
           <span className="text-5xl font-extrabold" style={{ color: YELLOW_LEMON, fontFamily: FONT_HEADLINE }}>
            Slice
          </span>
        </div>
      );

    case 'crear':
      // Acá llamamos al archivo externo, no al const de adentro
      return <CrearSlice navigate={navigate} />;

    case 'info':
      return selectedSlice ? <InfoSlice slice={selectedSlice} navigate={navigate} /> : null;

    case 'depositar':
       return selectedSlice ? <DepositarScreen slice={selectedSlice} navigate={navigate} /> : null;

    case 'retirar':
       return selectedSlice ? <RetirarScreen slice={selectedSlice} navigate={navigate} /> : null;

    case 'editar':
       return selectedSlice ? <EditarScreen slice={selectedSlice} navigate={navigate} /> : null;

    case 'inicio':
    default:
      return <Inicio navigate={navigate} />;
  }
};

export default App;