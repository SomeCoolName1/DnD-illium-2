# DnD - Illium

---

## Adding Custom Content

### Characters

Store character files in:

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

Supported image formats:

- png
- jpg
- jpeg
- gif
- webp
- svg

Example JSON file which should minimally include:

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

### Character JSON Fields

| Field     | Type   | Required | Description                                 |
| --------- | ------ | -------- | ------------------------------------------- |
| Name      | String | Yes      | Character name displayed in the application |
| Init      | Number | Yes      | Initiative modifier                         |
| TokenSize | Object | No       | Token dimensions on the grid                |

If `TokenSize` is omitted, the token defaults to **1×1**.

---

### Maps

Store maps in:

```text
src/assets/map
```

Each folder creates a separate map tab within the application.

Example:

```text
map/
└── dungeon/
    ├── dungeon-1.png
    └── dungeon-2.png
```

Supported image formats:

- png
- jpg
- jpeg
- gif
- webp
- svg

---

## Before Your First Run

Make sure you have Node.js and npm installed.

Open a terminal and run:

```bash
node -v
npm -v
```

If both commands return version numbers, you're ready to continue.

---

## Running the Application

### 1. Download the project

Either:

- Clone the repository

```bash
git clone <repository-url>
```

or

- Download the ZIP file and extract it.

### 2. Open a terminal in the project folder

```bash
cd path/to/project
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application should now be available in your browser.

---

## Notes

- There is currently **no save system**.
  - Refreshing the browser will reset all placed tokens.
- Grid size can be adjusted in the application.
  - Default grid size is **50px × 50px**.

---

## Planned Features

- Prevent tokens from being placed on top of each other
- Obstacle / blocking tokens

---

## The can't be fks

- Combat / attack logic
- Grid coordinate naming

---

## Completed Features

- Token highlighting linked to initiative order
- Death state and HP modification logic
- Adjustable grid size
- Support for PNG, JPG, JPEG, GIF, WEBP and SVG assets
- Variable-sized tokens
- Weapon display for player characters:
  - Weapon Name
  - Total Attack Bonus
  - Damage
  - Critical Range/Multiplier
