# Three-Player Chess

A full-stack three-player chess game with a Python (Flask) backend and a React frontend.

---

## Project structure

```
chessgame/
├── python_backend/                    # Flask API server
│   ├── app.py                         # Entry-point — defines all REST routes
│   ├── board.py                       # Board logic: movement, check, checkmate, castling
│   ├── game_main.py                   # Click-event orchestration (select piece → move)
│   ├── requirements.txt
│   ├── shared/
│   │   ├── colour.py                  # Colour enum (BLUE / GREEN / RED)
│   │   ├── direction.py               # Direction enum (FORWARD / BACKWARD / LEFT / RIGHT)
│   │   ├── position.py                # 96-position board with neighbour() traversal logic
│   │   ├── game_state.py              # GameState response object
│   │   └── exceptions.py             # InvalidPositionException / InvalidMoveException
│   ├── models/
│   │   ├── base_piece.py              # Abstract BasePiece
│   │   ├── pawn.py
│   │   ├── rook.py
│   │   ├── bishop.py
│   │   ├── knight.py
│   │   ├── queen.py
│   │   ├── king.py                    # Includes castling logic
│   │   └── commander.py              # Custom piece: alternates Knight ↔ Bishop
│   └── utility/
│       ├── board_adapter.py           # Converts internal types ↔ JSON-friendly strings
│       ├── movement_util.py           # step() / step_or_null() with cross-section reversal
│       └── piece_factory.py          # Creates piece instances by type name
│
└── Frontend/                          # React single-page application
    ├── package.json                   # Dependencies & proxy config (→ localhost:8080)
    ├── public/
    │   ├── index.html
    │   └── fonts/                     # DejaVuSans, FreeSerif
    └── src/
        ├── index.js                   # React entry-point
        ├── App.js                     # Router: / (landing) and /game
        ├── pages/
        │   ├── LandingPage/           # Player name entry; calls /newGame on start
        │   └── GamePage/              # Main game UI (board + status panel)
        ├── components/
        │   ├── game/
        │   │   ├── ChessBoard/        # SVG board; renders polygons + pieces
        │   │   │   └── boardConfig.js # All 96 polygon coordinates & IDs
        │   │   ├── Polygon/           # Single clickable board square
        │   │   ├── Piece/             # SVG piece image, centred on its polygon
        │   │   ├── GameStatus/        # Current player indicator
        │   │   ├── CapturedPieces/    # Sidebar showing captured pieces
        │   │   ├── ThemeSelector/     # Font/theme switcher
        │   │   └── GameOverModal/     # Winner announcement overlay
        │   ├── landing/
        │   │   ├── PlayerForm/        # Three-player name form
        │   │   └── PlayerInput/       # Single name input field
        │   └── shared/
        │       ├── Button/
        │       └── Modal/
        ├── context/
        │   ├── GameContext.jsx        # Global state: board, turn, highlights, game-over
        │   ├── PlayerContext.jsx      # Player names (Blue / Green / Red)
        │   └── ThemeContext.jsx       # Active theme
        ├── hooks/
        │   ├── useGameState.js        # Wires polygon clicks → API → context updates
        │   ├── usePlayerManagement.js
        │   └── useTheme.js
        ├── services/
        │   ├── api.js                 # Axios client (relative URLs, 10 s timeout)
        │   └── gameService.js         # newGame / sendClick / getCurrentPlayer / getBoard
        ├── assets/pieces/             # SVG piece images (pawn/rook/…-blue/green/red)
        ├── utils/
        │   ├── boardHelpers.js        # isHighlighted, getPieceAt, hasPiece helpers
        │   ├── constants.js           # PIECE_MAP, COLOR_MAP, THEME_OPTIONS
        │   ├── sounds.js              # Move / capture sound effects
        │   └── validators.js
        └── style/
            ├── colors.css
            ├── fonts.css
            └── themes.css
```

---

## Setup & run

### 1 — Backend (Python / Flask)

```bash
cd python_backend
pip install -r requirements.txt
python app.py
# API now listening on http://localhost:8080
```

### 2 — Frontend (React)

```bash
cd Frontend
npm install
npm start
# Opens http://localhost:3000
# Requests are proxied to the backend at http://localhost:8080
```

Both servers must be running at the same time. The proxy is configured in `Frontend/package.json`:

```json
"proxy": "http://localhost:8080"
```

---

## How it works

1. The **Landing Page** collects three player names (Blue, Green, Red) and calls `GET /newGame`.
2. The **Game Page** loads the board via `GET /board` and current turn via `GET /currentPlayer`.
3. Every click on a polygon calls `POST /onClick` with the polygon label (e.g. `Be2`).
   - **First click on own piece** → backend returns highlighted legal move squares.
   - **Second click on a highlight** → backend executes the move and returns the updated board.
4. React re-renders the SVG board from the returned `board` map and highlights from `highlightedPolygons`.
5. When a king is checkmated the backend sets `isGameOver: true` and `winner`; the frontend shows the **Game Over** modal.

---

## API endpoints

| Method | Path             | Description                                            |
| ------ | ---------------- | ------------------------------------------------------ |
| GET    | `/newGame`       | Initialise a fresh game session                        |
| POST   | `/onClick`       | Send a polygon label (e.g. `Be2`); returns `GameState` |
| GET    | `/currentPlayer` | Returns current turn colour (`"B"`, `"G"`, or `"R"`)   |
| GET    | `/board`         | Returns `{ "Ba1": "BR", … }` board snapshot            |

### GameState response shape

```json
{
  "board": { "Ba1": "BR", "Bb1": "BN", "Be1": "BK", ... },
  "highlightedPolygons": ["Be3", "Be4"],
  "isGameOver": false,
  "winner": null
}
```

### Polygon ID format

Each of the 96 squares is identified by a 3-character label:

```
<colour> <column> <row>
   B/G/R   a–h     1–4
```

Examples: `Ba1` (Blue A-file row 1), `Ge3` (Green E-file row 3), `Rh4` (Red H-file row 4).

### Piece code format

Two characters — colour + type:

| Code | Meaning        |
| ---- | -------------- |
| `BB` | Blue Bishop    |
| `GK` | Green King     |
| `RP` | Red Pawn       |
| `BH` | Blue Commander |
| `GN` | Green Knight   |
| `RQ` | Red Queen      |
| `BR` | Blue Rook      |

---

## Game rules

- Three players take turns: **Blue → Green → Red → Blue → …**
- Standard chess rules apply within each player's section of the board.
- When a piece crosses into another player's section the movement directions reverse to stay consistent with the triangular board geometry.
- **Pawn promotion** — a pawn reaching row 1 of any enemy section is promoted to a Queen.
- **Castling** — standard king-side and queen-side castling are supported.
- **Commander** — a custom piece that alternates between Knight and Bishop movement on successive turns. On its first move it may use either.
- A player is eliminated when their King is checkmated. The last player with a King in play wins.
