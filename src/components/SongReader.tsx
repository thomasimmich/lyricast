import styled from "@emotion/styled";
import tw from "twin.macro";
import { colorItems } from "../base/constants";
import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { getDictionaryFromLyricsTabString } from "../functions/getDictionaryFromLyricsTab";
import { uschiLyricsTabString } from "../assets/uschi/uschi-lyrics-tab";
import { R } from "vitest/dist/reporters-LqC_WI4d.js";


const removPrefix = (snippet: string) => {
  if (snippet.startsWith("___")) {
    return snippet.slice(3);
  }
  if (snippet.startsWith("__")) {
    return snippet.slice(2);
  }
  if (snippet.startsWith("_")) {
    return snippet.slice(1);
  } else {
    return snippet;
  }
};

const selectSongSnippetForCurrentSnippetIndex = (
  snippets: Record<string, string>,
  index:  Record<string, string>
): string[] => {
  // const currentSnippet = snippets[index.key];
  // if (currentSnippet.startsWith("___")) {
  //   return [
  //     removPrefix(snippets[index - 3]),
  //     removPrefix(snippets[index - 2]),
  //     removPrefix(snippets[index - 1]),
  //     removPrefix(currentSnippet),
  //   ];
  // } else if (currentSnippet.startsWith("__")) {
  //   return [
  //     removPrefix(snippets[index - 2]),
  //     removPrefix(snippets[index - 1]),
  //     removPrefix(currentSnippet),
  //   ];
  // } else if (currentSnippet.startsWith("_")) {
  //   return [removPrefix(snippets[index - 1]), removPrefix(currentSnippet)];
  // } else {
  //   return [removPrefix(currentSnippet)];
  // }

  return [index.value];
};

const StyeldSnippetContainer = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw`  w-screen h-screen flex justify-center items-center`}
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
`;

const StyledSnippetText = styled.div`
  ${tw`text-8xl transition-all w-fit   leading-[6rem]    font-black`}
`;

const StyledTextWrapper = styled.div`
  ${tw` w-2/3 h-1/2 flex flex-col  text-left mx-auto `}
`;
const SongSnippetDisplayer = (props: {
  snippets: string[];
  pastSnippets: string[];
  index: number;
}) => {
  const index = props.index % colorItems.length;

  return (
    <StyeldSnippetContainer
      color={colorItems[index].color}
      backgroundColor={colorItems[index].backgroundColor}
    >
      <StyledTextWrapper>
        {props.snippets.map((snippet, i) => {
          const wasInPast = i < props.pastSnippets.length;

          return (
            <StyledSnippetText>
              <motion.p
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                  marginLeft: i * 100,
                }}
                key={i}
              >
                {snippet}{" "}
              </motion.p>
            </StyledSnippetText>
          );
        })}
      </StyledTextWrapper>
    </StyeldSnippetContainer>
  );
};
const SongReader = () => {
  const [snippetDictory, setSnippetDictory] = useState<Record<string, string>>(
    getDictionaryFromLyricsTabString(uschiLyricsTabString)
  );
  const [currentTabKey, setCurrentTabKey] = useState(snippetDictory["1|0"]);

  console.log(currentTabKey); 

  return (
    <div>
      {/* <SongSnippetDisplayer
        pastSnippets={[]}
        snippets={selectSongSnippetForCurrentSnippetIndex(
          snippetDictory,
          currentTabKey
        )}
        index={snippetDictory.findIndex((key) => key === currentTabKey)}
      /> */}
    </div>
  );
};

export default SongReader;
