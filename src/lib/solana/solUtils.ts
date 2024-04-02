import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection("https://api.devnet.solana.com");

const sendSol = async (
  senderPrivateKey: string,
  recipientPublicKey: string,
  amount: number
): Promise<{ signature: string; estimatedFee: number } | Error | unknown> => {
  try {
    const senderKeyPair = Keypair.fromSecretKey(bs58.decode(senderPrivateKey));
    const recipientPublicKeyF = new PublicKey(recipientPublicKey);
    const { feeCalculator } = await connection.getRecentBlockhash();
    const feePerSignature =
      feeCalculator.lamportsPerSignature / LAMPORTS_PER_SOL;
    console.log(`Estimated fee for transaction: ${feePerSignature} SOL`);

    // Build the transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeyPair.publicKey,
        toPubkey: recipientPublicKeyF,
        lamports: LAMPORTS_PER_SOL * amount,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderKeyPair,
    ]);

    console.log("Transaction sent:", signature);

    return { signature: signature, estimatedFee: feePerSignature };
  } catch (error) {
    return error;
  }
};

const getBalance = async (publicKey: string): Promise<string> => {
  const publicKeyF = new PublicKey(publicKey);
  const balance = await connection.getBalance(publicKeyF);
  return (balance / LAMPORTS_PER_SOL).toString();
};

export { sendSol, getBalance };
