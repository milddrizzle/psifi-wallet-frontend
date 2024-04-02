import { ethers, FeeData } from "ethers";
import { evmTxType } from "../evms/txType";

const nodeURL = "https://gateway.tenderly.co/public/goerli";
const HTTPSProvider = new ethers.JsonRpcProvider(nodeURL);

const chainId = 5;

const calcFeeData = async (
  maxFeePerGas?: number,
  maxPriorityFeePerGas?: number
): Promise<{ maxFeePerGas: number; maxPriorityFeePerGas: number }> => {
  const feeData = await HTTPSProvider.getFeeData();
  const newMaxFeePerGas =
    feeData.maxFeePerGas == null
      ? "0"
      : ethers.formatEther(feeData.maxFeePerGas);
  const newMaxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas == null
      ? "0"
      : ethers.formatEther(feeData.maxPriorityFeePerGas);
  maxFeePerGas = maxFeePerGas || Number(newMaxFeePerGas);
  maxPriorityFeePerGas =
    maxPriorityFeePerGas || Number(newMaxPriorityFeePerGas);

  if (maxFeePerGas < maxPriorityFeePerGas) {
    throw "Error: Max fee per gas cannot be less than max priority fee per gas";
  }

  return {
    maxFeePerGas: maxFeePerGas,
    maxPriorityFeePerGas: maxPriorityFeePerGas,
  };
};

const sendEther = async (
  privateKey: string,
  to: string,
  amount: number,
  option: string,
  maxFeePerGas?: number,
  maxPriorityFeePerGas?: number,
  nonce?: number
): Promise<{ hash: string } | Error | unknown> => {
  var minAmount: bigint = BigInt(0);
  try {
    const signer = new ethers.Wallet(privateKey, HTTPSProvider);
    const balance = await HTTPSProvider.getBalance(signer.address);
    const sendToAmount =
      balance < ethers.parseEther(amount.toFixed(18))
        ? balance
        : ethers.parseEther(amount.toFixed(18));
    const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } =
      await HTTPSProvider.getFeeData();
    minAmount = ethers.toBigInt(21000) * BigInt(maxFeePerGas || 0);
    if (sendToAmount < minAmount) {
      return {
        failed: true,
        message: "Too small amount to send",
        min: ethers.formatEther(minAmount),
      };
    }
    if (option === "review") {
      return {
        failed: false,
        receive: ethers.formatEther(sendToAmount - minAmount),
      };
    }
    let tx = {
      to,
      value: sendToAmount - minAmount,
    };
    const response = await signer.sendTransaction(tx);
    return response;
  } catch (error) {
    return error;
  }
};

const getBalance = async (address: string): Promise<string> => {
  let etherBalance = Number(await HTTPSProvider.getBalance(address)) / 10 ** 18;
  return etherBalance.toString();
};

export { sendEther, getBalance };
