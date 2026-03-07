import { useMemo, useState } from "react";
import { connectWallet } from "./utils/connectWallet";
import { createCampaign, fundCampaign } from "./services/crowdfundService";

function shortAddr(addr?: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function App() {
  const [wallet, setWallet] = useState<string>("");
  const [connecting, setConnecting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [funding, setFunding] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "fund">("create");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalEth, setGoalEth] = useState("");

  const [campaignId, setCampaignId] = useState("1");
  const [fundEth, setFundEth] = useState("0.4");

  const canCreate = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      Number(goalEth) > 0
    );
  }, [title, description, goalEth]);

  const demoGoal = 1;
  const demoRaised = Number(fundEth) || 0;
  const progressPercent = Math.min((demoRaised / demoGoal) * 100, 100);

  async function handleConnect() {
    try {
      setConnecting(true);
      const signer = await connectWallet();
      if (!signer) return;
      const addr = await signer.getAddress();
      setWallet(addr);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet.");
    } finally {
      setConnecting(false);
    }
  }

  async function handleCreate() {
    if (!wallet) {
      alert("Connect your wallet first.");
      return;
    }
    if (!canCreate) {
      alert("Please fill in all fields correctly.");
      return;
    }
    try {
      setCreating(true);
      await createCampaign(title, description, goalEth, 86400);
      setTitle("");
      setDescription("");
      setGoalEth("");
      alert("✅ Campaign created successfully!");
    } catch (error: any) {
      console.error("Create campaign failed:", error);
      alert(
        error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Failed to create campaign.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleFund() {
    if (!wallet) {
      alert("Connect your wallet first.");
      return;
    }
    if (Number(campaignId) <= 0 || Number(fundEth) <= 0) {
      alert("Enter a valid campaign ID and amount.");
      return;
    }
    try {
      setFunding(true);
      await fundCampaign(Number(campaignId), fundEth);
      alert("✅ Campaign funded successfully!");
    } catch (error: any) {
      console.error("Funding failed:", error);
      alert(
        error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Failed to fund campaign.",
      );
    } finally {
      setFunding(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #F7F6F3;
          --surface: #FFFFFF;
          --border: #E8E5DF;
          --text-primary: #1A1714;
          --text-secondary: #7A756C;
          --accent: #2D6A4F;
          --accent-light: #E8F4EE;
          --accent-hover: #245A42;
          --danger: #C84B31;
          --radius: 16px;
          --radius-sm: 10px;
          --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
          --shadow-md: 0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06);
        }

        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text-primary); }

        .app { min-height: 100vh; display: flex; flex-direction: column; }

        /* NAV */
        .nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(247,246,243,0.85); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
        }
        .nav-inner {
          max-width: 680px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 60px;
        }
        .nav-brand { display: flex; align-items: center; gap: 10px; }
        .nav-logo {
          width: 32px; height: 32px; border-radius: 10px;
          background: var(--text-primary);
          display: flex; align-items: center; justify-content: center;
        }
        .nav-logo svg { width: 16px; height: 16px; color: white; }
        .nav-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; letter-spacing: -0.3px; }

        .connect-btn {
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          padding: 8px 16px; border-radius: 999px; border: 1px solid var(--border);
          background: var(--surface); color: var(--text-primary);
          cursor: pointer; transition: all 0.15s ease;
          display: flex; align-items: center; gap: 6px;
        }
        .connect-btn:hover { background: var(--text-primary); color: white; border-color: var(--text-primary); }
        .connect-btn.connected { background: var(--accent-light); border-color: #B7DCC8; color: var(--accent); }
        .connect-btn.connected:hover { background: var(--accent); color: white; border-color: var(--accent); }
        .connect-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }

        /* MAIN */
        .main { flex: 1; max-width: 680px; margin: 0 auto; width: 100%; padding: 40px 24px 80px; }

        /* HERO */
        .hero { margin-bottom: 36px; }
        .hero h1 {
          font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700;
          letter-spacing: -0.8px; line-height: 1.2; margin-bottom: 8px;
        }
        .hero p { font-size: 15px; color: var(--text-secondary); font-weight: 300; line-height: 1.6; }

        /* TABS */
        .tabs { display: flex; gap: 4px; background: var(--border); padding: 4px; border-radius: 12px; margin-bottom: 24px; }
        .tab {
          flex: 1; padding: 9px 0; font-size: 14px; font-weight: 500;
          border: none; background: transparent; border-radius: 9px;
          cursor: pointer; transition: all 0.15s ease; color: var(--text-secondary);
          font-family: 'DM Sans', sans-serif;
        }
        .tab.active { background: var(--surface); color: var(--text-primary); box-shadow: var(--shadow); }

        /* CARD */
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); }

        /* FORM */
        .field { margin-bottom: 20px; }
        .field:last-of-type { margin-bottom: 0; }
        label { display: block; font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px; letter-spacing: 0.1px; }

        input, textarea {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          background: var(--bg); color: var(--text-primary);
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          -webkit-appearance: none;
        }
        input::placeholder, textarea::placeholder { color: #C0BAB0; }
        input:focus, textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(45,106,79,0.1); background: white; }
        textarea { resize: none; line-height: 1.6; }

        .field-hint { font-size: 12px; color: var(--text-secondary); margin-top: 5px; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* PROGRESS */
        .progress-card {
          background: var(--bg); border: 1.5px solid var(--border);
          border-radius: var(--radius-sm); padding: 16px; margin-bottom: 20px;
        }
        .progress-meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
        .progress-label { font-size: 13px; color: var(--text-secondary); }
        .progress-values { font-size: 14px; font-weight: 600; }
        .progress-values span { color: var(--text-secondary); font-weight: 400; font-size: 13px; }
        .progress-pct { font-size: 13px; font-weight: 600; color: var(--accent); }
        .progress-track { height: 6px; background: var(--border); border-radius: 999px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--accent); border-radius: 999px; transition: width 0.4s ease; }

        /* BUTTON */
        .btn {
          width: 100%; padding: 13px; border-radius: var(--radius-sm);
          border: none; font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all 0.15s ease; letter-spacing: 0.1px;
          margin-top: 24px;
        }
        .btn-primary { background: var(--text-primary); color: white; }
        .btn-primary:hover:not(:disabled) { background: #2D2925; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .btn-green { background: var(--accent); color: white; }
        .btn-green:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(45,106,79,0.25); }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

        .wallet-notice {
          text-align: center; font-size: 12px; color: var(--text-secondary);
          margin-top: 12px; padding: 10px; background: var(--bg);
          border-radius: var(--radius-sm); border: 1px dashed var(--border);
        }

        .divider { height: 1px; background: var(--border); margin: 24px 0; }

        @media (max-width: 480px) {
          .field-row { grid-template-columns: 1fr; }
          .hero h1 { font-size: 24px; }
          .main { padding: 28px 16px 60px; }
        }
      `}</style>

      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-inner">
            <div className="nav-brand">
              <div className="nav-logo">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M8 2L14 6V10L8 14L2 10V6L8 2Z" />
                </svg>
              </div>
              <span className="nav-title">Fundchain</span>
            </div>

            <button
              onClick={handleConnect}
              disabled={connecting}
              className={`connect-btn ${wallet ? "connected" : ""}`}
            >
              {wallet && <span className="dot" />}
              {wallet
                ? shortAddr(wallet)
                : connecting
                ? "Connecting…"
                : "Connect Wallet"}
            </button>
          </div>
        </nav>

        {/* MAIN */}
        <main className="main">
          <div className="hero">
            <h1>Fund what matters.</h1>
            <p>
              Create and support campaigns directly on-chain — transparent,
              trustless, and open.
            </p>
          </div>

          {/* TABS */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              Create Campaign
            </button>
            <button
              className={`tab ${activeTab === "fund" ? "active" : ""}`}
              onClick={() => setActiveTab("fund")}
            >
              Fund Campaign
            </button>
          </div>

          {/* CREATE */}
          {activeTab === "create" && (
            <div className="card">
              <div className="field">
                <label>Campaign Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build SaveLagos MVP"
                />
              </div>

              <div className="field">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What are you raising funds for? Give supporters enough context."
                  rows={4}
                />
              </div>

              <div className="field">
                <label>Goal Amount (ETH)</label>
                <input
                  value={goalEth}
                  onChange={(e) => setGoalEth(e.target.value)}
                  inputMode="decimal"
                  placeholder="e.g. 1.5"
                />
                <p className="field-hint">
                  Campaign duration is fixed at 24 hours.
                </p>
              </div>

              <button
                onClick={handleCreate}
                disabled={!wallet || !canCreate || creating}
                className="btn btn-green"
              >
                {creating ? "Creating…" : "Create Campaign"}
              </button>

              {!wallet && (
                <div className="wallet-notice">
                  Connect your wallet to create a campaign
                </div>
              )}
            </div>
          )}

          {/* FUND */}
          {activeTab === "fund" && (
            <div className="card">
              <div className="field-row" style={{ marginBottom: 20 }}>
                <div>
                  <label>Campaign ID</label>
                  <input
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                    inputMode="numeric"
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label>Amount (ETH)</label>
                  <input
                    value={fundEth}
                    onChange={(e) => setFundEth(e.target.value)}
                    inputMode="decimal"
                    placeholder="e.g. 0.5"
                  />
                </div>
              </div>

              <div className="progress-card">
                <div className="progress-meta">
                  <span className="progress-label">Campaign progress</span>
                  <span className="progress-pct">
                    {progressPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="progress-values" style={{ marginBottom: 10 }}>
                  {demoRaised} ETH <span>of {demoGoal} ETH goal</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleFund}
                disabled={
                  !wallet ||
                  Number(fundEth) <= 0 ||
                  Number(campaignId) <= 0 ||
                  funding
                }
                className="btn btn-primary"
                style={{ marginTop: 0 }}
              >
                {funding ? "Sending…" : "Fund this Campaign"}
              </button>

              {!wallet && (
                <div className="wallet-notice">
                  Connect your wallet to fund a campaign
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
