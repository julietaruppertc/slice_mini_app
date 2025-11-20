import React, { useEffect, useState } from 'react';
import { authenticate, deposit, isWebView, TransactionResult, TokenName } from '@lemoncash/mini-app-sdk';

export const MiniApp = () => {
  const [wallet, setWallet] = useState<string | undefined>(undefined);

  const handleAuthentication = async () => {
    const result = await authenticate();
    if (result.result === TransactionResult.SUCCESS) {
      setWallet(result.data.wallet);
    }
  };

  useEffect(() => {
    handleAuthentication();
  }, []);

    const handleDeposit = async () => {
      try {
        const result = await deposit({
          amount: '100',
          tokenName: TokenName.USDC,
        });

        // Añadimos esta verificación para cumplir con TypeScript y la estructura del SDK.
        if (result.result === TransactionResult.SUCCESS) {
          // ACCESO CORREGIDO: Usamos result.data.txHash
          console.log('Deposit successful:', result.data.txHash); 
        } else {
          // Manejar FAILED o CANCELLED si es necesario, pero para el Quickstart,
          // un simple error en el catch de afuera es suficiente si la app lo maneja.
          // Opcional: throw new Error('Transaction was not successful.');
        }

      } catch (error) {
        console.error('Deposit failed:', error);
        throw error;
      }
    };

  if (!isWebView()) {
    return <div>Please open this app in Lemon Cash</div>;
  } 

  return (
    <div>
        <span>
            {wallet
                ? `${wallet.slice(0, 8)}...${wallet.slice(-8)}`
                : 'Authenticating...'
            }
        </span>

      <button onClick={handleDeposit} disabled={!wallet}>
        {wallet ? 'Send 100 USDC' : 'Authenticating...'}
      </button>
    </div>
  );
};