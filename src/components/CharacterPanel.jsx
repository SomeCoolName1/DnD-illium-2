import "./CharacterPanel.scss";
import { useState, useMemo } from "react";
import { countTokens } from "../utils/tokenUtils";

//Importing character images
const images = import.meta.glob(
  "../assets/characters/*/*/*.{png,jpg,jpeg,gif,webp,svg}",
  {
    eager: true,
  },
);

const jsonModules = import.meta.glob("../assets/characters/*/*/*.json", {
  eager: true,
});

const grouped = {};

function getWeapons(data) {
  const weapons = [];

  for (let i = 1; ; i++) {
    const weapon = data[`Weapon${i}`];
    if (!weapon) break;

    weapons.push({
      name: weapon,
      damage: data[`Weapon${i}Damage`],
      crit: data[`Weapon${i}Crit`],
      ab: data[`Weapon${i}AB`],
    });
  }

  return weapons;
}

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
    weapons: getWeapons(data),
    status: "alive",
    tokenSize: data.TokenSize ?? { width: 1, height: 1 },
  });
});

export default function CharacterPanel({
  onAddToken,
  pendingToken,
  tokens = [],
}) {
  const [activeGroup, setActiveGroup] = useState("main");

  const tabButtons = useMemo(
    () => [
      { key: "main", label: "Main" },
      { key: "npc", label: "NPC" },
      { key: "enemy", label: "Enemy" },
      { key: "factions", label: "Factions" },
    ],
    [],
  );

  return (
    <div className="character-panel">
      <h1 className="character-panel__title">
        {activeGroup
          ? activeGroup.charAt(0).toUpperCase() + activeGroup.slice(1)
          : "Characters"}
      </h1>
      <div className="character-panel__tabs">
        {tabButtons.map((tab) => (
          <button
            key={tab.key}
            className={`character-button__${tab.key} character-button`}
            onClick={() => setActiveGroup(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="character-panel__content">
        {grouped[activeGroup]?.map((c) => {
          const disabled = countTokens(tokens, c.id) >= (c.maxTokens ?? Infinity);

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
            </div>
          );
        })}
      </div>
    </div>
  );
}
