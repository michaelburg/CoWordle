interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardState: { [key: string]: "correct" | "present" | "absent" | null };
  disabled?: boolean;
}

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

function KeyboardKey({
  char,
  status,
  onClick,
  disabled = false,
}: {
  char: string;
  status: "correct" | "present" | "absent" | null;
  onClick: () => void;
  disabled?: boolean;
}) {
  const getKeyClasses = () => {
    let baseClasses =
      "keyboard-key flex items-center justify-center rounded font-bold cursor-pointer select-none";

    if (disabled) {
      baseClasses += " opacity-50 cursor-not-allowed";
    } else {
      baseClasses += " hover:bg-gray-300";
    }

    if (char === "ENTER" || char === "BACKSPACE") {
      baseClasses += " px-3 py-4 text-xs h-12";
    } else {
      baseClasses += " w-10 h-12 text-sm";
    }

    switch (status) {
      case "correct":
        return baseClasses + " bg-green-500 text-white border-green-500";
      case "present":
        return baseClasses + " bg-yellow-500 text-white border-yellow-500";
      case "absent":
        return baseClasses + " bg-gray-500 text-white border-gray-500";
      default:
        return baseClasses + " bg-gray-200 text-gray-800 border-gray-300";
    }
  };

  const getDisplayChar = () => {
    if (char === "BACKSPACE") return "⌫";
    if (char === "ENTER") return "ENTER";
    return char;
  };

  return (
    <button
      className={getKeyClasses()}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {getDisplayChar()}
    </button>
  );
}

export function Keyboard({
  onKeyPress,
  keyboardState,
  disabled = false,
}: KeyboardProps) {
  return (
    <div className="w-full max-w-lg mx-auto px-2">
      <div className="space-y-2">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <KeyboardKey
                key={key}
                char={key}
                status={keyboardState[key] || null}
                onClick={() => onKeyPress(key)}
                disabled={disabled}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
