import { ethers } from "ethers";
import type { Campaign } from "../types/campaign";

type Props = {
  campaign: Campaign;
  fundingAmount: string;
  onFundingAmountChange: (campaignId: number, value: string) => void;
  onFund: (campaignId: number) => void;
  isFunding: boolean;
};

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function formatEth(value: bigint) {
  return Number(ethers.formatEther(value)).toFixed(2);
}

export default function CampaignCard({
  campaign,
  fundingAmount,
  onFundingAmountChange,
  onFund,
  isFunding,
}: Props) {
  const isWithdrawn =
    "withdrawn" in (campaign as object) &&
    Boolean((campaign as Campaign & { withdrawn?: boolean }).withdrawn);
  const goal = Number(ethers.formatEther(campaign.goal));
  const raised = Number(ethers.formatEther(campaign.amountRaised));
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  const currentUnixTime = BigInt(Math.floor(Date.now() / 1000));
  const isEnded = campaign.deadline < currentUnixTime;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {campaign.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            By {shortAddress(campaign.creator)}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          ID #{campaign.id.toString()}
        </span>
      </div>

      <p className="mb-4 text-sm leading-6 text-slate-700">
        {campaign.description}
      </p>

      <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-700">
        <span>
          Raised: {formatEth(campaign.amountRaised)} /{" "}
          {formatEth(campaign.goal)} ETH
        </span>
        <span>{progress.toFixed(0)}%</span>
      </div>

      <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Goal</p>
          <p className="font-semibold text-slate-900">
            {formatEth(campaign.goal)} ETH
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Status</p>
          <p className="font-semibold text-slate-900">
            {isWithdrawn ? "Withdrawn" : isEnded ? "Ended" : "Active"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={fundingAmount}
          onChange={(e) =>
            onFundingAmountChange(Number(campaign.id), e.target.value)
          }
          placeholder="Amount in ETH"
          inputMode="decimal"
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-slate-200 focus:ring-4"
        />

        <button
          onClick={() => onFund(Number(campaign.id))}
          disabled={isFunding || isEnded}
          className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFunding ? "Funding..." : "Fund Campaign"}
        </button>
      </div>
    </div>
  );
}
