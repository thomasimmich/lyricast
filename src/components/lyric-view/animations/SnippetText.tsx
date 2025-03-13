import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import tw from "twin.macro";
import { SizeVariants, SupabaseTable } from "../../../interfaces/enums";
import supabaseClient from "../../../lib/supabase";

const getLocalStorageFontSize = () => {
  const fontSize = localStorage.getItem("font_size");
  return fontSize ? parseFloat(fontSize) : 1;
};

const StyledSnippetText = styled.span<{
  size: SizeVariants;
  localStorageFontSize: number;
}>`
  ${tw`uppercase`}
  font-size: ${(props) => {
    if (props.size === SizeVariants.XL) {
      return `${10 * props.localStorageFontSize}rem`;
    } else if (props.size === SizeVariants.L) {
      return `${5 * props.localStorageFontSize}rem`;
    } else if (props.size === SizeVariants.XXXL) {
      return `${38 * props.localStorageFontSize}rem`;
    } else {
      return `${16 * props.localStorageFontSize}rem`;
    }
  }};
  font-weight: ${(props) => {
    if (props.size === SizeVariants.XXXL) {
      return "1000";
    } else if (props.size === SizeVariants.XXL) {
      return "1000";
    } else if (props.size === SizeVariants.XL) {
      return "1000";
    } else {
      return "1000";
    }
  }};
  line-height: ${(props) => {
    if (props.size === SizeVariants.XXXL) {
      return `${32 * props.localStorageFontSize}rem`;
    } else if (props.size === SizeVariants.XXL) {
      return `${16 * props.localStorageFontSize}rem`;
    } else if (props.size === SizeVariants.XL) {
      return `${10 * props.localStorageFontSize}rem`;
    } else {
      return `${5 * props.localStorageFontSize}rem`;
    }
  }};
`;

const SnippetText = (props: { snippet: string; size: SizeVariants }) => {
  const { snippet, size } = props;
  const [fontScaleMultiplier, setFontScaleMultiplier] = useState(getLocalStorageFontSize());

  useEffect(() => {
    const fontSize = getLocalStorageFontSize();
    setFontScaleMultiplier(fontSize);
  }, []);

  return (
    <StyledSnippetText
      style={{ marginLeft: !snippet.includes("-") && snippet !== "" ? 24 : 0 }}
      size={size}
      localStorageFontSize={fontScaleMultiplier}
    >
      {snippet.replace(/-|▶️|◀️|⏺️|🐳|🐋|#|📦|🔴|🚀|🟠|🔲|"/g, "")}
    </StyledSnippetText>
  );
};

export default SnippetText;
