import { motion } from "framer-motion";
import styled from "styled-components";
import tw from "twin.macro";
import { SizeVariants } from "../../../interfaces/enums";
import SnippetText from "./SnippetText";

const StyledPointedPhraseWrapper = styled.div`
  ${tw` flex w-3/4 mx-auto flex-wrap justify-center`}
`;

const PointedPhraseVariantOne = (props: { snippets: string[] }) => {
  const { snippets } = props;
  const firstBreakIndex = snippets.findIndex((snippet, idx) => snippet.includes("#"));

  return (
    <div style={{ width: "100%" }}>
      <StyledPointedPhraseWrapper>
        {snippets
          .slice(0, firstBreakIndex == -1 ? snippets.length : firstBreakIndex + 1)

          .map((snippet, index) => (
            <SnippetText key={index} snippet={snippet} size={SizeVariants.XL} />
          ))}
      </StyledPointedPhraseWrapper>

      <StyledPointedPhraseWrapper>
        {firstBreakIndex !== -1 &&
          snippets.slice(firstBreakIndex + 1).map((snippet, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -100 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <SnippetText key={index} snippet={snippet} size={SizeVariants.L} />
            </motion.div>
          ))}
      </StyledPointedPhraseWrapper>
    </div>
  );
};

export default PointedPhraseVariantOne;
