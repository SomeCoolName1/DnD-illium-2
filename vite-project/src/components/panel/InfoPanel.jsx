import "./InfoPanel.scss";

function HPBar({ current, max }) {
  const percent = Math.max(0, Math.min(100, (current / max) * 100));

  let state = "high";

  if (percent <= 25) state = "low";
  else if (percent <= 60) state = "mid";

  return (
    <div className="hp-bar">
      <div
        className={`hp-bar__fill ${state}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default function InfoPanel({ tokens }) {
  const mainTokens = tokens.filter((t) => t.showInfo === "main");

  return (
    <div className="info-panel">
      <div className="info-panel__list">
        {mainTokens.map((c) => (
          <div key={c.id} className="info-panel__card">
            <img src={c.image} alt={c.name} />
            <div className="info-panel__meta">
              <p className="info-panel__character-name">{c.name}</p>
              <p>
                HP: {c.stats.currentHP}/{c.stats.HP}
              </p>
              <HPBar current={c.stats.currentHP} max={c.stats.HP} />
              <p>AC: {c.stats.AC}</p>
              <p>Init: {c.stats.Init}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
