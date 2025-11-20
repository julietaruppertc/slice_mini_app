import type { CSSProperties } from 'react';
import { BG_PURPLE, YELLOW_LEMON, VIOLET_LEMON } from './types';

const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: '100vh',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: BG_PURPLE,
  },
  header: {
    width: '100%',
    maxWidth: 640,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingTop: '1rem',
  },
  wrapper: {
    width: '100%',
    maxWidth: 640,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: 40,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    textAlign: 'center',
    paddingTop: '2.5rem',
    paddingBottom: '2.5rem',
  },
  subLabel: {
    color: VIOLET_LEMON,
    fontSize: '0.875rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '.05em',
  },
  amount: {
    fontSize: '3rem',
    fontWeight: 800,
    color: '#4c1d95',
    marginBottom: '0.25rem',
    wordBreak: 'break-word',
  },
  amountSmall: {
    fontSize: '1rem',
    marginLeft: '0.5rem',
  },
  progCard: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: 40,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  progressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    fontSize: '0.875rem',
    color: '#4b5563',
  },
  progressBoxLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  progressPercent: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#16a34a',
  },
  progressBoxRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  progressBarOuter: {
    position: 'relative',
    height: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBarInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '0%',
    backgroundColor: YELLOW_LEMON,
    transition: 'width 0.7s ease-out',
  } as any,
  progressText: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280',
    paddingTop: '0.5rem',
    fontWeight: 500,
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  actionIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  } as any,
  actionLabel: {
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.875rem',
  },
  actionLabelWhite: {
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.875rem',
  },
  actionIcon: {
    width: 32,
    height: 32,
  },
};

export const progressBarInner = (percent: number): CSSProperties => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: `${percent}%`,
  backgroundColor: YELLOW_LEMON,
  transition: 'width 0.7s ease-out',
});

export const actionIconCircle = (bg: string): CSSProperties => ({
  width: 64,
  height: 64,
  borderRadius: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  backgroundColor: bg,
});

export default styles;
