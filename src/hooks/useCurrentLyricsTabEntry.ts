import { useEffect, useState } from "react";
import { getKeyFromMicroBeatIndex } from "../functions/getKeyFromMicroBeatIndex";
import { LyricsTabEntryProps } from "../interfaces/LyricsTabEntryProps";

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
  props: LyricsTabConfigProps,
): LyricsTabEntryProps {
  const [index, setIndex] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(true);
  const [isFinishingSequence, setIsFinishingSequence] = useState(false);
  const [isWaitingForSequenceTrigger, setIsWaitingForSequenceTrigger] =
    useState(true);

  // useEffect(() => {
  //   console.log("Current index:", index);
  // }, [index]);

  const [entry, setEntry] = useState<LyricsTabEntryProps>({
    index: 0,
    tabKey: "",
    lyricsSnippet: "",
    expectedPitch: 0,
    isWaitingForSequenceTrigger: isWaitingForSequenceTrigger,
  });
  const [nextEntry, setNextEntry] = useState<LyricsTabEntryProps>({
    index: 0,
    tabKey: "",
    lyricsSnippet: "",
    expectedPitch: 0,
    isWaitingForSequenceTrigger: isWaitingForSequenceTrigger,
  });

  //const { volume, pitch } = useMicrophone();
  useEffect(() => {
    const tabKey = getKeyFromMicroBeatIndex(index);
    const lyricsSnippet = props.lyricsDictionary[tabKey];
    const expectedPitch =
      props.pitchesDictionary[tabKey] ?? entry.expectedPitch;
    setEntry({
      index: index,
      tabKey: tabKey,
      lyricsSnippet: lyricsSnippet,
      expectedPitch: expectedPitch,
      isWaitingForSequenceTrigger: isWaitingForSequenceTrigger,
    });

    const nextTabKey = getKeyFromMicroBeatIndex(index + 1);
    const nextLyricsSnippet = props.lyricsDictionary[nextTabKey];

    setNextEntry({
      index: index,
      tabKey: tabKey,
      lyricsSnippet: nextLyricsSnippet,
      expectedPitch: expectedPitch,
      isWaitingForSequenceTrigger: isWaitingForSequenceTrigger,
    });
  }, [
    index,
    isPlayingSequence,
    isWaitingForSequenceTrigger,
    props.lyricsDictionary,
    props.volume,
    props.pitch,
    props.pitchesDictionary,
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
    // console.log("Current snippet:", entry.lyricsSnippet);

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

      // console.log("Finishing sequence playback.");
    }
  }, [index]); // Only rerun when volume or volumeThreshold changes

  // Volume thresholds
  useEffect(() => {
    // console.log("Expected pitch: " + entry.expectedPitch);
    const pitchLowerThreshold = entry.expectedPitch - props.pitchMargin;
    const pitchUpperThreshold = entry.expectedPitch + props.pitchMargin;
    if (
      props.volume > props.volumeThreshold &&
      ((props.pitch >= pitchLowerThreshold &&
        props.pitch <= pitchUpperThreshold) ||
        props.pitchMargin === -1) &&
      isWaitingForSequenceTrigger
    ) {
      setIsWaitingForSequenceTrigger(false);
      setIsPlayingSequence(true);
      console.log(
        "Volume threshold exceeded, start playing sequence. Cannot stop playing now.",
      );
    }
  }, [
    props.volume,
    props.pitch,
    isWaitingForSequenceTrigger,
    props.volumeThreshold,
  ]); // Only rerun when volume or volumeThreshold changes

  return entry;
}
