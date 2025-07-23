import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import words from "an-array-of-english-words";

const VALID_FIVE_LETTER_WORDS = new Set(
  words.filter((word) => word.length === 5).map((word) => word.toUpperCase())
);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSessionId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function isValidWord(word: string): boolean {
  return (
    word.length === 5 &&
    /^[a-zA-Z]+$/.test(word) &&
    VALID_FIVE_LETTER_WORDS.has(word.toUpperCase())
  );
}

export function checkGuess(
  guess: string,
  targetWord: string
): Array<"correct" | "present" | "absent"> {
  const result: Array<"correct" | "present" | "absent"> = [];
  const target = targetWord.toLowerCase();
  const guessLower = guess.toLowerCase();

  const targetLetterCount: { [key: string]: number } = {};
  for (const letter of target) {
    targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
  }

  for (let i = 0; i < 5; i++) {
    if (guessLower[i] === target[i]) {
      result[i] = "correct";
      targetLetterCount[guessLower[i]]--;
    } else {
      result[i] = "absent";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === "absent" && targetLetterCount[guessLower[i]] > 0) {
      result[i] = "present";
      targetLetterCount[guessLower[i]]--;
    }
  }

  return result;
}
