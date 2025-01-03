import { uschiLyricsTabString } from "../assets/uschi/uschi-lyrics-tab";
import { getDictionaryFromLyricsTabString } from "../functions/getDictionaryFromLyricsTab";
import { useCurrentLyricsTabEntry } from "../hooks/useCurrentLyricsTabEntry"; // Path to your hook
import LyricSnippet from "./LyricSnippet";

const removPrefix = (snippet: string) => {
  return snippet ? snippet.replace(/_/g, "") : "";
};

const selectSongSnippetForCurrentSnippetIndex = (snippetDict: Record<string, string>, tabKey: string): string[] => {
  let currentSnippet = snippetDict[tabKey] ? (snippetDict[tabKey].includes(`"`) ? "" : snippetDict[tabKey]) : "";

  const keyIndex = Object.keys(snippetDict).indexOf(tabKey);
  const selectedSnippets: string[] = [];

  for (let i = keyIndex - 1; i >= 0; i--) {
    const snippet = snippetDict[Object.keys(snippetDict)[i]];
    const numberOfUnderscores = snippet && snippet.split("_").length - 1;
    if (typeof numberOfUnderscores === "number" && numberOfUnderscores >= keyIndex - i) {
      selectedSnippets.unshift(removPrefix(snippet));
    } else {
      break;
    }
  }

  selectedSnippets.push(removPrefix(currentSnippet));

  return selectedSnippets;
};

export const LyricsSnippetDisplay = (props: LyricsTabConfigProps) => {
  const { index, tabKey, lyricsSnippet, volume } = useCurrentLyricsTabEntry(props);
  const snippetDict: Record<string, string> = getDictionaryFromLyricsTabString(uschiLyricsTabString);
  const keyIndex = Object.keys(snippetDict).indexOf(tabKey);

  return (
    <LyricSnippet
      index={keyIndex}
      pastSnippets={[]}
      snippets={selectSongSnippetForCurrentSnippetIndex(snippetDict, tabKey)}
    />
  );
};
