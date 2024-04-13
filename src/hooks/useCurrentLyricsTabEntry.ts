import { useEffect, useState } from "react";
import { getKeyFromMicroBeatIndex } from "../functions/getKeyFromMicroBeatIndex";
import { LyricsTabEntryProps } from "../interfaces/LyricsTabEntryProps";
import useMicrophone from "./useMicrophone";

export function useCurrentLyricsTabEntry(
  props: LyricsTabConfigProps
): LyricsTabEntryProps {
  const [index, setIndex] = useState(0);
  const [playingState, setPlayingState] = useState(false); // Add a state for playing or not
  const { volume } = useMicrophone();
  const [entry, setEntry] = useState<LyricsTabEntryProps>({
    index: 0,
    tabKey: "",
    lyricsSnippet: "",
    volume: 0,
  });

  useEffect(() => {
    if (volume > props.volumeThreshold) {
      setPlayingState(true);
      console.log("Volume threshold exceeded, starting playback");
    }

    if (volume < props.volumeThreshold) {
      setPlayingState(false);
      console.log("Volume threshold not exceeded, stopping playback");
    }
  }, [volume, props.volumeThreshold]); // Only rerun when volume or volumeThreshold changes

  useEffect(() => {
    // Convert BPM to an interval in milliseconds for a quarter note
    // If you want to increment on each 1/8 beat, divide the interval by 2
    const intervalDuration = ((60 / props.bpm) * 1000) / 2;

    // Set up the interval
    const interval = setInterval(() => {
      const increment = playingState ? 1 : 0;
      setIndex((prevIndex) => prevIndex + increment);
    }, intervalDuration);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [props.bpm, playingState]); // Only reset the interval if BPM changes

  useEffect(() => {
    const tabKey = getKeyFromMicroBeatIndex(index);
    const lyricsSnippet = props.lyricsTabDictionary[tabKey];

    setEntry({
      index: index,
      tabKey: tabKey,
      lyricsSnippet: lyricsSnippet,
      volume: volume,
    });
  }, [index, playingState, props.lyricsTabDictionary, volume]);
  // Get the key from the current index

  return entry;
}
