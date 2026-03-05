interface Props {
  title: string;
  description: string;
  goal: string;
}

export default function CampaignCard({ title, description, goal }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 20,
        marginBottom: 10,
      }}
    >
      <h3>{title}</h3>

      <p>{description}</p>

      <p>Goal: {goal} ETH</p>

      <button>Fund Campaign</button>
    </div>
  );
}
