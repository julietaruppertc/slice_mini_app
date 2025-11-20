import React, { useEffect } from 'react';
import { BG_PURPLE } from './types';
import type { Screen } from './types';

// Import del SVG guardado en assets
import lemonSlice from "../assets/svg/lemon_slice.svg";

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
                height: "100dvh",   // altura real del dispositivo
                backgroundColor: BG_PURPLE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <img
                src={lemonSlice}
                alt="lemon logo"
                style={{
                    width: "28vw",
                    height: "28vw",
                    maxWidth: 150,
                    maxHeight: 150,
                }}
            />
        </div>
    );
};

export default SplashScreen;
