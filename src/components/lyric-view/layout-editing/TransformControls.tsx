import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { SupabaseTable } from "../../../interfaces/enums";
import supabaseClient from "../../../lib/supabase";

interface TransformControlsProps {
  transform: any;
  setTransform: (transform: any) => void;
  userId: string;
}

const StyledControlPanel = styled.div`
  ${tw`fixed pt-3 p-4 bottom-10 w-64 left-10 bg-gray-700 bg-opacity-30 backdrop-blur-xl overflow-hidden rounded-xl flex flex-col`}
`;

const StyledLabel = styled.label`
  ${tw`w-24 font-medium`}
`;

const StyledInput = styled.input`
  ${tw`w-32`}
`;

const StyledButton = styled.button`
  ${tw`w-full text-center py-2 bg-white bg-opacity-5 rounded-lg transition`}
`;

export const TransformControls: React.FC<TransformControlsProps> = ({
  transform,
  setTransform,
  userId,
}) => {
  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    property: keyof typeof transform,
  ) => {
    const newTransform = { ...transform, [property]: Number(e.target.value) };
    setTransform(newTransform);
    const { error } = await supabaseClient
      .from(SupabaseTable.SETTINGS)
      .update({ [property]: Number(e.target.value) })
      .eq("user_id", userId);
    if (error) console.error("Error updating in Supabase:", error);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(transform, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transform-settings.json";
    link.click();
  };

  return (
    <StyledControlPanel>
      <div
        className="handle"
        tw="text-white cursor-move flex justify-between items-center"
      >
        <span tw="font-semibold">Transform Controls</span>
      </div>

      <div tw="space-y-4 mt-3 text-white">
        {[
          "scale",
          "translate_x",
          "translate_y",
          "border_radius",
          "width",
          "height",
        ].map((key) => (
          <div key={key} tw="flex items-center justify-between">
            <StyledLabel htmlFor={key}>{key.replace("_", " ")}:</StyledLabel>
            <StyledInput
              id={key}
              type="range"
              min={key === "scale" ? "0.1" : "-200"}
              max={key === "scale" ? "3" : "200"}
              step={key === "scale" ? "0.1" : "1"}
              value={transform[key]}
              onChange={(e) =>
                handleInputChange(e, key as keyof typeof transform)
              }
            />
          </div>
        ))}

        <StyledButton onClick={handleExport}>Download Settings</StyledButton>
      </div>
    </StyledControlPanel>
  );
};
