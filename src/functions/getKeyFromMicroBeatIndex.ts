export function getKeyFromMicroBeatIndex(beatIndex: number) {
  // Calculate the section based on the full cycle of 8 beats (0-7) repeating
  const section = Math.floor(beatIndex / 8);

  // Calculate beat number within the current cycle of 8 1/8 beats
  const positionInBar = beatIndex % 8;

  // Determine the quarter beat (1, 2, 3, 4)
  const quarterBeat = Math.floor(positionInBar / 2) + 1;

  // Check if it is an offbeat
  const isOffbeat = positionInBar % 2 !== 0;

  // Construct the key with section, quarter beat, and 'u' if it's an offbeat
  const key = `${section}|${quarterBeat}${isOffbeat ? "u" : ""}`;
  return key;
}
