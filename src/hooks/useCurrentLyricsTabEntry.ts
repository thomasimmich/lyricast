import { useEffect, useState } from "react";
import { getKeyFromMicroBeatIndex } from "../functions/getKeyFromMicroBeatIndex";
import { LyricsTabEntryProps } from "../interfaces/LyricsTabEntryProps";

function containsOnlySpecialChars(input: string): boolean {
  return /^[^a-zA-Z0-9]+$/.test(input);
}

function isSnippetEmpty(snippet: string): boolean {
  return snippet === "" || containsOnlySpecialChars(snippet);
}

export function useCurrentLyricsTabEntry(props: LyricsTabConfigProps) {
  const [index, setIndex] = useState(props.startIndex);
  const [isPlayingSequence, setIsPlayingSequence] = useState(true);
  const [isFinishingSequence, setIsFinishingSequence] = useState(false);
  const [isWaitingForSequenceTrigger, setIsWaitingForSequenceTrigger] =
    useState(true);

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
    const intervalDuration = ((60 / props.bpm) * 1000) / 2;

    const interval = setInterval(() => {
      const increment =
        props.bpm > 0 && (isPlayingSequence || isFinishingSequence) ? 1 : 0;
      setIndex((prevIndex) => prevIndex + increment);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [props.bpm, isPlayingSequence, isWaitingForSequenceTrigger]);

  useEffect(() => {
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
    }
  }, [index]);

  useEffect(() => {
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
        "Volume threshold exceeded, start playing sequence. Cannot stop playing now."
      );
    }
  }, [
    props.volume,
    props.pitch,
    isWaitingForSequenceTrigger,
    props.volumeThreshold,
  ]);

  useEffect(() => {
    if (props.bpm === -1) {
      setIndex(props.startIndex);
    }
  }, [props.bpm]);

  return {
    ...entry,
  };
}
