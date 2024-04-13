import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { colorItems } from "../base/constants";

const StyeldSnippetContainer = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw`  w-screen h-screen flex justify-center pt-60`}
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};
`;

const StyledTextWrapper = styled.div`
  ${tw` w-2/3 h-fit justify-start  flex flex-wrap text-left mx-auto `}
`;

const StyledSnippetText = styled.div`
  ${tw`text-8xl transition-all h-28   font-black`}
`;

const LyricSnippet = (props: {
  snippets: string[];
  pastSnippets: string[];
  index: number;
}) => {
  const { snippets } = props;
  const [currentSnippets, setCurrentSnippets] = useState<string[]>([]);
  const [isGoingFurther, setIsGoingFurther] = useState<boolean>(false);
  const [partIndex, setPartIndex] = useState<number>(0);

  useEffect(() => {
    setCurrentSnippets(snippets);
  }, []);

  useEffect(() => {
    if (snippets[0] === "" && currentSnippets[0] !== "") {
      setIsGoingFurther(true);
      setTimeout(() => {
        setIsGoingFurther(false);
        setCurrentSnippets(snippets);
        setPartIndex(partIndex + 1);
      }, 300);
    } else {
      setCurrentSnippets(snippets);
    }
  }, [snippets]);

  return (
    <StyeldSnippetContainer
      color={colorItems[partIndex % colorItems.length].color}
      backgroundColor={
        colorItems[partIndex % colorItems.length].backgroundColor
      }
    >
      <motion.div
        style={{ width: "100%" }}
        initial={{ left: 0, position: "absolute" }}
        animate={{
          left: isGoingFurther ? 800 : 0,
        }}
      >
        <StyledTextWrapper>
          {currentSnippets.map((snippet, i) => {
            return (
              <StyledSnippetText key={i}>
                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  key={i}
                  style={{ marginLeft: snippet.includes("-") ? 0 : 24 }}
                >
                  {snippet.replace(/-/g, "")}
                </motion.div>
              </StyledSnippetText>
            );
          })}
        </StyledTextWrapper>
      </motion.div>
    </StyeldSnippetContainer>
  );
};

export default LyricSnippet;
