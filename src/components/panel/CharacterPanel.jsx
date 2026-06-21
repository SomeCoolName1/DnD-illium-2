import "./CharacterPanel.scss";
import { useState } from "react";

//Importing character images
const images = import.meta.glob("../../assets/characters/*/*/*.png", {
  eager: true,
});

const jsonModules = import.meta.glob("../../assets/characters/*/*/*.json", {
  eager: true,
});

const grouped = {};

Object.entries(images).forEach(([path, module]) => {
  const parts = path.split("/");

  const type = parts[parts.length - 3]; // main / npc / enemy
  const name = parts[parts.length - 2];

  if (!grouped[type]) grouped[type] = [];

  const jsonEntry = Object.entries(jsonModules).find(([p]) =>
    p.includes(`/${name}/`),
  );

  const data = jsonEntry ? jsonEntry[1].default : {};

  grouped[type].push({
    id: name.toLowerCase(),
    name,
    image: module.default,
    maxTokens: type == "main" ? 1 : 100, //Only one main character can be put on the map
    showInfo: type,
    stats: {
      HP: data.HP ?? 0,
      AC: data.AC ?? 0,
      Init: data.Init ?? 0,
      currentHP: data.HP ?? 0,
    },
    status: "alive",
  });
});

export default function CharacterPanel({
  onAddToken,
  pendingToken,
  tokens = [],
}) {
  const [activeGroup, setActiveGroup] = useState("main");

  return (
    <div className="character-panel">
      <h1 className="character-panel__title">
        {activeGroup
          ? activeGroup.charAt(0).toUpperCase() + activeGroup.slice(1)
          : "Characters"}
      </h1>
      <div className="character-panel__tabs">
        <button
          className="character-button__main character-button"
          onClick={() => setActiveGroup("main")}
        >
          Main
        </button>
        <button
          className="character-button__npc character-button"
          onClick={() => setActiveGroup("npc")}
        >
          NPC
        </button>
        <button
          className="character-button__enemy character-button"
          onClick={() => setActiveGroup("enemy")}
        >
          Enemy
        </button>
        <button
          className="character-button__factions character-button"
          onClick={() => setActiveGroup("factions")}
        >
          Factions
        </button>
      </div>
      <div className="character-panel__content">
        {grouped[activeGroup]?.map((c) => {
          const count = tokens.filter(
            (t) => t.name.toLowerCase() === c.id,
          ).length;
          const disabled = count >= (c.maxTokens ?? Infinity);

          return (
            <div
              key={c.id}
              className={`character-panel__card ${pendingToken?.id === c.id ? "selected" : ""} ${
                disabled ? "disabled" : ""
              }`}
              onClick={() => !disabled && onAddToken(c)}
            >
              <img src={c.image} alt={c.name} />
              <p>{c.name}</p>
              {/* <p>{disabled ? `(${count}/${c.maxTokens})` : ""}</p> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
