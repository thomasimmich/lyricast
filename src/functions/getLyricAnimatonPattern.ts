import { LyricAnimationPatterns } from "../base/enums";

export const getLyricAnimatonPattern = (
  snippets: string[]
): LyricAnimationPatterns => {
  if (snippets[0].includes("▶️")) {
    return LyricAnimationPatterns.LEFT_SLIDING_IN_PHRASE;
  } else if (snippets[0].includes("◀️")) {
    return LyricAnimationPatterns.RIGHT_SLIDING_IN_PHRASE;
  } else if (snippets[0].includes("⏹️")) {
    return LyricAnimationPatterns.STACKED_BLOCK_PHRASE;

  }else if (snippets[0].includes("🚀")) 
    {
      return LyricAnimationPatterns.ONE_WORD_WONDER_XXXL;
     }
   else if (snippets[0].includes("🐳")) {
    return LyricAnimationPatterns.ONE_WORD_WONDER_XXL;
  } else if (snippets[0].includes("🐋")) {
    return LyricAnimationPatterns.ONE_WORD_WONDER_XL;
  } else if (snippets[0].includes("🦞")) {
    return LyricAnimationPatterns.TWO_WORD_WONDER_XL;
  } else if (snippets[0].includes("⏺️")) {
    return LyricAnimationPatterns.POINTED_PHRASE;
  } else if (snippets[0].includes("🔴")) {
    return LyricAnimationPatterns.POINTED_PHRASE_VARIANT_1;
  } else if (snippets[0].includes("🟠")) {
    return LyricAnimationPatterns.POINTED_PHRASE_VARIANT_2;
  } else if (snippets[0].includes("📚")) {
    return LyricAnimationPatterns.WORD_BY_WORD;
  } else if (snippets[0].includes("📦")) {
    return LyricAnimationPatterns.STACKED_CHAOS;
  } else if (snippets[0].includes("🔲")) {
    return LyricAnimationPatterns.STACKED_BLOCK_PHRASE;
  } else {
    return LyricAnimationPatterns.WORD_BY_WORD;
  }
};
