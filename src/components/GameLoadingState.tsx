import { memo } from "react";
import { GameMode } from "../App";
import { Button } from "./ui/button";

interface GameLoadingStateProps {
  gameMode: GameMode;
  gameStarted: boolean;
  playerCount: number;
  isHost: boolean;
  onStartGame: () => void;
  gameCanStart: boolean;
}

export const GameLoadingState = memo(function GameLoadingState({
  gameMode,
  gameStarted,
  playerCount,
  isHost,
  onStartGame,
  gameCanStart,
}: GameLoadingStateProps) {
  if (gameMode !== "multiplayer" || gameStarted) {
    return null;
  }

  return (
    <div className="my-6 text-center">
      {playerCount < 2 ? (
        <div className="text-lg text-gray-600">
          <div className="animate-pulse">Waiting for opponent...</div>
          <div className="text-sm mt-2">
            Share the session link to invite a friend!
          </div>
        </div>
      ) : isHost ? (
        <div className="text-lg text-gray-600">
          <div>Ready to start!</div>
          <div className="text-sm my-2">
            Click "Start Game" when you're both ready.
          </div>
          {gameMode === "multiplayer" && isHost && gameCanStart && (
            <Button
              onClick={onStartGame}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start Game
            </Button>
          )}
        </div>
      ) : (
        <div className="text-lg text-gray-600">
          <div className="animate-pulse">
            Waiting for host to start the game...
          </div>
        </div>
      )}
    </div>
  );
});
