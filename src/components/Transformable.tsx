import React, { ReactNode, useEffect, useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import tw from "twin.macro";

import { useStateContext } from "../contexts";

import { SupabaseTable } from "../base/enums";
import supabaseClient from "../lib/supabase";

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
  background-image:
    linear-gradient(to right, yellow 1px, transparent 1px), linear-gradient(to bottom, yellow 1px, transparent 1px);
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

const defaultTransform = {
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
        { event: "UPDATE", schema: "public", table: SupabaseTable.SETTINGS, filter: `user_id=eq.${userId}` },
        (payload) => {
          setTransform({
            scale: payload.new.scale,
            translate_x: payload.new.translate_x,
            translate_y: payload.new.translate_y,
            border_radius: payload.new.border_radius,
            width: payload.new.width,
            height: payload.new.height,
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [userId]);

  // useEffect(() => {
  //   const updateSettings = async () => {
  //     const { error } = await supabaseClient.from(SupabaseTable.SETTINGS).update(transform).eq("user_id", userId);
  //     if (error) console.error("Update failed:", error);
  //   };

  //   updateSettings();
  // }, [transform, userId]);

  return { transform, setTransform };
};

const Transformable: React.FC<TransformableProps> = ({ children, editable }) => {
  const { transform, setTransform } = useLyricViewLayout();
  const { userId } = useStateContext();

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, property: keyof typeof transform) => {
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

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          try {
            const parsed = JSON.parse(result);
            setTransform(parsed);
          } catch (error) {
            console.error("Invalid JSON file.");
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <StyledContainer onDrop={handleFileDrop} onDragOver={handleDragOver}>
      {editable && <StyledGridOverlay />}

      <StyledChildContainer
        transform={`translate(${transform.translate_x}px, ${transform.translate_y}px) scale(${transform.scale})`}
        borderRadius={`${transform.border_radius}%`}
        width={`${transform.width}%`}
        height={`${transform.height}%`}
      >
        {children}
      </StyledChildContainer>

      {editable && (
        <Draggable handle=".handle">
          <div tw="fixed pt-3 p-4 bottom-10 w-64 left-10 bg-gray-700 bg-opacity-30 backdrop-blur-xl overflow-hidden rounded-xl flex flex-col">
            {/* Nur der Header ist jetzt draggable */}
            <div className="handle" tw="text-white cursor-move flex justify-between items-center">
              <span tw="font-semibold">Transform Controls</span>
            </div>

            <div tw="space-y-4 mt-3 text-white">
              <div tw="space-y-4">
                <div tw="flex items-center justify-between">
                  <label htmlFor="scale" tw="w-24 font-medium">
                    Scale:
                  </label>
                  <input
                    id="scale"
                    tw="w-32"
                    type="range"
                    step="0.1"
                    min="0.1"
                    max="3"
                    value={transform.scale}
                    onChange={(e) => handleInputChange(e, "scale")}
                  />
                </div>

                <div tw="flex items-center justify-between">
                  <label htmlFor="translate_x" tw="w-24 font-medium">
                    X:
                  </label>
                  <input
                    id="translate_x"
                    tw="w-32"
                    type="range"
                    min="-200"
                    max="200"
                    value={transform.translate_x}
                    onChange={(e) => handleInputChange(e, "translate_x")}
                  />
                </div>

                <div tw="flex items-center justify-between">
                  <label htmlFor="translate_y" tw="w-24 font-medium">
                    Y:
                  </label>
                  <input
                    id="translate_y"
                    tw="w-32"
                    type="range"
                    min="-200"
                    max="200"
                    value={transform.translate_y}
                    onChange={(e) => handleInputChange(e, "translate_y")}
                  />
                </div>

                <div tw="flex items-center justify-between">
                  <label htmlFor="borderRadius" tw="w-24 font-medium">
                    Border Radius:
                  </label>

                  <input
                    id="borderRadius"
                    tw="w-32"
                    type="range"
                    min="0"
                    max="50"
                    value={transform.border_radius}
                    onChange={(e) => handleInputChange(e, "border_radius")}
                  />
                </div>

                <div tw="flex items-center justify-between">
                  <label htmlFor="width" tw="w-24 font-medium">
                    Width:
                  </label>
                  <input
                    id="width"
                    tw="w-32"
                    type="range"
                    min="10"
                    max="100"
                    value={transform.width}
                    onChange={(e) => handleInputChange(e, "width")}
                  />
                </div>

                <div tw="flex items-center justify-between">
                  <label htmlFor="height" tw="w-24 font-medium">
                    Height:
                  </label>
                  <input
                    id="height"
                    tw="w-32"
                    type="range"
                    min="10"
                    max="100"
                    value={transform.height}
                    onChange={(e) => handleInputChange(e, "height")}
                  />
                </div>

                <button tw="w-full text-center py-2 bg-white bg-opacity-5 rounded-lg transition" onClick={handleExport}>
                  Download Settings
                </button>
              </div>
            </div>
          </div>
        </Draggable>
      )}
    </StyledContainer>
  );
};

export default Transformable;
export { useLyricViewLayout };
