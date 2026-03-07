import { ethers } from "ethers";

type EthereumProvider = {
  request: (args: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<unknown>;
};

export async function connectWallet() {
  const ethereum = (window as Window & { ethereum?: EthereumProvider })
    .ethereum;

  if (!ethereum) {
    alert("Install MetaMask");
    return;
  }

  const provider = new ethers.BrowserProvider(ethereum);

  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();

  return signer;
}
