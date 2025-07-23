import { memo } from "react";
import { GameMode, GameState } from "../App";

interface GameEndMessageProps {
  gameMode: GameMode;
  gameState: GameState;
  multiplayerData: {
    players: Array<{
      id: string;
      name: string;
      gameState: GameState;
      hasWon: boolean;
    }>;
    gameEnded: boolean;
    winner?: string;
    hostId?: string;
    gameStarted: boolean;
    endReason?: string;
  };
  playerName: string;
  onPlayAgain?: () => void;
}

export const GameEndMessage = memo(function GameEndMessage({
  gameMode,
  gameState,
  multiplayerData,
  playerName,
  onPlayAgain,
}: GameEndMessageProps) {
  const getMultiplayerEndMessage = () => {
    if (multiplayerData.gameEnded) {
      if (
        multiplayerData.winner === null ||
        multiplayerData.endReason === "everyone-lost"
      ) {
        return {
          title: "😞 Nobody Won!",
          subtitle: "Everyone ran out of guesses.",
        };
      } else if (multiplayerData.winner === playerName) {
        return {
          title: "🎉 You Won the Match!",
          subtitle: `You solved it before your opponent!`,
        };
      } else {
        return {
          title: `😞 ${multiplayerData.winner} Won!`,
          subtitle: `They solved it before you did.`,
        };
      }
    }
    return null;
  };

  if (gameState.gameStatus !== "playing" && gameMode === "solo") {
    return (
      <div className="my-6 text-center">
        <div className="text-2xl font-bold mb-2">
          {gameState.gameStatus === "won" ? "🎉 You Won!" : "😞 You Lost!"}
        </div>
        <div className="text-lg mb-4">
          The word was:{" "}
          <span className="font-bold">{gameState.currentWord}</span>
        </div>
        {onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Play Again
          </button>
        )}
      </div>
    );
  }

  if (gameMode === "multiplayer") {
    const endMessage = getMultiplayerEndMessage();

    if (endMessage) {
      return (
        <div className="my-6 text-center">
          <div className="text-2xl font-bold mb-2">{endMessage.title}</div>
          <div className="text-lg mb-4">{endMessage.subtitle}</div>
          <div className="text-sm text-gray-600">
            The word was:{" "}
            <span className="font-bold">{gameState.currentWord}</span>
          </div>
        </div>
      );
    }
  }

  return null;
});
