import React, { useEffect } from 'react';
import type { Screen } from './types';

// Importamos el SVG
import lemonSlice from "./assets/lemon_slice.svg"; 

// Importamos estilos in-line (objeto JS)
import styles from './splashStyles';

const SplashScreen: React.FC<{ navigate: (screen: Screen) => void }> = ({ navigate }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('inicio');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={styles.splashContainer}>
            <img src={lemonSlice} alt="Logo Rodaja de Limón" style={styles.splashLogo} />
        </div>
    );
};

export default SplashScreen;


