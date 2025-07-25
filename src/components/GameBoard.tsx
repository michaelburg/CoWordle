import { memo } from "react";
import { GameState, GameMode } from "../App";
import { checkGuess } from "@/lib/utils";

interface GameBoardProps {
  gameState: GameState;
  gameMode: GameMode;
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
  };
}

interface TileProps {
  letter: string;
  status: "correct" | "present" | "absent" | "empty" | "current";
  animate?: boolean;
}

const Tile = memo(function Tile({
  letter,
  status,
  animate = false,
}: TileProps) {
  const getStatusClasses = () => {
    switch (status) {
      case "correct":
        return "bg-green-500 border-green-500 text-white";
      case "present":
        return "bg-yellow-500 border-yellow-500 text-white";
      case "absent":
        return "bg-gray-500 border-gray-500 text-white";
      case "current":
        return "border-gray-400 bg-white border-2";
      default:
        return "border-gray-300 bg-white";
    }
  };

  return (
    <div
      className={`
        w-10 sm:w-12 md:w-16 aspect-square border-2 rounded-sm flex items-center justify-center
        text-xl font-bold uppercase transition-all duration-300
        ${getStatusClasses()}
        ${animate ? "animate-flip" : ""}
      `}
    >
      {letter}
    </div>
  );
});

export const GameGrid = memo(function GameGrid({
  gameState,
  isOpponent = false,
}: {
  gameState?: GameState;
  isOpponent?: boolean;
}) {
  if (!gameState) {
    const displayRows = Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => ({
        letter: "",
        status: "empty" as const,
      }))
    );

    return (
      <div className="grid grid-rows-6 gap-2">
        {displayRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {row.map((tile, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                letter={tile.letter}
                status={tile.status}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const rows = Array.from({ length: gameState.maxGuesses }, (_, rowIndex) => {
    if (rowIndex < gameState.guesses.length) {
      const guess = gameState.guesses[rowIndex];
      const result = checkGuess(guess, gameState.currentWord);

      return Array.from({ length: 5 }, (_, colIndex) => ({
        letter: guess[colIndex],
        status: result[colIndex] as "correct" | "present" | "absent",
      }));
    } else if (
      rowIndex === gameState.guesses.length &&
      gameState.currentGuess &&
      !isOpponent
    ) {
      return Array.from({ length: 5 }, (_, colIndex) => ({
        letter: gameState.currentGuess[colIndex] || "",
        status:
          colIndex < gameState.currentGuess.length
            ? ("current" as const)
            : ("empty" as const),
      }));
    } else {
      return Array.from({ length: 5 }, () => ({
        letter: "",
        status: "empty" as const,
      }));
    }
  });

  return (
    <div className="grid grid-rows-6 gap-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2">
          {row.map((tile, colIndex) => (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              letter={tile.letter}
              status={tile.status}
              animate={
                rowIndex === gameState.guesses.length - 1 &&
                gameState.guesses.length > 0
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
});

export const GameBoard = memo(function GameBoard({
  gameState,
  gameMode,
  multiplayerData,
}: GameBoardProps) {
  if (gameMode === "solo") {
    return (
      <div>
        <GameGrid gameState={gameState} />
      </div>
    );
  }

  const currentPlayerName = multiplayerData.players.find(
    (p) => p.gameState.currentWord === gameState.currentWord
  )?.name;

  const opponent = multiplayerData.players.find(
    (p) => p.name !== currentPlayerName
  );

  return (
    <div>
      <div className="text-center">
        <GameGrid gameState={gameState} />
        {gameState.gameStatus === "won" && (
          <div className="mt-2 text-green-600 font-bold">Winner!</div>
        )}
        {gameState.gameStatus === "lost" && !multiplayerData.gameEnded && (
          <div className="mt-2 text-red-600 font-bold">You Lost</div>
        )}
      </div>

      {opponent && (
        <div className="text-center">
          {opponent.hasWon && (
            <div className="mt-2 text-green-600 font-bold">Winner!</div>
          )}
          {opponent.gameState.gameStatus === "lost" &&
            !multiplayerData.gameEnded && (
              <div className="mt-2 text-red-600 font-bold">Lost</div>
            )}
        </div>
      )}
    </div>
  );
});
