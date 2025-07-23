import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface PlayerFormProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onStartSolo: () => void;
  onInviteFriend: () => void;
  onJoinSession?: () => void;
  sessionId?: string | null;
}

export function PlayerForm({
  playerName,
  onPlayerNameChange,
  onStartSolo,
  onInviteFriend,
  onJoinSession,
  sessionId,
}: PlayerFormProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (sessionId && onJoinSession) {
        onJoinSession();
      } else {
        onStartSolo();
      }
    }
  };

  return (
    <>
      <div className="mb-6">
        <Input
          type="text"
          placeholder={sessionId ? "Enter your name to join" : "Your name"}
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full text-center text-lg"
          maxLength={20}
          autoFocus={!!sessionId}
        />
      </div>

      <div className="space-y-3">
        {sessionId && onJoinSession ? (
          <Button
            onClick={onJoinSession}
            disabled={!playerName.trim()}
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
          >
            Join Game
          </Button>
        ) : (
          <>
            <Button
              onClick={onStartSolo}
              disabled={!playerName.trim()}
              className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
            >
              Start a new game
            </Button>

            <Button
              onClick={onInviteFriend}
              disabled={!playerName.trim()}
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
            >
              Invite a friend
            </Button>
          </>
        )}
      </div>
    </>
  );
}
