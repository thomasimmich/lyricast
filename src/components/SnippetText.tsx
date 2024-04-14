import React from "react";
import { SizeVariants } from "../base/enums";
import styled from "@emotion/styled";
import tw from "twin.macro";

const StyledSnippetText = styled.span<{
  size: SizeVariants;
}>`
  ${tw`uppercase  `}
  font-size: ${(props) => {
    if (props.size === SizeVariants.XL) {
      return "10rem";
    } else if (props.size === SizeVariants.L) {
      return "5rem";
    } else if (props.size === SizeVariants.XXXL) {
      return "38rem";
    } else {
      return "16rem";
    }
  }};
  font-weight: ${(props) => {
    if (props.size === SizeVariants.XXXL) {
      return "800";
    } else if (props.size === SizeVariants.XXL) {
      return "1000";
    } else if (props.size === SizeVariants.XL) {
      return "800";
    } else {
      return "800";
    }
  }};

  line-height: ${(props) => {
    if (props.size === SizeVariants.XXXL) {
      return "32rem";
    } else if (props.size === SizeVariants.XXL) {
      return "16rem";
    } else if (props.size === SizeVariants.XL) {
      return "10rem";
    } else {
      return "5rem";
    }
  }};
`;

const SnippetText = (props: { snippet: string; size: SizeVariants }) => {
  const { snippet, size } = props;

  return (
    <StyledSnippetText
      style={{ marginLeft: snippet !== "" ? 24 : 0 }}
      size={size}
    >
      {snippet.replace(/-|▶️|◀️|⏺️|🐳|🐋|#|📦|🔴|🟠|🔲|"/g, "")}
    </StyledSnippetText>
  );
};

export default SnippetText;
