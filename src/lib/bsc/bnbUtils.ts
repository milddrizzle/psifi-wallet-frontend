import { ethers } from "ethers";
import { evmTxType } from "../evms/txType";

const nodeURL = "https://data-seed-prebsc-1-s1.bnbchain.org:8545";
const HTTPSProvider = new ethers.JsonRpcProvider(nodeURL);

const chainId = 97;

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

const sendBnb = async (
  privateKey: string,
  to: string,
  amount: string,
  maxFeePerGas?: number,
  maxPriorityFeePerGas?: number,
  nonce?: number
): Promise<{ txHash: string; gas: string } | Error | unknown> => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const address = wallet.address;
    const signer = new ethers.Wallet(privateKey, HTTPSProvider);
    if (nonce == undefined) {
      nonce = await HTTPSProvider.getTransactionCount(address);
    }

    ({ maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(
      maxFeePerGas,
      maxPriorityFeePerGas
    ));

    maxFeePerGas = Number(ethers.parseUnits(maxFeePerGas.toString(), "gwei"));
    maxPriorityFeePerGas = Number(
      ethers.parseUnits(maxPriorityFeePerGas.toString(), "gwei")
    );

    const tx: evmTxType = {
      type: 2,
      nonce,
      to,
      maxPriorityFeePerGas,
      maxFeePerGas,
      value: ethers.parseEther(amount),
      chainId,
    };

    tx.gasLimit = await HTTPSProvider.estimateGas(tx);
    const gasPrice = ethers.formatEther(
      Number((await HTTPSProvider.getFeeData()).gasPrice)
    );
    const gas = String(Number(tx.gasLimit) * Number(gasPrice));

    const signedTx = await wallet.signTransaction(tx);
    const txHash = ethers.keccak256(signedTx);

    await (await signer.sendTransaction(tx)).wait();
    return { txHash: txHash, gas: gas };
  } catch (error) {
    return error;
  }
};

const getBalance = async (address: string): Promise<string> => {
  let etherBalance = Number(await HTTPSProvider.getBalance(address)) / 10 ** 18;
  return etherBalance.toString();
};

export { sendBnb, getBalance };
