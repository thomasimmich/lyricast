export interface LyricsTabEntryProps {
  index: number;
  tabKey: string;
  lyricsSnippet: string;
  expectedPitch: number;
  isWaitingForSequenceTrigger: boolean;
}
