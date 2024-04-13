import styled from "@emotion/styled";
import tw from "twin.macro";
import { colorItems } from "../base/constants";
import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";

const snippets = [
  "hello",
  "-world",
  "--Lorem",
  "ipsum",
  "-dolor",
  "sit",
  "-amet",
  "--consectetur",
  "---adipiscing",
  "elit",
  "-sed",
  "--do",
  "---eiusmod",
  "hello",
  "-world",
  "--Lorem",
  "ipsum",
  "-dolor",
  "sit",
  "-amet",
  "--consectetur",
  "---adipiscing",
  "elit",
  "-sed",
  "--do",
  "---eiusmod",
  "hello",
  "-world",
  "--Lorem",
  "ipsum",
  "-dolor",
  "sit",
  "-amet",
  "--consectetur",
  "---adipiscing",
  "elit",
  "-sed",
  "--do",
  "---eiusmod",
];

const removPrefix = (snippet: string) => {
  if (snippet.startsWith("---")) {
    return snippet.slice(3);
  }
  if (snippet.startsWith("--")) {
    return snippet.slice(2);
  }
  if (snippet.startsWith("-")) {
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
  if (currentSnippet.startsWith("---")) {
    return [
      removPrefix(snippets[index - 3]),
      removPrefix(snippets[index - 2]),
      removPrefix(snippets[index - 1]),
      removPrefix(currentSnippet),
    ];
  } else if (currentSnippet.startsWith("--")) {
    return [
      removPrefix(snippets[index - 2]),
      removPrefix(snippets[index - 1]),
      removPrefix(currentSnippet),
    ];
  } else if (currentSnippet.startsWith("-")) {
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

const StyledSnippetText = styled.p`
  ${tw`text-8xl w-2/3  text-left mx-auto leading-[6rem]    font-black`}
`;
const SongSnippetDisplayer = (props: { snippets: string[];  index: number }) => {
  const index = props.index % colorItems.length;

  return (
    <StyeldSnippetContainer
      color={colorItems[index].color}
      backgroundColor={colorItems[index].backgroundColor}
    >
      <StyledSnippetText>
        <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }}>
          {props.snippets.map((snippet, i) => (
            <span key={i}>{snippet} </span>
          ))}
        </motion.p>
      </StyledSnippetText>
    </StyeldSnippetContainer>
  );
};
const SongReader = () => {
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
