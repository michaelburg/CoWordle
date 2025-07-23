import { useState, useEffect, useCallback } from "react";
import { GameScreen } from "./components/GameScreen.tsx";
import { HomeScreen } from "./components/HomeScreen.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { io, Socket } from "socket.io-client";

export type GameMode = "solo" | "multiplayer";

export interface GameState {
  currentWord: string;
  guesses: string[];
  currentGuess: string;
  gameStatus: "playing" | "won" | "lost";
  maxGuesses: number;
}

export interface MultiplayerGameState extends GameState {
  sessionId: string;
  players: Array<{
    id: string;
    name: string;
    gameState: GameState;
    hasWon: boolean;
  }>;
  gameEnded: boolean;
  winner?: string;
}

function App() {
  const [screen, setScreen] = useState<"home" | "game">("home");
  const [gameMode, setGameMode] = useState<GameMode>("solo");
  const [playerName, setPlayerName] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSessionId = urlParams.get("session");

    if (urlSessionId) {
      setSessionId(urlSessionId);
      setGameMode("multiplayer");
      setScreen("home");
    }
  }, []);

  useEffect(() => {
    if (gameMode === "multiplayer") {
      const socketUrl = import.meta.env.VITE_SOCKET_URL;
      const newSocket = io(socketUrl, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [gameMode]);

  const startSoloGame = useCallback((name: string) => {
    setPlayerName(name);
    setGameMode("solo");
    setScreen("game");
  }, []);

  const startMultiplayerGame = useCallback(
    (name: string, newSessionId: string) => {
      setPlayerName(name);
      setSessionId(newSessionId);
      setGameMode("multiplayer");
      setScreen("game");

      window.history.pushState({}, "", `?session=${newSessionId}`);
    },
    []
  );

  const joinGameWithName = useCallback((name: string) => {
    setPlayerName(name);
    setScreen("game");
  }, []);

  const backToHome = useCallback(() => {
    setScreen("home");
    setGameMode("solo");
    setPlayerName("");
    setSessionId(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    window.history.replaceState({}, "", window.location.pathname);
  }, [socket]);

  return (
    <div className="min-h-screen bg-background">
      {screen === "home" ? (
        <HomeScreen
          onStartSolo={startSoloGame}
          onStartMultiplayer={startMultiplayerGame}
          onJoinSession={joinGameWithName}
          sessionId={sessionId}
        />
      ) : (
        <GameScreen
          gameMode={gameMode}
          playerName={playerName}
          socket={socket}
          sessionId={sessionId}
          onBackToHome={backToHome}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;
