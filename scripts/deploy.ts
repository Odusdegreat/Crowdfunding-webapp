import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");

  const crowdfunding = await Crowdfunding.deploy();

  await crowdfunding.waitForDeployment();

  console.log("Contract deployed to:", await crowdfunding.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
