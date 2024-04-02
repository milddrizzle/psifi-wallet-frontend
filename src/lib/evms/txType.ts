export type evmTxType = {
  type: number;
  nonce: number;
  to: string;
  maxPriorityFeePerGas: number;
  maxFeePerGas: number;
  value: bigint;
  chainId: number;
  gasLimit?: bigint;
  data?: string;
};
