import React from "react";
import SnippetText from "../SnippetText";
import { SizeVariants } from "../../base/enums";
import styled from "styled-components";
import tw from "twin.macro";

const StyledPointedPhraseWrapper = styled.div`
  ${tw`w-3/4 flex flex-col items-center justify-center`}
`;

const StyledCenteredDiv = styled.div`
  ${tw`flex w-full my-4 justify-center`}
`;

const PointedPhrase = (props: { snippets: string[] }) => {
  const { snippets } = props;
  const firstBreakIndex = snippets.findIndex((snippet, idx) =>
    snippet.includes("#")
  );
  const secondBreakIndex =
    snippets[firstBreakIndex] &&
    snippets[firstBreakIndex].split("#").length - 1 == 2
      ? firstBreakIndex
      : snippets.findIndex(
          (snippet, idx) => idx > firstBreakIndex && snippet.includes("#")
        );

  return (
    <StyledPointedPhraseWrapper>
      <StyledCenteredDiv>
        {snippets
          .slice(0, firstBreakIndex !== -1 ? firstBreakIndex : undefined)
          .map((snippet, index) => {
            return (
              <SnippetText
                key={index}
                snippet={snippet}
                size={SizeVariants.L}
              />
            );
          })}
      </StyledCenteredDiv>

      <StyledCenteredDiv>
        {firstBreakIndex !== -1 &&
          snippets
            .slice(
              firstBreakIndex,
              secondBreakIndex !== -1
                ? secondBreakIndex + 1
                : firstBreakIndex + 1
            )

            .map((snippet, index) => (
              <SnippetText
                key={index}
                snippet={snippet}
                size={SizeVariants.XXL}
              />
            ))}
      </StyledCenteredDiv>
      <StyledCenteredDiv style={{ marginTop: "1.5rem" }}>
        {secondBreakIndex !== -1 &&
          snippets
            .slice(
              secondBreakIndex ? secondBreakIndex + 1 : firstBreakIndex + 2
            )
            .map((snippet, index) => (
              <SnippetText
                key={index}
                snippet={snippet}
                size={SizeVariants.L}
              />
            ))}
      </StyledCenteredDiv>
    </StyledPointedPhraseWrapper>
  );
};

export default PointedPhrase;
