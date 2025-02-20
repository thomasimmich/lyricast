import { channel } from "diagnostics_channel";
import React, { ReactNode, useEffect, useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import tw from "twin.macro";
import { useStateContext } from "../../../contexts";
import { SupabaseTable } from "../../../interfaces/enums";
import supabaseClient from "../../../lib/supabase";
import { TransformableLayout } from "./TransformableLayout";

const StyledChildContainer = styled.div<{
  transform: string;
  borderRadius: string;
  width: string;
  height: string;
}>`
  ${tw` overflow-hidden flex justify-center items-center`}
  ${(props) => (props.borderRadius !== "0" ? ` twborder-2 border-red-500` : ``)}
  transform: ${(props) => props.transform};
  border-radius: ${(props) => props.borderRadius};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

interface TransformableProps {
  children: ReactNode;
  editable: boolean;
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

const Transformable: React.FC<TransformableProps> = ({
  children,
  editable,
}) => {
  const { transform, setTransform } = useLyricViewLayout();
  const { userId } = useStateContext();

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
    <div>
      <TransformableLayout
        transform={transform}
        editable={editable}
        setTransform={setTransform}
      >
        {children}
      </TransformableLayout>
      {editable && (
        <Draggable handle=".handle">
          <StyledControlPanel>
            <div
              className="handle"
              tw="text-white cursor-move flex justify-between items-center"
            >
              <span tw="font-semibold">Transform Controls</span>
            </div>

            <div tw="space-y-4 mt-3 text-white">
              {(
                [
                  "scale",
                  "translate_x",
                  "translate_y",
                  "border_radius",
                  "width",
                  "height",
                ] as (keyof Transform)[]
              ).map((key) => (
                <div key={key} tw="flex items-center justify-between">
                  <StyledLabel htmlFor={key}>
                    {key.replace("_", " ")}:
                  </StyledLabel>
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

              <StyledButton onClick={handleExport}>
                Download Settings
              </StyledButton>
            </div>
          </StyledControlPanel>
        </Draggable>
      )}
    </div>
  );
};

export default Transformable;

const defaultTransform: Transform = {
  scale: 1,
  translate_x: 0,
  translate_y: 0,
  border_radius: 0,
  width: 100,
  height: 100,
};
const useLyricViewLayout = () => {
  const { userId } = useStateContext();
  const [transform, setTransform] = useState(defaultTransform);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabaseClient
        .from(SupabaseTable.SETTINGS)
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        // No rows found
        const { data: newData, error: insertError } = await supabaseClient
          .from(SupabaseTable.SETTINGS)
          .insert([{ user_id: userId, ...defaultTransform }])
          .select()
          .single();
        if (insertError) console.error("Error inserting:", insertError);
        else setTransform(newData);
      } else if (data) {
        setTransform(data);
      } else {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();

    const channel = supabaseClient
      .channel("realtime-lyric-view")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: SupabaseTable.SETTINGS,
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setTransform({
            scale: payload.new.scale,
            translate_x: payload.new.translate_x,
            translate_y: payload.new.translate_y,
            border_radius: payload.new.border_radius,
            width: payload.new.width,
            height: payload.new.height,
          });
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return { transform, setTransform };
};
