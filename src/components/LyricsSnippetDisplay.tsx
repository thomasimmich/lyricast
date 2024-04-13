import { useCurrentLyricsTabEntry } from "../hooks/useCurrentLyricsTabEntry"; // Path to your hook

interface LyricsTabDisplayProps {
  bpm: number;
  lyricsTabDictionary: Record<string, string>;
}

export const LyricsSnippetDisplay = (props: LyricsTabDisplayProps) => {
  const bpm = 120; // Set the desired BPM
  const { tabKey, lyricsSnippet } = useCurrentLyricsTabEntry(
    props.bpm,
    props.lyricsTabDictionary
  );

  return (
    <div>
      <h1>
        Current Key: {tabKey} {lyricsSnippet}
      </h1>
    </div>
  );
};
