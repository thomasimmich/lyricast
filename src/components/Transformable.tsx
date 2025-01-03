import React, { useState, ReactNode } from "react";
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
  ${tw`absolute bottom-8 left-8 bg-gray-800 p-4 rounded-lg shadow-lg text-white`}
`;

const StyledControlGroup = styled.div`
  ${tw`flex items-center space-x-2`}
`;

const StyledSlider = styled.input`
  ${tw`w-full`}
`;

const Transformable: React.FC<TransformableProps> = ({ children, editable }) => {
  const [transform, setTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
    borderRadius: 0,
    width: 100,
    height: 100,
  });

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
          <div className="space-y-4">
            <StyledControlGroup>
              <label htmlFor="scale" className="w-24">Scale:</label>
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
              <label htmlFor="translateX" className="w-24">Translate X:</label>
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
              <label htmlFor="translateY" className="w-24">Translate Y:</label>
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
              <label htmlFor="borderRadius" className="w-24">Border Radius:</label>
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
              <label htmlFor="width" className="w-24">Width:</label>
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
              <label htmlFor="height" className="w-24">Height:</label>
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
