import { useCurrentLyricsTabEntry } from "../hooks/useCurrentLyricsTabEntry"; // Path to your hook

export const LyricsSnippetDisplay = (props: LyricsTabConfigProps) => {
  const bpm = 120; // Set the desired BPM
  const { index, tabKey, lyricsSnippet, volume } =
    useCurrentLyricsTabEntry(props);

  return (
    <div>
      <h1>
        Index: {index}
        Current Key: {tabKey} {lyricsSnippet}
        Volume: {volume}
      </h1>
    </div>
  );
};
