import "./InfoPanel.scss";
import { useEffect, useState } from "react";

function HPBar({ current, max, children }) {
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
      <div className="hp-bar__text">{children}</div>
    </div>
  );
}

export default function InfoPanel({ tokens }) {
  const [viewToken, setViewToken] = useState(null);

  const mainTokens = tokens.filter((t) => t.showInfo === "main");

  useEffect(() => {
    if (tokens.length === 0) {
      setViewToken(null);
    }
  }, [tokens.length]);

  return (
    <div className="info-panel">
      <div className="info-panel__party-container">
        {mainTokens?.map((c) => (
          <div key={c.id} className="info-card">
            <button
              className={`info-card__name info-card__name-${viewToken.id == c.id ? "active" : ""}`}
              onClick={() => setViewToken(c)}
            >
              {c.name}
            </button>
            <div className="info-card__hp-container">
              <HPBar current={c.stats.currentHP} max={c.stats.HP}>
                {c.stats.currentHP} / {c.stats.HP}
              </HPBar>
            </div>
          </div>
        ))}
      </div>
      <div className="info-panel__info-container">
        {viewToken && (
          <>
            <img src={viewToken.image} alt={viewToken.name} />
            <div className="info-panel__wrapper">
              <div className="info-panel__meta-container">
                <p>AC: {viewToken?.stats?.AC}</p>
                <p>Init: {viewToken?.stats?.Init}</p>
              </div>
              <div className="info-panel__weapon-container">
                <table className="weapon-table">
                  <thead>
                    <tr>
                      <th>Weapon</th>
                      <th>Total Attack Bonus</th>
                      <th>Damage</th>
                      <th>Critical</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewToken?.weapons?.map((w, i) => (
                      <tr key={i}>
                        <td>{w.name}</td>
                        <td>{w.ab ?? "-"}</td>
                        <td>{w.damage}</td>
                        <td>{w.crit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
