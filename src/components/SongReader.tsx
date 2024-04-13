import styled from "@emotion/styled";
import tw from "twin.macro";
import { colorItems } from "../base/constants";
import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";

const snippets = [
  "hello",
  "_world",
  "__Lorem",
  "___ipsum",
  "",
  "dolor",
  "_sit",
  "__amet",
  "___consectetur",
  "",
  "elit",
  "_sed",
  "__do",
  "___eiusmod",
  "hello",
  "_world",
  "__Lorem",
  "ipsum",
  "_dolor",
  "sit",
  "_amet",
  "__consectetur",
  "___adipiscing",
  "elit",
  "_sed",
  "__do",
  "___eiusmod",
  "hello",
  "_world",
  "__Lorem",
  "ipsum",
  "_dolor",
  "sit",
  "_amet",
  "__consectetur",
  "___adipiscing",
  "elit",
  "_sed",
  "__do",
  "___eiusmod",
];

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
  snippets: string[],
  index: number
): string[] => {
  const currentSnippet = snippets[index];
  if (currentSnippet.startsWith("___")) {
    return [
      removPrefix(snippets[index - 3]),
      removPrefix(snippets[index - 2]),
      removPrefix(snippets[index - 1]),
      removPrefix(currentSnippet),
    ];
  } else if (currentSnippet.startsWith("__")) {
    return [
      removPrefix(snippets[index - 2]),
      removPrefix(snippets[index - 1]),
      removPrefix(currentSnippet),
    ];
  } else if (currentSnippet.startsWith("_")) {
    return [removPrefix(snippets[index - 1]), removPrefix(currentSnippet)];
  } else {
    return [removPrefix(currentSnippet)];
  }
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
  // const [snippetDictory, setSnippetDictory] = useState(
  //   getDictionaryFromLyricsTabFile(file)
  // );
  // console.log(snippetDictory);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSnippetIndex((prevIndex) => prevIndex + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <SongSnippetDisplayer
        pastSnippets={selectSongSnippetForCurrentSnippetIndex(
          snippets,
          currentSnippetIndex !== 0
            ? currentSnippetIndex - 1
            : currentSnippetIndex
        )}
        snippets={selectSongSnippetForCurrentSnippetIndex(
          snippets,
          currentSnippetIndex
        )}
        index={currentSnippetIndex}
      />
    </div>
  );
};

export default SongReader;
