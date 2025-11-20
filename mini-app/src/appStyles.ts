import type { CSSProperties } from 'react';
import { BG_PURPLE, YELLOW_LEMON, FONT_HEADLINE } from './types';

const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG_PURPLE,
  },
  emoji: {
    fontSize: '6rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 800,
    color: YELLOW_LEMON,
    fontFamily: FONT_HEADLINE,
  },
};

export default styles;
