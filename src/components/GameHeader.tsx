import { memo, useCallback } from "react";
import { Button } from "./ui/button.tsx";
import { ExitConfirmationDialog } from "./ExitConfirmationDialog.tsx";
import { GameMode } from "../App";
import { useToast } from "@/hooks/use-toast";

interface GameHeaderProps {
  gameMode: GameMode;
  playerName: string;
  sessionId: string | null;
  multiplayerData: {
    players: Array<{
      id: string;
      name: string;
      gameState: any;
      hasWon: boolean;
    }>;
    gameEnded: boolean;
    winner?: string;
    hostId?: string;
    gameStarted: boolean;
  };
  onBackToHome: () => void;
  isHost?: boolean;
  onStartGame?: () => void;
  gameCanStart?: boolean;
}

export const GameHeader = memo(function GameHeader({
  gameMode,
  playerName,
  sessionId,
  multiplayerData,
  onBackToHome,
}: GameHeaderProps) {
  const { toast } = useToast();

  const copySessionLink = useCallback(() => {
    if (sessionId) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Session link copied to clipboard!",
      });
    }
  }, [sessionId, toast]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full grid grid-cols-3 items-center p-1">
        {/* Left section */}
        <div className="flex flex-col w-auto max-w-max">
          <ExitConfirmationDialog onConfirmExit={onBackToHome} />
          {gameMode === "multiplayer" && (
            <Button
              variant="outline"
              size="sm"
              onClick={copySessionLink}
              className="text-xs"
            >
              Copy Link
            </Button>
          )}
        </div>

        {/* Center section */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900">CoWordle</h1>
          <p className="text-sm text-gray-600">
            {gameMode === "solo" ? "Solo Game" : "Multiplayer Game"}
          </p>
        </div>

        {/* Right section */}
        {gameMode === "multiplayer" && sessionId && (
          <div className="flex flex-col min-w-[160px]">
            <div className="text-sm font-medium text-gray-900 mb-1">
              Players:{" "}
              <span className="font-bold">
                {multiplayerData.players.length}
              </span>
            </div>
            <ul className="space-y-1">
              {multiplayerData.players.map((p) => (
                <li
                  key={p.id}
                  className={
                    "text-sm flex items-center " +
                    (p.name === playerName
                      ? "text-blue-600 font-semibold"
                      : "text-gray-800")
                  }
                >
                  <span>{p.name}</span>
                  {p.id === multiplayerData.hostId && (
                    <span className="ml-1 text-xs text-gray-500 font-normal">
                      (host)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {gameMode === "solo" && (
          <div className="flex flex-col min-w-[120px]">
            <div className="text-sm font-medium text-gray-900 mb-1">
              Player:
            </div>
            <span className="text-sm text-blue-600 font-semibold">
              {playerName}
            </span>
          </div>
        )}
      </div>
    </header>
  );
});
