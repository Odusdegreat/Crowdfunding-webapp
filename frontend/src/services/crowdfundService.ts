import { ethers } from "ethers";
import { connectWallet } from "../utils/connectWallet";
import { CONTRACT_ADDRESS } from "../contracts/contractAddress";
import { CROWDFUNDING_ABI } from "../contracts/abi";

export async function createCampaign(
  title: string,
  description: string,
  goal: string,
  duration: number,
) {
  const signer = await connectWallet();

  if (!signer) return;

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CROWDFUNDING_ABI,
    signer,
  );

  const tx = await contract.createCampaign(
    title,
    description,
    ethers.parseEther(goal),
    duration,
  );

  await tx.wait();
}

export async function fundCampaign(id: number, amount: string) {
  const signer = await connectWallet();

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CROWDFUNDING_ABI,
    signer,
  );

  const tx = await contract.fundCampaign(id, {
    value: ethers.parseEther(amount),
  });

  await tx.wait();
}
