export const TransactionResult = { SUCCESS: 'SUCCESS', FAILURE: 'FAILURE' } as const;

export async function authenticate(): Promise<{ result: typeof TransactionResult[keyof typeof TransactionResult]; data: { wallet: string } }> {
  return { result: TransactionResult.SUCCESS, data: { wallet: 'mock-mock-wallet' } };
}

export async function deposit(_opts: { amount: string; tokenName: string }) {
  return { result: TransactionResult.SUCCESS, data: {} };
}

export async function withdraw(_opts: { amount: string; tokenName: string }) {
  // Mock withdraw implementation — in production this should call Lemon's SDK
  return { result: TransactionResult.SUCCESS, data: { txHash: 'mock-withdraw-txhash' } };
}

export function isWebView() {
  return false;
}
