import { useEffect, useState } from "react";
import { getKeyFromMicroBeatIndex } from "../functions/getKeyFromMicroBeatIndex";

export function useCurrentLyricsTabEntry(
  bpm: number,
  lyricsTabDictionary: Record<string, string>
): { tabKey: string; lyricsSnippet: string } {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Convert BPM to an interval in milliseconds for a quarter note
    // If you want to increment on each 1/8 beat, divide the interval by 2
    const intervalDuration = ((60 / bpm) * 1000) / 2;

    // Set up the interval
    const interval = setInterval(() => {
      setIndex((prevIndex) => prevIndex + 1);
    }, intervalDuration);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [bpm]); // Only reset the interval if BPM changes

  // Get the key from the current index
  const tabKey = getKeyFromMicroBeatIndex(index);
  const lyricsSnippet = lyricsTabDictionary[tabKey];

  return { tabKey, lyricsSnippet };
}
