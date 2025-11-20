export const TransactionResult = { SUCCESS: 'SUCCESS', FAILURE: 'FAILURE' } as const;

export async function authenticate(): Promise<{ result: typeof TransactionResult[keyof typeof TransactionResult]; data: { wallet: string } }> {
  return { result: TransactionResult.SUCCESS, data: { wallet: 'mock-mock-wallet' } };
}

export async function deposit(_opts: { amount: string; tokenName: string }) {
  return { result: TransactionResult.SUCCESS, data: {} };
}

export function isWebView() {
  return false;
}
