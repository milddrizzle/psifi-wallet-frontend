import { ethers } from "ethers";
// @ts-ignore
import { Avalanche } from "avalanche";
import { evmTxType } from "../evms/txType";

const nodeURL = "https://api.avax-test.network/ext/bc/C/rpc";
const HTTPSProvider = new ethers.JsonRpcProvider(nodeURL);

const chainId = 43113;
const avalanche = new Avalanche(
  "api.avax-test.network",
  undefined,
  "https",
  chainId
);
const cchain = avalanche.CChain();

const calcFeeData = async (
  maxFeePerGas?: number,
  maxPriorityFeePerGas?: number
): Promise<{ maxFeePerGas: number; maxPriorityFeePerGas: number }> => {
  const baseFee = parseInt(await cchain.getBaseFee(), 16) / 1e9;
  maxPriorityFeePerGas =
    maxPriorityFeePerGas == undefined
      ? parseInt(await cchain.getMaxPriorityFeePerGas(), 16) / 1e9
      : maxPriorityFeePerGas;
  maxFeePerGas =
    maxFeePerGas == undefined ? baseFee + maxPriorityFeePerGas : maxFeePerGas;

  if (maxFeePerGas < maxPriorityFeePerGas) {
    throw "Error: Max fee per gas cannot be less than max priority fee per gas";
  }

  return {
    maxFeePerGas: maxFeePerGas,
    maxPriorityFeePerGas: maxPriorityFeePerGas,
  };
};

const sendAvax = async (
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
  let avaxBalance = Number(await HTTPSProvider.getBalance(address)) / 10 ** 18;
  return avaxBalance.toString();
};

export { sendAvax, getBalance };
