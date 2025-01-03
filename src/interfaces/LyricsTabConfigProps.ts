interface LyricsTabConfigProps {
  bpm: number;
  lyricsTabDictionary: Record<string, string>;
  lyricsPitchDictionary?: Record<string, number>;
  volumeThreshold: number;
}
