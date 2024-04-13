import { uschiLyricsTabString } from "../assets/uschi/uschi-lyrics-tab";
import { getDictionaryFromLyricsTabString } from "../functions/getDictionaryFromLyricsTab";
import { useCurrentLyricsTabEntry } from "../hooks/useCurrentLyricsTabEntry"; // Path to your hook
import LyricSnippet from "./LyricSnippet";

const removPrefix = (snippet: string) => {
  return snippet.replace(/_/g, "");
};

const selectSongSnippetForCurrentSnippetIndex = (
  snippetDict: Record<string, string>,
  tabKey: string
): string[] => {
  const currentSnippet = snippetDict[tabKey];
  const keyIndex = Object.keys(snippetDict).indexOf(tabKey);
  const previousSnipet = snippetDict[Object.keys(snippetDict)[keyIndex - 1]];
  const previousSnipet2 = snippetDict[Object.keys(snippetDict)[keyIndex - 2]];
  const previousSnipet3 = snippetDict[Object.keys(snippetDict)[keyIndex - 3]];
  const previousSnipet4 = snippetDict[Object.keys(snippetDict)[keyIndex - 4]];
  const previousSnipet5 = snippetDict[Object.keys(snippetDict)[keyIndex - 5]];
  const previousSnipet6 = snippetDict[Object.keys(snippetDict)[keyIndex - 6]];
  const previousSnipet7 = snippetDict[Object.keys(snippetDict)[keyIndex - 7]];
  const previousSnipet8 = snippetDict[Object.keys(snippetDict)[keyIndex - 8]];

  if (currentSnippet) {
    if (currentSnippet.includes("________")) {
      return [
        removPrefix(previousSnipet8),
        removPrefix(previousSnipet7),
        removPrefix(previousSnipet6),
        removPrefix(previousSnipet5),
        removPrefix(previousSnipet4),
        removPrefix(previousSnipet3),
        removPrefix(previousSnipet2),
        removPrefix(previousSnipet),
        removPrefix(currentSnippet),
      ];
    }
    if (currentSnippet.includes("_______")) {
      return [
        removPrefix(previousSnipet7),
        removPrefix(previousSnipet6),
        removPrefix(previousSnipet5),
        removPrefix(previousSnipet4),
        removPrefix(previousSnipet3),
        removPrefix(previousSnipet2),
        removPrefix(previousSnipet),
        removPrefix(currentSnippet),
      ];
    }
    if (currentSnippet.includes("______")) {
      return [
        removPrefix(previousSnipet6),
        removPrefix(previousSnipet5),
        removPrefix(previousSnipet4),
        removPrefix(previousSnipet3),
        removPrefix(previousSnipet2),
        removPrefix(previousSnipet),
        removPrefix(currentSnippet),
      ];
    }
    if (currentSnippet.includes("_____")) {
      return [
        removPrefix(previousSnipet5),
        removPrefix(previousSnipet4),
        removPrefix(previousSnipet3),
        removPrefix(previousSnipet2),
        removPrefix(previousSnipet),
        removPrefix(currentSnippet),
      ];
    } else if (currentSnippet.includes("____")) {
      return [
        removPrefix(previousSnipet4),
        removPrefix(previousSnipet3),
        removPrefix(previousSnipet2),
        removPrefix(previousSnipet),
        removPrefix(currentSnippet),
      ];
    } else if (currentSnippet.includes("___")) {
      return [
        removPrefix(previousSnipet3),
        removPrefix(previousSnipet2),
        removPrefix(previousSnipet),
        removPrefix(currentSnippet),
      ];
    } else if (currentSnippet.includes("__")) {
      return [
        removPrefix(previousSnipet2),
        removPrefix(previousSnipet),
        removPrefix(currentSnippet),
      ];
    } else if (currentSnippet.includes("_")) {
      return [removPrefix(previousSnipet), removPrefix(currentSnippet)];
    } else {
      return [removPrefix(currentSnippet)];
    }
  }
  return [""];
};

export const LyricsSnippetDisplay = (props: LyricsTabConfigProps) => {
  const { index, tabKey, lyricsSnippet, volume } =
    useCurrentLyricsTabEntry(props);
  const snippetDict: Record<string, string> =
    getDictionaryFromLyricsTabString(uschiLyricsTabString);
  const keyIndex = Object.keys(snippetDict).indexOf(tabKey);

  return (
    <LyricSnippet
      index={keyIndex}
      pastSnippets={[]}
      snippets={selectSongSnippetForCurrentSnippetIndex(snippetDict, tabKey)}
    />
  );
};
