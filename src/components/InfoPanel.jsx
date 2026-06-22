import "./InfoPanel.scss";
import { useState, useMemo } from "react";

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

  const mainTokens = useMemo(() => tokens.filter((t) => t.showInfo === "main"), [tokens]);

  // Automatically clear viewToken if it's no longer in the list
  const validViewToken = useMemo(() => {
    if (!viewToken || !mainTokens.some((t) => t.id === viewToken.id)) {
      return null;
    }
    return viewToken;
  }, [viewToken, mainTokens]);

  return (
    <div className="info-panel">
      <div className="info-panel__party-container">
        {mainTokens?.map((c) => (
          <div key={c.id} className="info-card">
            <button
              className={`info-card__name ${validViewToken?.id === c.id ? "info-card__name-active" : ""}`}
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
        {validViewToken && (
          <>
            <img src={validViewToken.image} alt={validViewToken.name} />
            <div className="info-panel__wrapper">
              <div className="info-panel__meta-container">
                <p>AC: {validViewToken?.stats?.AC}</p>
                <p>Init: {validViewToken?.stats?.Init}</p>
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
                    {validViewToken?.weapons?.map((w, i) => (
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
