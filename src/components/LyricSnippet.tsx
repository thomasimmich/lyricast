import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { colorItems } from "../base/constants";
import { getLyricAnimatonPattern } from "../functions/getLyricAnimatonPattern";
import { LyricAnimationPatterns, SizeVariants } from "../base/enums";
import {
  LeftSlidingInPhrase,
  RightSlidingInPhrase,
  StackedBlockPhrase,
  StackedChaos,
  TwoWordWonder,
  WordByWord,
  OneWordWonder,
  PointedPhrase,
  PointedPhraseVariantOne,
} from "./animations";
import PointedPhraseVariant2 from "./animations/PointedPhraseVariantTwo";

const StyeldSnippetContainer = styled.div<{
  bg: string;
  color: string;
}>`
  ${tw` uppercase items-center  w-screen h-screen flex justify-center pb-20`}
  background-color: ${(props) => props.bg};
  color: ${(props) => props.color};
`;

const displayAnimationPattern = (
  snippets: string[],
  pattern: LyricAnimationPatterns
) => {
  switch (pattern) {
    case LyricAnimationPatterns.RIGHT_SLIDING_IN_PHRASE:
      return <RightSlidingInPhrase snippets={snippets} />;
    case LyricAnimationPatterns.LEFT_SLIDING_IN_PHRASE:
      return <LeftSlidingInPhrase snippets={snippets} />;
    case LyricAnimationPatterns.STACKED_BLOCK_PHRASE:
      return <StackedBlockPhrase size={SizeVariants.XL} snippets={snippets} />;
    case LyricAnimationPatterns.ONE_WORD_WONDER_XXL:
      return <OneWordWonder size={SizeVariants.XXL} snippets={snippets} />;
    case LyricAnimationPatterns.ONE_WORD_WONDER_XXXL: 
      return <OneWordWonder size={SizeVariants.XXXL} snippets={snippets} />;
    case LyricAnimationPatterns.ONE_WORD_WONDER_XL:
      return <OneWordWonder size={SizeVariants.L} snippets={snippets} />;
    case LyricAnimationPatterns.TWO_WORD_WONDER_XL:
      return <TwoWordWonder size={SizeVariants.XL} snippets={snippets} />;
    case LyricAnimationPatterns.POINTED_PHRASE:
      return <PointedPhrase snippets={snippets} />;
    case LyricAnimationPatterns.POINTED_PHRASE_VARIANT_1:
      return <PointedPhraseVariantOne snippets={snippets} />;
    case LyricAnimationPatterns.POINTED_PHRASE_VARIANT_2:
      return <PointedPhraseVariant2 snippets={snippets} />;
    case LyricAnimationPatterns.WORD_BY_WORD:
      return <WordByWord snippets={snippets} />;
    case LyricAnimationPatterns.STACKED_CHAOS:
      return <StackedChaos snippets={snippets} />;
    case LyricAnimationPatterns.STACKED_BLOCK_PHRASE:
      return <StackedBlockPhrase size={SizeVariants.L} snippets={snippets} />;
    default:
      return <WordByWord snippets={snippets} />;
  }
};
const LyricSnippet = (props: {
  snippets: string[];
  pastSnippets: string[];
  index: number;
}) => {
  const { snippets } = props;
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
   setCurrentColorIndex((prev) => (prev + 1) % colorItems.length);
  }, [getLyricAnimatonPattern(snippets)]);



  return (
    <StyeldSnippetContainer
      color={colorItems[currentColorIndex].color}
      bg={colorItems[currentColorIndex].backgroundColor}
    >
      {displayAnimationPattern(
        props.snippets,
        getLyricAnimatonPattern(snippets)
      )}
    </StyeldSnippetContainer>
  );
};

export default LyricSnippet;
