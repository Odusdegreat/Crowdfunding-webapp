# Crowdfunding DApp

A full-stack Web3 crowdfunding project built with Solidity, Hardhat 3, React, TypeScript, and Ethers v6.

## Features

- Create crowdfunding campaigns
- Fund campaigns with ETH
- Withdraw funds when goal is reached
- Refund contributors if campaign fails
- Connect wallet in frontend (MetaMask)

## Tech Stack

- Smart contracts: Solidity (`0.8.28`)
- Blockchain tooling: Hardhat `3.x`
- Contract interaction: Ethers `6.x`
- Frontend: React + TypeScript + Vite + TailwindCSS

## Project Structure

```txt
.
├─ contracts/
│  ├─ Crowdfunding.sol
│  └─ Lock.sol
├─ test/
│  ├─ Crowdfunding.test.ts
│  └─ Lock.ts
├─ scripts/
│  └─ deploy.ts
└─ frontend/
   └─ (React app)
```

## Prerequisites

- Node.js 20+ (recommended)
- npm
- MetaMask (for frontend wallet connection)

## Install Dependencies

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Smart Contract Commands

From project root:

Compile contracts:

```bash
npx hardhat compile
```

Run tests:

```bash
npx hardhat test
```

Deploy locally:

```bash
npx hardhat run scripts/deploy.ts
```

## Frontend Commands

From `frontend/`:

Start dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Notes

- This repo is configured for Hardhat 3 plugin style.
- Tests and scripts use `await network.connect()` to access `ethers` and network helpers.
