import { useCurrentLyricsTabEntry } from "../../hooks/useCurrentLyricsTabEntry";
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
  const { tabKey } = useCurrentLyricsTabEntry(props);
  const keyIndex = Object.keys(props.lyricsDictionary).indexOf(tabKey);

  return (
    <LyricSnippet
      index={keyIndex}
      pastSnippets={[]}
      snippets={selectSongSnippetForCurrentSnippetIndex(props.lyricsDictionary, tabKey)}
    />
  );
};
