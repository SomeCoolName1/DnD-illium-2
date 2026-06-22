import { useState } from "react";
import "./App.scss";
import CharacterPanel from "./components/CharacterPanel";
import MapPanel from "./components/MapPanel";
import InitiativePanel from "./components/InitiativePanel";
import InfoPanel from "./components/InfoPanel";

function App() {
  const [tokens, setTokens] = useState([]);
  const [pendingToken, setPendingToken] = useState(null);
  const [activeToken, setActiveToken] = useState(null);

  // Select a character to place on the map; waiting for user to click a grid cell
  const selectCharacterForPlacement = (character) => {
    const existing = tokens.filter(
      (t) =>
        t.name.toLowerCase() === (character.id || character.name.toLowerCase()),
    ).length;

    const max = character.maxTokens ?? Infinity;
    if (existing >= max) {
      return;
    }
    setPendingToken(character);
  };

  // Place the pending token at a grid cell (called from MapPanel)
  const placePendingToken = (gridX, gridY) => {
    if (!pendingToken) return;
    // enforce max again before placing
    const existing = tokens.filter(
      (t) =>
        t.name.toLowerCase() ===
        (pendingToken.id || pendingToken.name.toLowerCase()),
    ).length;

    const max = pendingToken.maxTokens ?? Infinity;
    if (existing >= max) {
      console.warn(`Cannot place ${pendingToken.name}: max tokens reached`);
      setPendingToken(null);
      return;
    }

    setTokens((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: pendingToken.name,
        image: pendingToken.image,
        gridX,
        gridY,
        stats: {
          HP: pendingToken.stats.HP,
          AC: pendingToken.stats.AC,
          Init: pendingToken.stats.Init,
          currentHP: pendingToken.stats.HP,
        },
        showInfo: pendingToken.showInfo,
        weapons: pendingToken.weapons,
        status: "alive",
        tokenSize: pendingToken.tokenSize ?? { width: 1, height: 1 },
      },
    ]);
    setPendingToken(null);
  };

  const handleMapChange = () => {
    // Reset tokens when world/map changes
    setTokens([]);
    setPendingToken(null);
  };

  return (
    <div className="main-container">
      <div className="initiative-panel-container">
        <InitiativePanel tokens={tokens} activeToken={activeToken} />
      </div>
      <div className="center-panel-container">
        <MapPanel
          tokens={tokens}
          activeToken={activeToken}
          setActiveToken={setActiveToken}
          setTokens={setTokens}
          pendingToken={pendingToken}
          onPlaceToken={placePendingToken}
          onMapChange={handleMapChange}
          setPendingToken={setPendingToken}
        />
        <InfoPanel tokens={tokens} />
      </div>
      <div className="character-panel-container">
        <CharacterPanel
          onAddToken={selectCharacterForPlacement}
          pendingToken={pendingToken}
          tokens={tokens}
        />
      </div>
    </div>
  );
}

export default App;
