import styled from "@emotion/styled";
import { motion } from "framer-motion";
import tw from "twin.macro";
import { SizeVariants } from "../../../interfaces/enums";
import SnippetText from "./SnippetText";

const StyledSnippetWrapper = styled.div`
  ${tw`w-2/3 justify-center flex `}
`;

const LeftSlidingInPhrase = (props: { snippets: string[] }) => {
  const { snippets } = props;
  return (
    <StyledSnippetWrapper>
      {snippets.map((snippet, index) => {
        return (
          <motion.div
            style={{ width: "fit" }}
            key={index}
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
