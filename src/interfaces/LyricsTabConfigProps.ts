interface LyricsTabConfigProps {
  bpm: number;
  lyricsTabDictionary: Record<string, string>;
  lyricsPitchDictionary?: Record<string, number>;
  volume: number;
  volumeThreshold: number;
  pitch: number;
  pitchMargin: number;
}
