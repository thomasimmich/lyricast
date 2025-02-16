import React from "react";
import { SizeVariants } from "../../base/enums";
import SnippetText from "../SnippetText";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

const StyledStackedBlockPhrase = styled.p`
  ${tw` flex flex-wrap  w-1/2 mx-auto `}
`;

const StackedBlockPhrase = (props: {
  snippets: string[];
  size: SizeVariants;
}) => {
  return (
    <StyledStackedBlockPhrase>
      {props.snippets.map((snippet, index) => (
        <motion.div
          key={index}
          style={{ height: "5rem" }}
          initial={{ x: -100 }}
          animate={{ x: 0 }}
        >
          <SnippetText key={index} snippet={snippet} size={SizeVariants.L} />
        </motion.div>
      ))}
    </StyledStackedBlockPhrase>
  );
};

export default StackedBlockPhrase;
