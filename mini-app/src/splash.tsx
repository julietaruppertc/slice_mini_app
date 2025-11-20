import React, { useEffect } from 'react';
import { BG_PURPLE } from './types'; // Asume que BG_PURPLE es el color morado
import type { Screen } from './types';

// Import del SVG guardado en assets
import lemonSlice from "../assets/svg/lemon_slice.svg"; // El SVG del limón

// const COLOR_PURPLE = '#806cf2'; 
// const COLOR_YELLOW = '#f0ee00'; // Color amarillo dorado

const SplashScreen: React.FC<{ navigate: (screen: Screen) => void }> = ({ navigate }) => {

    useEffect(() => {

        const timer = setTimeout(() => {
            navigate('inicio');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100dvh", 
                backgroundColor: BG_PURPLE, 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            
            <img
                src={lemonSlice}
                alt="Logo Rodaja de Limón"
                style={{
                    width: "40vw", 
                    height: "40vw",
                    maxWidth: 200, 
                    maxHeight: 200,
                 
                }}
            />
        </div>
    );
};

export default SplashScreen;