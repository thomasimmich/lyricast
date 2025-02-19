import styled from "styled-components";
import tw from "twin.macro";
import { SizeVariants } from "../../../interfaces/enums";
import SnippetText from "./SnippetText";

const StyledPointedPhraseWrapper = styled.div`
  ${tw` flex items-center w-full h-full `}
`;

const PointedPhraseVariant2 = (props: { snippets: string[] }) => {
  const { snippets } = props;
  const firstBreakIndex = 1;
  const secondBreakIndex = 2;

  return (
    <StyledPointedPhraseWrapper>
      <div style={{ width: "100%", height: "fit" }}>
        <div style={{ marginLeft: "2rem" }}>
          {snippets.slice(0, firstBreakIndex).map((snippet, index) => {
            return (
              <SnippetText
                key={index}
                snippet={snippet}
                size={SizeVariants.L}
              />
            );
          })}
        </div>

        <div
          style={{
            display: "flex",

            marginTop: "2rem",
          }}
        >
          <div>
            {snippets
              .slice(firstBreakIndex, secondBreakIndex + 1)

              .map((snippet, index) => (
                <SnippetText
                  key={index}
                  snippet={snippet}
                  size={SizeVariants.XXXL}
                />
              ))}
          </div>
          <div
            style={{
              marginLeft: "2rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {snippets
              .slice(
                secondBreakIndex ? secondBreakIndex + 1 : firstBreakIndex + 2,
              )
              .map((snippet, index) => (
                <SnippetText
                  key={index}
                  snippet={snippet}
                  size={SizeVariants.XL}
                />
              ))}
          </div>
        </div>
      </div>
    </StyledPointedPhraseWrapper>
  );
};

export default PointedPhraseVariant2;
