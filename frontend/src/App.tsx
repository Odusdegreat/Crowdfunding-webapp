import { useMemo, useState } from "react";
import { connectWallet } from "./utils/connectWallet";
import { createCampaign, fundCampaign } from "../src/services/crowdfundService";

function shortAddr(addr?: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function App() {
  const [wallet, setWallet] = useState<string>("");
  const [connecting, setConnecting] = useState(false);

  // create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalEth, setGoalEth] = useState("");

  // quick fund demo
  const [campaignId, setCampaignId] = useState("1");
  const [fundEth, setFundEth] = useState("0.05");

  const canCreate = useMemo(() => {
    return title.trim() && description.trim() && Number(goalEth) > 0;
  }, [title, description, goalEth]);

  async function handleConnect() {
    try {
      setConnecting(true);
      const signer = await connectWallet();
      if (!signer) return;
      const addr = await signer.getAddress();
      setWallet(addr);
    } finally {
      setConnecting(false);
    }
  }

  async function handleCreate() {
    // duration = 1 day
    await createCampaign(title, description, goalEth, 86400);
    setTitle("");
    setDescription("");
    setGoalEth("");
    alert("✅ Campaign created!");
  }

  async function handleFund() {
    await fundCampaign(Number(campaignId), fundEth);
    alert("✅ Funded!");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Topbar */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900" />
            <div>
              <p className="text-sm font-semibold leading-4">Crowdfunding</p>
              <p className="text-xs text-slate-500">Hardhat 3 • Ethers • TS</p>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={connecting}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {wallet
              ? `Connected: ${shortAddr(wallet)}`
              : connecting
              ? "Connecting..."
              : "Connect Wallet"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-2">
        {/* Create campaign */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Create Campaign</h2>
            <p className="text-sm text-slate-500">
              Create a new campaign on-chain (goal in ETH).
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build SaveLagos MVP"
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-4"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you raising for?"
                rows={4}
                className="w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-4"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Goal (ETH)
              </label>
              <input
                value={goalEth}
                onChange={(e) => setGoalEth(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 1"
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-4"
              />
              <p className="mt-1 text-xs text-slate-500">
                Duration is set to 24 hours for now.
              </p>
            </div>

            <button
              onClick={handleCreate}
              disabled={!wallet || !canCreate}
              className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Campaign
            </button>

            {!wallet && (
              <p className="text-xs text-slate-500">
                Connect your wallet first.
              </p>
            )}
          </div>
        </div>

        {/* Fund campaign */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Fund Campaign</h2>
            <p className="text-sm text-slate-500">
              Quick funding form (by campaign ID).
            </p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Campaign ID
                </label>
                <input
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  inputMode="numeric"
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-4"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Amount (ETH)
                </label>
                <input
                  value={fundEth}
                  onChange={(e) => setFundEth(e.target.value)}
                  inputMode="decimal"
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-4"
                />
              </div>
            </div>

            <button
              onClick={handleFund}
              disabled={
                !wallet || Number(fundEth) <= 0 || Number(campaignId) <= 0
              }
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Fund Campaign
            </button>

            <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
              Next upgrade: we’ll display a real campaign list from the contract
              (instead of typing ID).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
