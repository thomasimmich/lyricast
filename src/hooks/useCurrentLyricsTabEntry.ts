import { useCallback, useEffect, useRef, useState } from "react";
import { getKeyFromMicroBeatIndex } from "../functions/getKeyFromMicroBeatIndex";
import { LyricsTabEntryProps } from "../interfaces/LyricsTabEntryProps";

function useIsPlaying() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [taps, setTaps] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requiredInitialTaps = 3;
  const breakThreshold = 1000;

  useEffect(() => {
    console.log("isPlaying", isPlaying);
  }, [isPlaying]);

  const handleTap = () => {
    const now = Date.now();
    const newTaps = [...taps, now];

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsPlaying(false);
      setTaps([]);
    }, breakThreshold);

    if (newTaps.length >= requiredInitialTaps) {
      const timeBetweenTaps = newTaps[newTaps.length - 1] - newTaps[newTaps.length - requiredInitialTaps];
      if (timeBetweenTaps < breakThreshold) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      setTaps(newTaps.slice(-requiredInitialTaps));
    } else {
      setTaps(newTaps);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleTap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [taps]);

  return { isPlaying, setIsPlaying };
}

function containsOnlySpecialChars(input: string): boolean {
  return /^[^a-zA-Z0-9]+$/.test(input);
}

function isSnippetEmpty(snippet: string): boolean {
  return snippet === "" || containsOnlySpecialChars(snippet);
}

export function useCurrentLyricsTabEntry(props: LyricsTabConfigProps) {
  const [index, setIndex] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(true);
  const [isFinishingSequence, setIsFinishingSequence] = useState(false);
  const [isWaitingForSequenceTrigger, setIsWaitingForSequenceTrigger] = useState(true);
  const { isPlaying, setIsPlaying } = useIsPlaying();

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
    const expectedPitch = props.pitchesDictionary[tabKey] ?? entry.expectedPitch;
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
      const increment = isPlaying && (isPlayingSequence || isFinishingSequence) ? 1 : 0;
      setIndex((prevIndex) => prevIndex + increment);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [props.bpm, isPlaying, isPlayingSequence, isWaitingForSequenceTrigger]);

  useEffect(() => {
    if (isSnippetEmpty(entry.lyricsSnippet) && isPlayingSequence && !isFinishingSequence) {
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
      ((props.pitch >= pitchLowerThreshold && props.pitch <= pitchUpperThreshold) || props.pitchMargin === -1) &&
      isWaitingForSequenceTrigger
    ) {
      setIsWaitingForSequenceTrigger(false);
      setIsPlayingSequence(true);
      console.log("Volume threshold exceeded, start playing sequence. Cannot stop playing now.");
    }
  }, [props.volume, props.pitch, isWaitingForSequenceTrigger, props.volumeThreshold]);

  const restart = useCallback(() => {
    setIsPlaying(false);
    setIndex(0);
    setIsPlayingSequence(true);
    setIsFinishingSequence(false);
    setIsWaitingForSequenceTrigger(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "r") {
        event.preventDefault();

        restart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [restart]);

  return {
    ...entry,
    restart,
  };
}
