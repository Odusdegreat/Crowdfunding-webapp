import { ethers } from "ethers";
import { connectWallet } from "../utils/connectWallet";
import { CONTRACT_ADDRESS } from "../contracts/contractAddress";
import { CROWDFUNDING_ABI } from "../contracts/abi";
import type { Campaign } from "../types/campaign";

type EthereumProvider = {
  request: (args: {
    method: string;
    params?: unknown[] | object;
  }) => Promise<unknown>;
};

async function getReadContract() {
  const ethereum = (window as Window & { ethereum?: EthereumProvider })
    .ethereum;

  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(ethereum);

  return new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, provider);
}

async function getWriteContract() {
  const signer = await connectWallet();

  return new ethers.Contract(CONTRACT_ADDRESS, CROWDFUNDING_ABI, signer);
}

export async function createCampaign(
  title: string,
  description: string,
  goal: string,
  duration: number,
) {
  const contract = await getWriteContract();

  const tx = await contract.createCampaign(
    title,
    description,
    ethers.parseEther(goal),
    duration,
  );

  await tx.wait();
  return tx;
}

export async function fundCampaign(campaignId: number, amount: string) {
  const contract = await getWriteContract();

  const tx = await contract.fundCampaign(campaignId, {
    value: ethers.parseEther(amount),
  });

  await tx.wait();
  return tx;
}

export async function getAllCampaigns(): Promise<Campaign[]> {
  const contract = await getReadContract();
  const campaigns = await contract.getAllCampaigns();
  return campaigns as Campaign[];
}
