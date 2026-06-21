import "./InitiativePanel.scss";
import { useState, useMemo } from "react";

export default function InitiativePanel({ tokens, activeToken }) {
  const [rolls, setRolls] = useState({});

  const [rollingId, setRollingId] = useState(null);
  const [diceFace, setDiceFace] = useState(1);
  const [landedId, setLandedId] = useState(null);

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      return getTotalInit(b) - getTotalInit(a);
    });
  }, [tokens, rolls]);

  function getTotalInit(token) {
    const base = Number(token.stats.Init || 0);
    const roll = rolls[token.id] ?? 0;
    return base + roll;
  }

  function rollInitiative(tokenId) {
    animateRoll(tokenId, (d20) => {
      setRolls((prev) => ({
        ...prev,
        [tokenId]: d20,
      }));
    });
  }

  function animateRoll(tokenId, onFinish) {
    setRollingId(tokenId);
    setLandedId(null);

    let ticks = 0;

    const interval = setInterval(() => {
      const fake = Math.floor(Math.random() * 20) + 1;
      setDiceFace(fake);

      ticks++;

      if (ticks > 12) {
        clearInterval(interval);

        const final = Math.floor(Math.random() * 20) + 1;
        setDiceFace(final);

        setRollingId(null);
        setLandedId(tokenId);

        onFinish(final);

        // Keep visible for 2 seconds
        setTimeout(() => {
          setLandedId(null);
        }, 2000);
      }
    }, 50);
  }

  return (
    <div className="initiative-panel">
      <h1>Init</h1>
      <div className="initiative-panel__list">
        {sortedTokens.map((c) => (
          <div
            key={c.id}
            className={`initiative-panel__card-wrapper initiative-panel__card-wrapper${activeToken?.id == c.id ? "--active" : ""}`}
          >
            <div
              key={c.id}
              className={`initiative-panel__card initiative-panel__card__${c.showInfo} `}
            >
              <img src={c.image} alt={c.name} />

              <div className="initiative-panel__meta">
                <p className="initiative-panel__name">{c.name}</p>

                <div className="initiative-panel__meta__footer">
                  <p className="initiative-panel__init">
                    {getTotalInit(c)} | {c.stats.Init}{" "}
                    {rolls[c.id] !== undefined && <>+ {rolls[c.id]}</>}
                  </p>
                  <button onClick={() => rollInitiative(c.id)}>D20</button>
                </div>
              </div>
            </div>
            {(rollingId === c.id || landedId === c.id) && (
              <div
                className={`dice ${landedId === c.id ? "dice--landed" : ""}`}
              >
                {diceFace}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
