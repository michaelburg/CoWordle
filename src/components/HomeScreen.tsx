import { useState, useCallback, memo } from "react";
import { generateSessionId } from "@/lib/utils";
import { GameGrid } from "./GameBoard.tsx";
import { PlayerForm } from "./PlayerForm.tsx";
import { useToast } from "@/hooks/use-toast";

interface HomeScreenProps {
  onStartSolo: (name: string) => void;
  onStartMultiplayer?: (name: string, sessionId: string) => void;
  onJoinSession?: (name: string) => void;
  sessionId?: string | null;
}

export const HomeScreen = memo(function HomeScreen({
  onStartSolo,
  onStartMultiplayer,
  onJoinSession,
  sessionId,
}: HomeScreenProps) {
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );
  const { toast } = useToast();

  const handleStartSolo = useCallback(() => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return;
    localStorage.setItem("playerName", trimmedName);
    onStartSolo(trimmedName);
  }, [playerName, onStartSolo]);

  const handleInviteFriend = useCallback(() => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return;
    localStorage.setItem("playerName", trimmedName);

    const newSessionId = generateSessionId();
    const inviteLink = `${window.location.href}?session=${newSessionId}`;

    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link copied!",
      description:
        "Invite link copied to clipboard. You'll now join as the host.",
    });

    if (onStartMultiplayer) {
      onStartMultiplayer(trimmedName, newSessionId);
    }
  }, [playerName, onStartMultiplayer, toast]);

  const handleJoinSession = useCallback(() => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return;
    localStorage.setItem("playerName", trimmedName);

    if (onJoinSession) {
      onJoinSession(trimmedName);
    }
  }, [playerName, onJoinSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CoWordle</h1>
          <p className="text-gray-600">
            {sessionId ? "Join the game!" : "Multiplayer Wordle Game"}
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <GameGrid />
        </div>

        <PlayerForm
          playerName={playerName}
          onPlayerNameChange={setPlayerName}
          onStartSolo={handleStartSolo}
          onInviteFriend={handleInviteFriend}
          onJoinSession={handleJoinSession}
          sessionId={sessionId}
        />
      </div>
    </div>
  );
});
