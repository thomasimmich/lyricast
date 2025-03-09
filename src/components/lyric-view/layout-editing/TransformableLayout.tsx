import React, { ReactNode } from "react";
import styled from "styled-components";
import tw from "twin.macro";

interface TransformableLayoutProps {
  children: ReactNode;
  transform: any;
  editable: boolean;
  setTransform: (transform: any) => void;
}

const StyledContainer = styled.div`
  ${tw`relative w-screen h-screen bg-black flex justify-center items-center`}
`;

const StyledGridOverlay = styled.div`
  ${tw`absolute inset-0 pointer-events-none`}
  background-size: 80px 80px;
  background-image:
    linear-gradient(to right, yellow 1px, transparent 1px),
    linear-gradient(to bottom, yellow 1px, transparent 1px);
`;

const StyledChildContainer = styled.div<{
  transform: string;
  borderRadius: string;
  width: string;
  height: string;
}>`
  ${tw`overflow-hidden flex justify-center items-center`}
  ${(props) => (props.borderRadius !== "0" ? tw`border-2 border-red-500` : ``)}
  transform: ${(props) => props.transform};
  border-radius: ${(props) => props.borderRadius};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

export const TransformableLayout: React.FC<TransformableLayoutProps> = ({
  children,
  transform,
  editable,
}) => {
  const {
    translate_x = 0,
    translate_y = 0,
    scale = 1,
    border_radius = 0,
    width = 100,
    height = 100,
  } = transform || {};

  return (
    <StyledContainer>
      {editable && <StyledGridOverlay />}
      <StyledChildContainer
        transform={`translate(${translate_x}px, ${translate_y}px) scale(${scale})`}
        borderRadius={`${border_radius}%`}
        width={`${width}%`}
        height={`${height}%`}
      >
        {children}
      </StyledChildContainer>
    </StyledContainer>
  );
};
