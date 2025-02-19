import styled from "styled-components";
import tw from "twin.macro";
import { SizeVariants } from "../../../interfaces/enums";
import SnippetText from "./SnippetText";

const StyledSnippetWrapper = styled.div`
  ${tw`w-1/2 flex-wrap flex   text-center`}
`;
const WordByWord = (props: { snippets: string[] }) => {
  const { snippets } = props;
  return (
    <StyledSnippetWrapper>
      {snippets.map((snippet, index) => {
        return (
          <SnippetText key={index} snippet={snippet} size={SizeVariants.L} />
        );
      })}
    </StyledSnippetWrapper>
  );
};

export default WordByWord;
