# DnD - Illium

Creates a stream-able table for DnD

## Adding your customs

## Characters

Store characters in:

```text
src/assets/characters
```

Each character requires the following folder structure:

```text
characters/
└── main/
    └── CharacterName/
        ├── CharacterName.png
        └── CharacterName.json
```

Supported image formats: png, jpg, jpeg, gif, webp, svg

The JSON file should minimally contain:

```json
{
  "Init": 5,
  "Name": "Hot-Girl",
  "TokenSize": {
    "width": 2,
    "height": 2
  }
}
```

`TokenSize` is optional. If omitted, the token defaults to **1×1**.

---

## Maps

Store maps in:

```text
src/assets/map
```

Each folder creates a separate tab in the application.

Example:

```text
map/
└── dungeon/
    ├── dungeon-1.png
    └── dungeon-2.png
```

Supported image formats: png, jpg, jpeg, gif, webp, svg
In this example, a **Dungeon** tab will automatically appear containing both maps.

## Before you start the first run

Check if you have the following via Console Log

- node -v
- npm -v

## Running it

1. git clone / download
2. cd folder-path
3. npm install (installs dependencies)
4. npm run dev

## Notes

- There is no save state (i.e. Tokens will always reset if the browser is reset)
- You can manipulate the Grid Size. The default size is 50px x 50px

## To Do

- Do not let token place on top of each other
- Blocking/Obstacle tokens

## The can't be fks

- Attack logic
- Grid names

## Completed

- Highlight tokens and respective initative
- Death and all related death/hp-modifications logic
- Adjustable GRID Size
- Allow maps/characters to work with PNG/JPEG/JPG
- Different sized-tokens
- Add in weapons for each main character (Unarmed Strike - Total ATtack Bonus - Damage - Critical)
