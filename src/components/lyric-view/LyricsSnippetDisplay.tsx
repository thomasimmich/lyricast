import { useEffect } from "react";
import styled from "styled-components";
import tw from "twin.macro";
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
  const { tabKey, restart } = useCurrentLyricsTabEntry(props);
  const keyIndex = Object.keys(props.lyricsDictionary).indexOf(tabKey);

  return (
    <div>
      <LyricSnippet
        index={keyIndex}
        pastSnippets={[]}
        snippets={selectSongSnippetForCurrentSnippetIndex(props.lyricsDictionary, tabKey)}
      />
      <RestartButton onClick={restart} />
    </div>
  );
};

const StyledRestartButton = styled.button`
  ${tw`fixed z-[400] bg-white/5 bottom-0 right-0`}
`;

const RestartButton = ({ onClick }: { onClick: () => void }) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "r") {
        event.preventDefault();
        onClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClick]);

  return <StyledRestartButton onClick={onClick}>Restart</StyledRestartButton>;
};
