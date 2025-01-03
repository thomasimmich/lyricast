import React, { useState, useEffect, ReactNode } from "react";
import styled from "styled-components";
import tw from "twin.macro";

interface TransformableProps {
  children: ReactNode;
  editable: boolean;
}

const StyledContainer = styled.div`
  ${tw`relative w-screen h-screen bg-black flex justify-center items-center`}
`;

const StyledGridOverlay = styled.div`
  ${tw`absolute inset-0 pointer-events-none`}
  background-size: 80px 80px;
  background-image: linear-gradient(to right, yellow 1px, transparent 1px),
    linear-gradient(to bottom, yellow 1px, transparent 1px);
`;

const StyledChildContainer = styled.div<{
  transform: string;
  borderRadius: string;
  width: string;
  height: string;
}>`
  ${tw`overflow-hidden flex justify-center items-center`}
  ${(props) => (props.borderRadius !== "0" ? tw`border-4 border-red-500` : ``)}
  transform: ${(props) => props.transform};
  border-radius: ${(props) => props.borderRadius};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const StyledControls = styled.div`
  ${tw`absolute bottom-8 w-80 left-8 bg-white bg-opacity-20 backdrop-blur-xl p-4 rounded-2xl text-white`}
`;

const StyledControlGroup = styled.div`
  ${tw`flex items-center space-x-2`}
`;

const StyledSlider = styled.input`
  ${tw`w-full`}
`;

const useLyricViewLayout = () => {
  const [transform, setTransform] = useState(() => {
    const savedTransform = localStorage.getItem("lyricViewLayout");
    return savedTransform ? JSON.parse(savedTransform) : {
      scale: 1,
      translateX: 0,
      translateY: 0,
      borderRadius: 0,
      width: 100,
      height: 100,
    };
  });

  useEffect(() => {
    localStorage.setItem("lyricViewLayout", JSON.stringify(transform));
  }, [transform]);

  return { transform, setTransform };
};

const Transformable: React.FC<TransformableProps> = ({ children, editable }) => {
  const { transform, setTransform } = useLyricViewLayout();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    property: keyof typeof transform
  ) => {
    setTransform({
      ...transform,
      [property]: Number(e.target.value),
    });
  };

  return (
    <StyledContainer>
      {editable && <StyledGridOverlay />}

      {/* Transformable Child */}
      <StyledChildContainer
        transform={`translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`}
        borderRadius={`${transform.borderRadius}%`}
        width={`${transform.width}%`}
        height={`${transform.height}%`}
      >
        {children}
      </StyledChildContainer>

      {/* Controls */}
      {editable && (
        <StyledControls>
          <div tw="space-y-4">
            <StyledControlGroup>
              <label htmlFor="scale" tw="w-24">Scale:</label>
              <StyledSlider
                id="scale"
                type="range"
                step="0.1"
                min="0.1"
                max="3"
                value={transform.scale}
                onChange={(e) => handleInputChange(e, "scale")}
              />
            </StyledControlGroup>
            <StyledControlGroup>
              <label htmlFor="translateX" tw="w-24">X:</label>
              <StyledSlider
                id="translateX"
                type="range"
                min="-200"
                max="200"
                value={transform.translateX}
                onChange={(e) => handleInputChange(e, "translateX")}
              />
            </StyledControlGroup>
            <StyledControlGroup>
              <label htmlFor="translateY" tw="w-24">Y:</label>
              <StyledSlider
                id="translateY"
                type="range"
                min="-200"
                max="200"
                value={transform.translateY}
                onChange={(e) => handleInputChange(e, "translateY")}
              />
            </StyledControlGroup>
            <StyledControlGroup>
              <label htmlFor="borderRadius" tw="w-24">Edges:</label>
              {transform.borderRadius}%
              <StyledSlider
                id="borderRadius"
                type="range"
                min="0"
                max="50"
                value={transform.borderRadius}
                onChange={(e) => handleInputChange(e, "borderRadius")}
              />
            </StyledControlGroup>
            <StyledControlGroup>
              <label htmlFor="width" tw="w-24">Width:</label>
              <StyledSlider
                id="width"
                type="range"
                min="10"
                max="100"
                value={transform.width}
                onChange={(e) => handleInputChange(e, "width")}
              />
            </StyledControlGroup>
            <StyledControlGroup>
              <label htmlFor="height" tw="w-24">Height:</label>
              <StyledSlider
                id="height"
                type="range"
                min="10"
                max="100"
                value={transform.height}
                onChange={(e) => handleInputChange(e, "height")}
              />
            </StyledControlGroup>
          </div>
        </StyledControls>
      )}
    </StyledContainer>
  );
};

export default Transformable;
export { useLyricViewLayout };
