interface LyricsTabConfigProps {
  bpm: number;
  lyricsDictionary: Record<string, string>;
  pitchesDictionary: Record<string, number>;
  volume: number;
  volumeThreshold: number;
  pitch: number;
  pitchMargin: number;
  startIndex: number;
}
