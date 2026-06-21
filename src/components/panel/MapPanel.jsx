import "./MapPanel.scss";
import { useState, useRef } from "react";

import { Map, ZoomIn, ZoomOut } from "lucide-react";

//Importing map images
const images = import.meta.glob("../../assets/map/*/*.png", {
  eager: true,
});

const groupedMaps = Object.entries(images).reduce((acc, [path, module]) => {
  const parts = path.split("/");

  const type = parts[parts.length - 2]; // dungeon / forest / city
  const file = parts[parts.length - 1];

  if (!acc[type]) acc[type] = [];

  acc[type].push({
    id: file,
    name: file.replace(".png", ""),
    image: module.default,
  });

  return acc;
}, {});

const GRID_SIZE = 50;

export default function MapPanel({
  activeToken,
  setActiveToken,
  tokens,
  setTokens,
  pendingToken,
  onPlaceToken,
  onMapChange,
}) {
  const [activeMapGroup, setActiveMapGroup] = useState(null);
  const [activeMap, setActiveMap] = useState(null);

  //State for map dragging/panning
  const [mapPan, setMapPan] = useState(false);
  const [didDrag, setDidDrag] = useState(false);

  const [start, setStart] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const posRef = useRef(pos);
  const rafRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [movingToken, setMovingToken] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);
  const contentRef = useRef(null);

  //State fo menus
  const [showMenu, setShowMenu] = useState(null);
  const [showHPMenu, setShowHPMenu] = useState(null);
  const [editedHP, setEditedHP] = useState(null);

  const clearMenus = () => {
    setShowMenu(false);
    setShowHPMenu(false);
    setMovingToken(null);
    setHoverCell(null);
    setActiveToken(null);
  };

  const clearAll = () => {
    clearMenus();
    setTokens([]);
  };

  const handleCharacterHP = (newHPValue) => {
    //if 0, character status is dead
    if (newHPValue == 0) {
      handleDead();
    }

    //If >0, character is alive
    else {
      setTokens((prev) =>
        prev.map((char) =>
          char.id === activeToken.id
            ? {
                ...char,
                status: "alive",
                stats: {
                  ...char.stats,
                  currentHP: Number(newHPValue),
                },
              }
            : char,
        ),
      );
    }

    clearMenus();
  };

  const handleMoveChar = () => {
    setMovingToken(true);
    setShowMenu(false);
  };

  const handleDead = () => {
    setTokens((prev) =>
      prev.map((char) =>
        char.id === activeToken.id
          ? {
              ...char,
              status: "dead",
              stats: {
                ...char.stats,
                currentHP: 0,
              },
            }
          : char,
      ),
    );
    clearMenus();
  };

  const handleRemoveChar = () => {
    setTokens((prev) => prev.filter((char) => char.id !== activeToken.id));
    clearMenus();
  };

  const handlePointerMove = (e) => {
    const rect = contentRef.current.getBoundingClientRect();

    const contentX = (e.clientX - rect.left) / zoom;
    const contentY = (e.clientY - rect.top) / zoom;

    // token hover logic
    if (movingToken || pendingToken) {
      const gridX = Math.round(contentX / GRID_SIZE);
      const gridY = Math.round(contentY / GRID_SIZE);

      setHoverCell({ gridX, gridY });
    }

    if (!mapPan) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    //  detect drag threshold
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setDidDrag(true);
    }

    posRef.current = {
      x: start.originX + dx,
      y: start.originY + dy,
    };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setPos({ ...posRef.current });
        rafRef.current = null;
      });
    }
  };

  const handlePointerDown = (e) => {
    if (e.target.closest(".token__menu")) return;
    if (e.target.closest(".token")) return;

    setMapPan(true);
    setDidDrag(false);

    if (showMenu && !movingToken) {
      clearMenus();
    }

    setStart({
      x: e.clientX,
      y: e.clientY,
      originX: posRef.current.x,
      originY: posRef.current.y,
    });
  };

  const handlePointerUp = (e) => {
    setMapPan(false);
    const rect = contentRef.current.getBoundingClientRect();

    const contentX = (e.clientX - rect.left) / zoom;
    const contentY = (e.clientY - rect.top) / zoom;

    const gridX = Math.round(contentX / GRID_SIZE);
    const gridY = Math.round(contentY / GRID_SIZE);

    // ONLY treat as click if NOT dragging
    if (!didDrag) {
      if (pendingToken) {
        onPlaceToken(gridX, gridY);
        setHoverCell(null);
      }
    }
    setDidDrag(false);

    if (movingToken) {
      setTokens((prev) =>
        prev.map((token) =>
          token.id === activeToken?.id
            ? {
                ...token,
                gridX: hoverCell.gridX,
                gridY: hoverCell.gridY,
              }
            : token,
        ),
      );

      setMovingToken(false);
      setShowMenu(false);
      setHoverCell(null);
      setActiveToken(null);
    }
  };

  return (
    <div className="map-panel">
      <div className="map-panel__tabs">
        {Object.keys(groupedMaps).map((group) => (
          <button key={group} onClick={() => setActiveMapGroup(group)}>
            {group}
          </button>
        ))}
      </div>

      <div className="map-panel__list">
        {groupedMaps[activeMapGroup]?.map((map) => (
          <div
            key={map.id}
            className="map-panel__list__card"
            onClick={() => {
              setActiveMap(map);
              if (onMapChange) onMapChange(map);
            }}
          >
            <img src={map.image} alt={map.name} />
            <p>{map.name}</p>
          </div>
        ))}
      </div>

      <div
        className="map-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          ref={contentRef}
          className="map-viewport__content"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
          }}
        >
          {hoverCell && (
            <div
              className="grid-highlight"
              style={{
                left: hoverCell.gridX * GRID_SIZE,
                top: hoverCell.gridY * GRID_SIZE,
                width: GRID_SIZE,
                height: GRID_SIZE,
              }}
            />
          )}
          {pendingToken && hoverCell && (
            <div
              className="token preview"
              style={{
                left: hoverCell.gridX * GRID_SIZE,
                top: hoverCell.gridY * GRID_SIZE,
              }}
            >
              <img src={pendingToken.image} alt={pendingToken.name} />
            </div>
          )}
          {activeMap && (
            <img
              src={activeMap.image}
              className="map-viewport__image"
              draggable={false}
            />
          )}
          {activeMap && <div className="map-viewport__grid-overlay" />}
          {tokens.map((token) => (
            <div
              key={token.id}
              data-id={token.id}
              className={`token token-${token.status}`}
              style={{
                left: token.gridX * GRID_SIZE,
                top: token.gridY * GRID_SIZE,
              }}
            >
              <img
                src={token.image}
                alt={token.name}
                onClick={() => {
                  setActiveToken(token);
                  setShowMenu(true);
                }}
              />
              {showMenu && activeToken?.id == token.id && (
                <div className="token__menu">
                  <button onClick={() => setShowHPMenu(true)}>HP</button>
                  <button onClick={() => handleMoveChar()}>Move</button>
                  <button onClick={() => handleDead()}>Dead</button>
                  <button onClick={() => handleRemoveChar()}>Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {showHPMenu && (
        <div className="token__hp-menu">
          <h3>{activeToken?.name}'s HP</h3>
          <p>Current HP: {activeToken?.stats?.currentHP}</p>
          <input
            type="number"
            value={editedHP}
            onChange={(e) => setEditedHP(e.target.value)}
          />
          <div className="hp-modal__buttons">
            <button onClick={() => handleCharacterHP(editedHP)}>Set</button>
            <button onClick={() => clearMenus()}>Cancel</button>
          </div>
        </div>
      )}
      <div className="map-panel__footer">
        <p>{activeMap ? activeMap?.name : <Map size={20} />}</p>
        <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}>
          <ZoomIn size={20} />
        </button>

        <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}>
          <ZoomOut size={20} />
        </button>
        <button onClick={() => clearAll()}>CLEAR</button>
      </div>
    </div>
  );
}
