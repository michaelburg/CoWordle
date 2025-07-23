import { memo, useCallback } from "react";

interface KeyboardKeyProps {
  char: string;
  status: "correct" | "present" | "absent" | null;
  onClick: (char: string) => void;
  disabled?: boolean;
}

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardState: {
    [key: string]: "correct" | "present" | "absent" | null;
  };
  disabled?: boolean;
}

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const KeyboardKey = memo(function KeyboardKey({
  char,
  status,
  onClick,
  disabled = false,
}: KeyboardKeyProps) {
  const getStatusClasses = () => {
    switch (status) {
      case "correct":
        return "bg-green-500 border-green-500 text-white";
      case "present":
        return "bg-yellow-500 border-yellow-500 text-white";
      case "absent":
        return "bg-gray-500 border-gray-500 text-white";
      default:
        return "bg-gray-200 border-gray-300 text-gray-900 hover:bg-gray-300";
    }
  };

  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick(char);
    }
  }, [char, onClick, disabled]);

  const getKeyContent = () => {
    if (char === "BACKSPACE") {
      return "⌫";
    }
    return char;
  };

  const getKeyWidth = () => {
    if (char === "ENTER" || char === "BACKSPACE") {
      return "px-4 min-w-[60px]";
    }
    return "w-8";
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${getKeyWidth()} h-12 rounded border font-semibold text-sm transition-colors
        ${getStatusClasses()}
        ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
      `}
    >
      {getKeyContent()}
    </button>
  );
});

export const Keyboard = memo(function Keyboard({
  onKeyPress,
  keyboardState,
  disabled = false,
}: KeyboardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      <div className="space-y-3">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {row.map((key) => (
              <KeyboardKey
                key={key}
                char={key}
                status={keyboardState[key] || null}
                onClick={onKeyPress}
                disabled={disabled}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
