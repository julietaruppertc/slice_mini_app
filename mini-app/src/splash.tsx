import React, { useEffect, useState } from 'react';
import { BG_PURPLE, YELLOW_LEMON, FONT_HEADLINE } from './types'; // ¡Ruta de importación ajustada!
import type { Screen } from './types';

// Icono SVG del limón, escalado a 142x142px
const LemonLogo: React.FC = () => (
    <svg 
        width="142" 
        height="142" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* El color F0EE00 (YELLOW_LEMON) se usa como color primario del logo */}
        <path 
            fill={YELLOW_LEMON}
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
        />
        {/* Simulación del "gajito" o sección de la fruta, con un color ligeramente diferente para contraste o detalle */}
        <path 
            fill={BG_PURPLE}
            d="M12 6.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" 
        />
    </svg>
);


/**
 * Componente de la pantalla de carga inicial (Splash Screen).
 * Muestra el logo centrado y navega a 'inicio' después de 2 segundos.
 */
const SplashScreen: React.FC<{ navigate: (screen: Screen) => void }> = ({ navigate }) => {
    
    // Controla el tiempo que el splash screen es visible
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('inicio');
        }, 2000); // 2 segundos

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div 
            className="min-h-screen flex items-center justify-center transition-opacity duration-1000"
            style={{ backgroundColor: BG_PURPLE }}
        >
            <div className="flex flex-col items-center">
                <LemonLogo />
                {/* Opcional: Texto "Slice" si fuera parte del diseño */}
                {/* <span 
                    className="text-6xl font-extrabold mt-4" 
                    style={{ color: YELLOW_LEMON, fontFamily: FONT_HEADLINE }}
                >
                    Slice
                </span> */}
            </div>
        </div>
    );
};

export default SplashScreen;