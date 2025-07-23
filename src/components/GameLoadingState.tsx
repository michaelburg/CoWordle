import { GameMode } from "../App";

interface GameLoadingStateProps {
  gameMode: GameMode;
  gameStarted: boolean;
  playerCount: number;
  isHost: boolean;
}

export function GameLoadingState({
  gameMode,
  gameStarted,
  playerCount,
  isHost,
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
          <div className="text-sm mt-2">
            Click "Start Game" when you're both ready.
          </div>
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
}
