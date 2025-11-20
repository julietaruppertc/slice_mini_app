import type { CSSProperties } from 'react';
import { BG_PURPLE } from './types';

const styles: { [key: string]: CSSProperties } = {
  splashContainer: {
    width: '100vw',
    height: '100vh',
    backgroundColor: BG_PURPLE || 'green',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: '40vw',
    height: '40vw',
    maxWidth: '200px',
    maxHeight: '200px',
  },
};

export default styles;
