import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";

export default defineConfig({
  solidity: "0.8.28",
  plugins: [hardhatToolboxMochaEthersPlugin],
});
