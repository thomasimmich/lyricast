import React from "react";
import SnippetText from "../SnippetText";
import { SizeVariants } from "../../base/enums";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

const StyledSnippetWrapper = styled.div`
  ${tw`w-2/3 flex `}
`;

const LeftSlidingInPhrase = (props: { snippets: string[] }) => {
  const { snippets } = props;
  return (
    <StyledSnippetWrapper>
      {snippets.map((snippet, index) => {
        return (
          <motion.div
          initial={{ x: 200 }}
          animate={{ x: 0 }}
          >
            <SnippetText key={index} snippet={snippet} size={SizeVariants.L} />
          </motion.div>
        );
      })}
    </StyledSnippetWrapper>
  );
};
export default LeftSlidingInPhrase;
