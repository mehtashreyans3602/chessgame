"""
Python backend for 3-Player Chess
Replaces the Java Spring Boot application.

Endpoints (identical contract to the original Java API):
  GET  /newGame        → start a fresh game session
  POST /onClick        → send a polygon-label click; returns GameState JSON
  GET  /currentPlayer  → returns current player colour as a string ("B"/"G"/"R")
  GET  /board          → returns the board as {position_label: piece_label}
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

from game_main import GameMain

app = Flask(__name__)
CORS(app)  # Allow the React frontend (different port) to call this API

# One game instance per server process (mirrors the Java controller behaviour)
game: GameMain | None = None


@app.get("/newGame")
def start_new_game():
    global game
    print("Starting a new game...")
    game = GameMain()
    return "", 200


@app.post("/onClick")
def process_click():
    global game
    if game is None:
        return jsonify({"error": "No game in progress. Call /newGame first."}), 400

    polygon_text: str = request.get_data(as_text=True).strip().strip('"')
    print(f"Received click on polygon: {polygon_text}")

    game_state = game.on_click(polygon_text)
    return jsonify(game_state.to_dict())


@app.get("/currentPlayer")
def get_current_player():
    global game
    if game is None:
        return jsonify({"error": "No game in progress."}), 400
    print("Fetching current player...")
    return str(game.get_turn()), 200


@app.get("/board")
def get_board_state():
    global game
    if game is None:
        return jsonify({"error": "No game in progress."}), 400
    return jsonify(game.get_board())


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
