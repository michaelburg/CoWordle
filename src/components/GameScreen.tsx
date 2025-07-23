import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { Socket } from "socket.io-client";
import { GameMode, GameState } from "../App";
import { GameBoard } from "./GameBoard.tsx";
import { Keyboard } from "./Keyboard.tsx";
import { GameHeader } from "./GameHeader.tsx";
import { GameLoadingState } from "./GameLoadingState.tsx";
import { GameEndMessage } from "./GameEndMessage.tsx";
import { checkGuess, isValidWord } from "@/lib/utils";
import words from "an-array-of-english-words";

const FIVE_LETTER_WORDS = words
  .filter((word) => word.length === 5)
  .map((word) => word.toUpperCase());

function getRandomWord(): string {
  return FIVE_LETTER_WORDS[
    Math.floor(Math.random() * FIVE_LETTER_WORDS.length)
  ];
}

interface GameScreenProps {
  gameMode: GameMode;
  playerName: string;
  socket: Socket | null;
  sessionId: string | null;
  onBackToHome: () => void;
}

export const GameScreen = memo(function GameScreen({
  gameMode,
  playerName,
  socket,
  sessionId,
  onBackToHome,
}: GameScreenProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentWord: getRandomWord(),
    guesses: [],
    currentGuess: "",
    gameStatus: "playing",
    maxGuesses: 6,
  });

  const [multiplayerData, setMultiplayerData] = useState<{
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
  }>({
    players: [],
    gameEnded: false,
    gameStarted: false,
  });

  const [keyboardState, setKeyboardState] = useState<{
    [key: string]: "correct" | "present" | "absent" | null;
  }>({});

  const isHost = useMemo(
    () =>
      Boolean(
        gameMode === "multiplayer" &&
          socket &&
          multiplayerData.hostId === socket.id
      ),
    [gameMode, socket, multiplayerData.hostId]
  );

  const gameCanStart = useMemo(
    () =>
      gameMode === "multiplayer" &&
      multiplayerData.players.length === 2 &&
      !multiplayerData.gameStarted,
    [gameMode, multiplayerData.players.length, multiplayerData.gameStarted]
  );

  const gameInProgress = useMemo(
    () => gameMode === "solo" || multiplayerData.gameStarted,
    [gameMode, multiplayerData.gameStarted]
  );

  useEffect(() => {
    if (gameMode === "multiplayer" && socket && sessionId) {
      socket.emit("join-session", { sessionId, playerName, gameState });

      socket.on("session-update", (data) => {
        setMultiplayerData(data);

        const currentPlayer = data.players.find(
          (p: any) => p.name === playerName
        );
        if (
          currentPlayer &&
          currentPlayer.gameState.currentWord !== gameState.currentWord
        ) {
          setGameState((prev) => ({
            ...prev,
            currentWord: currentPlayer.gameState.currentWord,
          }));
        }
      });

      socket.on("game-started", () => {
        console.log("Game started!");
      });

      socket.on("game-ended", (data) => {
        setMultiplayerData((prev) => ({
          ...prev,
          gameEnded: true,
          winner: data.winner,
          endReason: data.reason,
        }));
      });

      return () => {
        socket.off("session-update");
        socket.off("game-started");
        socket.off("game-ended");
      };
    }
  }, [gameMode, socket, sessionId, playerName, gameState.currentWord]);

  const startGame = useCallback(() => {
    if (isHost && socket && sessionId) {
      socket.emit("start-game", { sessionId });
    }
  }, [isHost, socket, sessionId]);

  const updateKeyboardState = useCallback(
    (guess: string, result: Array<"correct" | "present" | "absent">) => {
      setKeyboardState((prevKeyboardState) => {
        const newKeyboardState = { ...prevKeyboardState };

        for (let i = 0; i < guess.length; i++) {
          const letter = guess[i].toUpperCase();
          const letterResult = result[i];

          if (
            !newKeyboardState[letter] ||
            (newKeyboardState[letter] === "absent" &&
              letterResult !== "absent") ||
            (newKeyboardState[letter] === "present" &&
              letterResult === "correct")
          ) {
            newKeyboardState[letter] = letterResult;
          }
        }

        return newKeyboardState;
      });
    },
    []
  );

  const handleKeyPress = useCallback(
    (key: string) => {
      setGameState((currentState) => {
        if (currentState.gameStatus !== "playing" || !gameInProgress)
          return currentState;

        if (key === "ENTER") {
          if (currentState.currentGuess.length === 5) {
            if (isValidWord(currentState.currentGuess)) {
              const result = checkGuess(
                currentState.currentGuess,
                currentState.currentWord
              );
              const newGuesses = [
                ...currentState.guesses,
                currentState.currentGuess,
              ];

              updateKeyboardState(currentState.currentGuess, result);

              let newStatus: "playing" | "won" | "lost" = "playing";
              if (
                currentState.currentGuess.toUpperCase() ===
                currentState.currentWord.toUpperCase()
              ) {
                newStatus = "won";
              } else if (newGuesses.length >= currentState.maxGuesses) {
                newStatus = "lost";
              }

              const newGameState = {
                ...currentState,
                guesses: newGuesses,
                currentGuess: "",
                gameStatus: newStatus,
              };

              if (gameMode === "multiplayer" && socket && sessionId) {
                socket.emit("game-update", {
                  sessionId,
                  playerName,
                  gameState: newGameState,
                  hasWon: newStatus === "won",
                });
              }

              return newGameState;
            }
          }
        } else if (key === "BACKSPACE") {
          return {
            ...currentState,
            currentGuess: currentState.currentGuess.slice(0, -1),
          };
        } else if (key.length === 1 && currentState.currentGuess.length < 5) {
          return {
            ...currentState,
            currentGuess: currentState.currentGuess + key.toUpperCase(),
          };
        }

        return currentState;
      });
    },
    [
      gameMode,
      socket,
      sessionId,
      playerName,
      updateKeyboardState,
      gameInProgress,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();

      if (key === "ENTER") {
        handleKeyPress("ENTER");
      } else if (key === "BACKSPACE") {
        handleKeyPress("BACKSPACE");
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const resetGame = useCallback(() => {
    setGameState({
      currentWord: getRandomWord(),
      guesses: [],
      currentGuess: "",
      gameStatus: "playing",
      maxGuesses: 6,
    });
    setKeyboardState({});
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GameHeader
        gameMode={gameMode}
        playerName={playerName}
        sessionId={sessionId}
        multiplayerData={multiplayerData}
        onBackToHome={onBackToHome}
        isHost={isHost}
        onStartGame={startGame}
        gameCanStart={gameCanStart}
      />

      <div className="flex-1 flex flex-col items-center px-4 pt-2 pb-4 max-w-2xl mx-auto w-full">
        <GameLoadingState
          gameMode={gameMode}
          gameStarted={multiplayerData.gameStarted}
          playerCount={multiplayerData.players.length}
          isHost={isHost}
        />

        {gameInProgress && (
          <div className="my-auto">
            <GameBoard
              gameState={gameState}
              gameMode={gameMode}
              multiplayerData={multiplayerData}
            />
          </div>
        )}

        <GameEndMessage
          gameMode={gameMode}
          gameState={gameState}
          multiplayerData={multiplayerData}
          playerName={playerName}
          onPlayAgain={resetGame}
        />

        {gameInProgress && (
          <div className="mt-auto w-full">
            <Keyboard
              onKeyPress={handleKeyPress}
              keyboardState={keyboardState}
              disabled={
                gameState.gameStatus !== "playing" || multiplayerData.gameEnded
              }
            />
          </div>
        )}
      </div>
    </div>
  );
});
