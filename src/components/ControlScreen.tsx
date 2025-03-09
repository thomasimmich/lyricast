import React from "react";
import { IoMusicalNotes } from "react-icons/io5";
import styled from "styled-components";
import tw from "twin.macro";
import dummy from "../assets/images/dummy.webp";
import { useLyricSession } from "../hooks/useLyricSession";
import { useLyricViewLayout } from "../hooks/useLyricViewLayout";
import { SupabaseTable } from "../interfaces/enums";
import supabaseClient from "../lib/supabase";

const StyledPageWrapper = styled.div`
  ${tw`bg-black lg:pb-8 xl:pb-4 p-5 space-x-4 w-screen h-screen flex fixed top-0 left-0`}
`;

const StyledLabel = styled.label`
  ${tw`w-28 font-medium`}
`;

const StyledInput = styled.input`
  ${tw`w-32`}
`;

const StyledButton = styled.button`
  ${tw`w-full backdrop-blur-xl mt-4 text-center py-3 bg-white font-semibold bg-opacity-5 rounded-xl transition`}
`;

const ControlScreen = ({ lyric, navigateBack }: { lyric: Lyric; navigateBack: () => void }) => {
  const {
    isPlaying,
    bpm,
    setBpm,
    handlePlayPause,
    handleScreenClick,
    volumeThreshold,
    changeVolumeThreshold,
    isLyricOverlayVisible,
    pitchMargin,
    tabKey,
    changePitchMargin,
  } = useLyricSession();
  const { transform, setTransform } = useLyricViewLayout();
  const { title, text, image } = lyric;

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, property: keyof typeof transform) => {
    const newTransform = { ...transform, [property]: Number(e.target.value) };
    setTransform(newTransform);
    const { error } = await supabaseClient
      .from(SupabaseTable.SETTINGS)
      .update({ [property]: Number(e.target.value) })
      .eq("id", "global");
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

  const updateSession = async (bpm: number, pitchMargin: number, volumeThreshold: number) => {
    const { error } = await supabaseClient
      .from("sessions")
      .update({
        bpm,
        pitch_margin: pitchMargin,
        threshold: volumeThreshold,
      })
      .eq("id", "global");

    if (error) {
      console.error("Error updating session", error);
    }
  };

  const handleChangePitchMargin = (value: number) => {
    updateSession(bpm, value, volumeThreshold);
    changePitchMargin(value);
  };

  const handleChangeVolumeThreshold = (value: number) => {
    updateSession(bpm, pitchMargin, value);
    changeVolumeThreshold(value);
  };

  const handleChangeBPM = (value: number) => {
    updateSession(value, pitchMargin, volumeThreshold);
    setBpm(value);
  };

  return (
    <div tw="z-[200]">
      <StyledPageWrapper>
        <div tw="w-3/4 flex flex-col space-y-4 h-full">
          <div tw="flex w-full h-1/2 space-x-4">
            <div tw="bg-white p-4 bg-opacity-10 rounded-2xl w-1/3">
              <div
                style={{
                  backgroundImage: image ? `url(${dummy})` : "",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                tw=" w-full h-3/4 rounded-xl flex items-end justify-center text-[10rem] bg-yellow-500 text-white/60"
              >
                {!image && (
                  <div tw="h-full flex items-center">
                    <IoMusicalNotes />
                  </div>
                )}
              </div>

              <div tw="w-60">
                <h1 tw="text-xl mt-6 font-bold">{title}</h1>
                <p tw="mt-1">{text}</p>
              </div>
            </div>

            <div tw="bg-white flex  bg-opacity-10 rounded-2xl w-2/3">
              <div tw="space-y-4 w-1/2 p-4 mt-3 text-white">
                <div className="handle" tw="text-white flex justify-between items-center">
                  <span tw="font-semibold text-lg">Session Controls</span>
                </div>
                <div tw="flex items-center justify-between">
                  <StyledLabel htmlFor="pitchMargin">Pitch Margin: {pitchMargin}</StyledLabel>
                  <StyledInput
                    id="pitchMargin"
                    type="range"
                    min="-1"
                    max="100"
                    value={pitchMargin}
                    onChange={(e) => handleChangePitchMargin(parseInt(e.currentTarget.value))}
                  />
                </div>
                <div tw="flex items-center justify-between">
                  <StyledLabel htmlFor="volumeThreshold">Threshold: {volumeThreshold} </StyledLabel>
                  <StyledInput
                    id="volumeThreshold"
                    type="range"
                    min="0"
                    max="100"
                    value={volumeThreshold}
                    onChange={(e) => handleChangeVolumeThreshold(parseInt((e.target as HTMLInputElement).value))}
                  />
                </div>
                <div tw="flex items-center justify-between">
                  <StyledLabel htmlFor="bpm">BPM: {bpm} </StyledLabel>
                  <StyledInput
                    id="bpm"
                    type="range"
                    min="0"
                    max="300"
                    value={bpm}
                    onChange={(e) => handleChangeBPM(parseInt((e.target as HTMLInputElement).value))}
                  />
                </div>
              </div>
              <div tw="p-4">
                <p>TabKey: {tabKey}</p>
              </div>
            </div>
          </div>

          <div tw="bg-white bg-opacity-10 flex rounded-2xl w-full h-1/2">
            <div tw="p-4 w-2/3 h-full flex flex-col space-y-4">
              <TransformPreview transform={transform} />
            </div>
            <div tw="w-1/3 flex flex-col justify-between p-4 h-full">
              <div>
                <div className="handle" tw="text-white flex justify-between items-center">
                  <span tw="font-semibold text-lg">Transform Controls</span>
                </div>

                <div tw="space-y-4 mt-3 text-white">
                  {(
                    ["scale", "translate_x", "translate_y", "border_radius", "width", "height"] as (keyof Transform)[]
                  ).map((key) => (
                    <div key={key} tw="flex items-center justify-between">
                      <StyledLabel htmlFor={key}>{key.replace("_", " ")}:</StyledLabel>
                      <StyledInput
                        id={key}
                        type="range"
                        min={key === "scale" ? "0.1" : "-200"}
                        max={key === "scale" ? "3" : "200"}
                        step={key === "scale" ? "0.1" : "1"}
                        value={transform[key]}
                        onChange={(e) => handleInputChange(e, key as keyof typeof transform)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <StyledButton onClick={handleExport}>Download Settings</StyledButton>
            </div>
          </div>
        </div>
        <div
          tw="bg-yellow-500 overflow-hidden bg-opacity-10 p-4 rounded-2xl h-full w-1/4"
          style={{
            backgroundSize: "80px 80px",
            backgroundPosition: "center",
            backgroundImage:
              "linear-gradient(to right, #ffff001e 1px, transparent 1px), linear-gradient(to bottom, #ffff001e 1px, transparent 1px)",
          }}
        ></div>
      </StyledPageWrapper>
      {/* <StyledNavBarWrapper>
        <StyledAppText>Lyricast</StyledAppText>

        <div tw="space-x-4 flex items-center">
          <StyledStatusButton onClick={navigateBack}>Close</StyledStatusButton>
        </div>
      </StyledNavBarWrapper> */}
    </div>
  );
};

export default ControlScreen;

const StyledPreviewWrapper = styled.div`
  ${tw`relative w-full h-full flex items-center justify-center overflow-hidden`}
  background-size: 80px 80px;
  background-image:
    linear-gradient(to right, #ffff0053 1px, transparent 1px),
    linear-gradient(to bottom, #ffff0053 1px, transparent 1px);
  background-position: center;
`;

const TransformPreview: React.FC<{ transform: Transform }> = ({ transform }) => {
  return (
    <StyledPreviewWrapper>
      <div
        tw="bg-yellow-500 border-red-500 border-2"
        style={{
          width: `${transform.width}%`,
          height: `${transform.height}%`,
          transform: `translate(${transform.translate_x}px, ${transform.translate_y}px) scale(${transform.scale})`,
          borderRadius: `${transform.border_radius}px`,
          transition: "transform 0.3s ease, width 0.3s ease, height 0.3s ease, border-radius 0.3s ease",
        }}
      />
    </StyledPreviewWrapper>
  );
};
