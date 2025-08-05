const praiseMessages: string[] = [
  "Nice",
  "You're good at this!",
  "Well done!",
  "Impressive!",
  "Great job!",
  "Keep it up!",
  "Awesome!",
  "You nailed it!",
  "Fantastic!",
  "You're on fire!",
  "Brilliant!",
  "Excellent work!",
];

export function getRandomPraise(): string {
  return praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
}