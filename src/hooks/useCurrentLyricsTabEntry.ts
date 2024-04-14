import { useEffect, useState } from "react";
import { getKeyFromMicroBeatIndex } from "../functions/getKeyFromMicroBeatIndex";
import { LyricsTabEntryProps } from "../interfaces/LyricsTabEntryProps";
import useMicrophone from "./useMicrophone";
import { usePitch } from "./usePitch";

function containsOnlySpecialChars(input: string): boolean {
  // This regex matches any string that does not contain letters or digits
  // ^        : Start of the string
  // [^a-zA-Z0-9] : Any character that is not a letter or digit
  // +        : One or more of the preceding element
  // $        : End of the string
  return /^[^a-zA-Z0-9]+$/.test(input);
}

function isSnippetEmpty(snippet: string): boolean {
  return snippet === "" || containsOnlySpecialChars(snippet);
}

export function useCurrentLyricsTabEntry(
  props: LyricsTabConfigProps
): LyricsTabEntryProps {
  const [index, setIndex] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(true);
  const [isFinishingSequence, setIsFinishingSequence] = useState(false);
  const [isWaitingForSequenceTrigger, setIsWaitingForSequenceTrigger] =
    useState(true);

  const [entry, setEntry] = useState<LyricsTabEntryProps>({
    index: 0,
    tabKey: "",
    lyricsSnippet: "",
    volume: 0,
    isWaitingForSequenceTrigger: isWaitingForSequenceTrigger,
  });
  const [nextEntry, setNextEntry] = useState<LyricsTabEntryProps>({
    index: 0,
    tabKey: "",
    lyricsSnippet: "",
    volume: 0,
    isWaitingForSequenceTrigger: isWaitingForSequenceTrigger,
  });

  const { volume } = useMicrophone();
  const pitch = usePitch();

  useEffect(() => {
    const tabKey = getKeyFromMicroBeatIndex(index);
    const lyricsSnippet = props.lyricsTabDictionary[tabKey];

    setEntry({
      index: index,
      tabKey: tabKey,
      lyricsSnippet: lyricsSnippet,
      volume: volume,
      isWaitingForSequenceTrigger: isWaitingForSequenceTrigger,
    });

    const nextTabKey = getKeyFromMicroBeatIndex(index + 1);
    const nextLyricsSnippet = props.lyricsTabDictionary[nextTabKey];

    setNextEntry({
      index: index,
      tabKey: tabKey,
      lyricsSnippet: nextLyricsSnippet,
      volume: volume,
      isWaitingForSequenceTrigger: isWaitingForSequenceTrigger,
    });
  }, [
    index,
    isPlayingSequence,
    isWaitingForSequenceTrigger,
    props.lyricsTabDictionary,
    volume,
  ]);

  useEffect(() => {
    // Convert BPM to an interval in milliseconds for a quarter note
    // If you want to increment on each 1/8 beat, divide the interval by 2
    const intervalDuration = ((60 / props.bpm) * 1000) / 2;

    // Set up the interval
    const interval = setInterval(() => {
      const increment = isPlayingSequence || isFinishingSequence ? 1 : 0;
      setIndex((prevIndex) => prevIndex + increment);
    }, intervalDuration);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [props.bpm, isPlayingSequence, isWaitingForSequenceTrigger]); // Only reset the interval if BPM changes

  // Playback control, independently from volume
  useEffect(() => {
    console.log("Current snippet:", entry.lyricsSnippet);

    if (
      isSnippetEmpty(entry.lyricsSnippet) &&
      isPlayingSequence &&
      !isFinishingSequence
    ) {
      setIsFinishingSequence(true);
    }

    if (!isSnippetEmpty(nextEntry.lyricsSnippet) && isFinishingSequence) {
      setIsFinishingSequence(false);
      setIsPlayingSequence(false);
      setIsWaitingForSequenceTrigger(true);

      console.log("Finishing sequence playback.");
    }
  }, [index]); // Only rerun when volume or volumeThreshold changes

  // Volume thresholds
  useEffect(() => {
    if (volume > props.volumeThreshold && isWaitingForSequenceTrigger) {
      setIsWaitingForSequenceTrigger(false);
      setIsPlayingSequence(true);
      console.log(
        "Volume threshold exceeded, start playing sequence. Cannot stop playing now."
      );
    }
  }, [volume, isWaitingForSequenceTrigger, props.volumeThreshold]); // Only rerun when volume or volumeThreshold changes

  return entry;
}
