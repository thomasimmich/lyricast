import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import Draggable from "react-draggable";
import { IoEye, IoEyeOff, IoPause, IoPlay } from "react-icons/io5";
import styled from "styled-components";
import tw from "twin.macro";

interface LyricViewControlsProps {
  isOverlayVisible: boolean;
  isPlaying: boolean;
  handlePlayPause: () => void;
  bpm: number;
  volume: number;
  volumeThreshold: number;
  changeVolumeThreshold: (volumeThreshold: number) => void;
  pitch: number;
  pitchMargin: number;
  changePitchMargin: (pitchMargin: number) => void;
  navigateBack: () => void;
  isLayoutEditable: boolean;
  setLayoutEditMode: (isEditable: boolean) => void;
}

export const LyricViewControls: React.FC<LyricViewControlsProps> = ({
  isOverlayVisible,
  isPlaying,
  handlePlayPause,
  bpm,
  volume,
  volumeThreshold,
  changeVolumeThreshold,
  pitch,
  pitchMargin,
  changePitchMargin,
  navigateBack,
  isLayoutEditable,
  setLayoutEditMode,
}) => {
  return (
    <div>
      {isLayoutEditable && (
        <motion.div
          animate={{ opacity: 1, scale: 1, display: "flex" }}
          tw="fixed top-10 right-10 bg-white text-white bg-opacity-20 backdrop-blur-xl px-4 rounded-full py-2 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={() => setLayoutEditMode(false)}
        >
          Done
        </motion.div>
      )}

      {isOverlayVisible && (
        <motion.div
          animate={{ opacity: 1, scale: 1, display: "flex" }}
          tw="fixed top-10 right-10 bg-white text-white backdrop-blur-xl bg-opacity-20 rounded-full p-2 text-3xl cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={navigateBack}
        >
          <IoClose />
        </motion.div>
      )}

      <FloatingSettingsPanel
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
        bpm={bpm}
        pitch={pitch}
        pitchMargin={pitchMargin}
        volume={volume}
        volumeThreshold={volumeThreshold}
        changeVolumeThreshold={changeVolumeThreshold}
        changePitchMargin={changePitchMargin}
        setLayoutEditMode={setLayoutEditMode}
      />
    </div>
  );
};

interface FloatingSettingsPanelProps {
  isPlaying: boolean;
  bpm: number;
  pitch: number;
  pitchMargin: number;
  volume: number;
  volumeThreshold: number;
  changeVolumeThreshold: (value: number) => void;
  changePitchMargin: (value: number) => void;
  setLayoutEditMode: (isEditable: boolean) => void;
  handlePlayPause: () => void;
}

const StyledPanel = styled.div`
  ${tw`fixed pt-3 p-4 top-10 w-64 left-10 bg-gray-700 bg-opacity-30 backdrop-blur-xl overflow-hidden rounded-xl flex flex-col`}
`;

const StyledHeader = styled.div`
  ${tw`text-white cursor-move flex justify-between items-center`}
`;

const StyledButton = styled.button`
  ${tw`w-full text-center py-2 bg-white bg-opacity-5 rounded-lg transition`}
`;

const StyledSliderContainer = styled.div`
  ${tw`w-40`}
`;

const FloatingSettingsPanel: React.FC<FloatingSettingsPanelProps> = ({
  isPlaying,
  bpm,
  pitch,
  pitchMargin,
  volume,
  volumeThreshold,
  changeVolumeThreshold,
  changePitchMargin,
  setLayoutEditMode,
  handlePlayPause,
}) => {
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const togglePanelVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPanelVisible((prev) => !prev);
  };

  return (
    <Draggable handle=".handle">
      <StyledPanel>
        <StyledHeader className="handle">
          <span tw="font-semibold">Settings</span>
          <div onClick={togglePanelVisibility}>
            {isPanelVisible ? <IoEyeOff /> : <IoEye />}
          </div>
        </StyledHeader>

        {isPanelVisible && (
          <div tw="space-y-4 mt-3 text-white">
            <div tw="flex space-x-4 items-center">
              <button
                tw="px-5 h-16 text-3xl py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
              >
                {isPlaying ? <IoPause /> : <IoPlay />}
              </button>
              <div>
                <p tw="text-sm">
                  Tempo: <span tw="font-semibold">{bpm.toFixed(2)} BPM</span>
                </p>
                <p tw="text-sm">
                  Pitch: <span tw="font-semibold">{pitch.toFixed(2)} Hz</span>
                </p>
                <p tw="font-medium mb-2">Volume: {volume.toFixed(2)} dB</p>
              </div>
            </div>

            <StyledSliderContainer>
              <p tw="font-medium mb-2">Pitch Margin: {pitchMargin}</p>
              <input
                tw="w-full"
                type="range"
                min="-1"
                max="100"
                value={pitchMargin}
                onChange={(e) => changePitchMargin(parseInt(e.target.value))}
              />
            </StyledSliderContainer>

            <div>
              <p tw="font-medium mb-2">Threshold: {volumeThreshold}</p>
              <input
                tw="w-full"
                type="range"
                min="0"
                max="100"
                value={volumeThreshold}
                onChange={(e) =>
                  changeVolumeThreshold(parseInt(e.target.value))
                }
              />
            </div>

            <StyledButton onClick={() => setLayoutEditMode(true)}>
              Edit Layout
            </StyledButton>
          </div>
        )}
      </StyledPanel>
    </Draggable>
  );
};

export default FloatingSettingsPanel;
