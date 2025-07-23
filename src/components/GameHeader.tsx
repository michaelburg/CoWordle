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
  isHost = false,
  onStartGame,
  gameCanStart = false,
}: GameHeaderProps) {
  const { toast } = useToast();

  const copySessionLink = useCallback(() => {
    if (sessionId) {
      const link = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "Session link copied to clipboard!",
      });
    }
  }, [sessionId, toast]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ExitConfirmationDialog onConfirmExit={onBackToHome} />
          <div>
            <h1 className="text-xl font-bold text-gray-900">CoWordle</h1>
            <p className="text-sm text-gray-600">
              {gameMode === "solo" ? "Solo Game" : "Multiplayer Game"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {gameMode === "multiplayer" && isHost && gameCanStart && (
            <Button
              onClick={onStartGame}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start Game
            </Button>
          )}

          {gameMode === "multiplayer" && sessionId && (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                Players: {multiplayerData.players.length}/2
                {isHost && (
                  <span className="ml-1 text-xs text-blue-600">(Host)</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copySessionLink}
                className="text-xs"
              >
                Copy Link
              </Button>
            </div>
          )}

          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {playerName}
            </div>
            {gameMode === "multiplayer" && sessionId && (
              <div className="text-xs text-gray-500">
                ID: {sessionId.slice(0, 8)}...
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});
