import "./InitiativePanel.scss";

export default function InitiativePanel({ tokens }) {
  const sortedTokens = [...tokens].sort(
    (a, b) => Number(b.stats.Init) - Number(a.stats.Init),
  );

  console.log(sortedTokens);

  return (
    <div className="initiative-panel">
      <h1>Init</h1>
      <div className="initiative-panel__list">
        {sortedTokens.map((c) => (
          <div key={c.id} className="initiative-panel__card">
            <img src={c.image} alt={c.name} />
            <div className="initiative-panel__meta">
              <p className="initiative-panel__init">{c.stats.Init}</p>
              <p className="initiative-panel__name">{c.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
