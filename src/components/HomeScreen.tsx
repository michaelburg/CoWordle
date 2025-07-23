import { useState, useCallback, memo } from "react";
import { generateSessionId } from "@/lib/utils";
import { GameGrid } from "./GameBoard.tsx";
import { Keyboard } from "./Keyboard.tsx";
import { PlayerForm } from "./PlayerForm.tsx";

interface HomeScreenProps {
  onStartSolo: (name: string) => void;
  onStartMultiplayer?: (name: string, sessionId: string) => void;
  onJoinSession?: (name: string) => void;
  sessionId?: string | null;
}

// Memoized decorative components that don't need to re-render when playerName changes
const DecorativeGameGrid = memo(function DecorativeGameGrid() {
  return (
    <div className="mb-8 flex justify-center">
      <GameGrid />
    </div>
  );
});

const DecorativeKeyboard = memo(function DecorativeKeyboard() {
  return (
    <div className="mt-8">
      <Keyboard onKeyPress={() => {}} keyboardState={{}} disabled={true} />
    </div>
  );
});

export function HomeScreen({
  onStartSolo,
  onStartMultiplayer,
  onJoinSession,
  sessionId,
}: HomeScreenProps) {
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );

  const handleStartSolo = useCallback(() => {
    if (!playerName.trim()) return;
    localStorage.setItem("playerName", playerName.trim());
    onStartSolo(playerName.trim());
  }, [playerName, onStartSolo]);

  const handleInviteFriend = useCallback(() => {
    if (!playerName.trim()) return;
    localStorage.setItem("playerName", playerName.trim());

    const newSessionId = generateSessionId();
    const inviteLink = `${window.location.origin}?session=${newSessionId}`;

    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard! You'll now join as the host.");

    if (onStartMultiplayer) {
      onStartMultiplayer(playerName.trim(), newSessionId);
    }
  }, [playerName, onStartMultiplayer]);

  const handleJoinSession = useCallback(() => {
    if (!playerName.trim()) return;
    localStorage.setItem("playerName", playerName.trim());

    if (onJoinSession) {
      onJoinSession(playerName.trim());
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
          {sessionId && (
            <p className="text-sm text-gray-500 mt-2">
              Session: {sessionId.slice(0, 8)}...
            </p>
          )}
        </div>

        <DecorativeGameGrid />

        <PlayerForm
          playerName={playerName}
          onPlayerNameChange={setPlayerName}
          onStartSolo={handleStartSolo}
          onInviteFriend={handleInviteFriend}
          onJoinSession={handleJoinSession}
          sessionId={sessionId}
        />

        <DecorativeKeyboard />
      </div>
    </div>
  );
}
