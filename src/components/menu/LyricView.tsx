import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { IoClose, IoEye, IoEyeOff, IoPause, IoPlay } from "react-icons/io5";
import styled from "styled-components";
import tw from "twin.macro";
import { uschiLyricsDictionary } from "../../assets/uschi/uschi.lyrics";
import { uschiPitchDictionary } from "../../assets/uschi/uschi.pitches";
import { Lyric } from "../../base/interfaces";
import { getDictionaryFromLyricsTabString } from "../../functions/getDictionaryFromLyricsTab";
import useMicrophone from "../../hooks/useMicrophone";
import { LyricsSnippetDisplay } from "../LyricsSnippetDisplay";
import Transformable from "../Transformable";

const StyledPageWrapper = styled(motion.div)`
  ${tw`top-0 z-[200] left-0 w-screen h-screen fixed`}
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const LyricView = ({
  lyric,
  navigateBack,
  isVisible,
}: {
  lyric: Lyric | null;
  navigateBack: () => void;
  isVisible: boolean;
}) => {
  const [lyricsTabDictionary] = useState(getDictionaryFromLyricsTabString(uschiLyricsDictionary));
  const {
    isPlaying,
    bpm,
    handlePlayPause,
    handleScreenClick,
    isLyricOverlayVisible,
    volume,
    volumeThreshold,
    changeVolumeThreshold,
    pitch,
    pitchMargin,
    changePitchMargin,
  } = useLyricViewState();
  const isLyricViewDisplayed = useIsLyricViewDisplayed(isVisible);
  const [isLayoutEditable, setIsLayoutEditable] = useState(false);

  return (
    isLyricViewDisplayed && (
      <StyledPageWrapper
        onClick={handleScreenClick}
        transition={{ duration: 0.5, type: "spring" }}
        initial={{
          opacity: 0,
          display: "none",
          y: 200,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          display: isVisible ? "block" : "none",
          y: isVisible ? 0 : 200,
        }}
      >
        <Transformable editable={isLayoutEditable}>
          <LyricsSnippetDisplay
            bpm={bpm}
            lyricsDictionary={lyricsTabDictionary}
            volume={volume}
            volumeThreshold={volumeThreshold}
            pitch={pitch}
            pitchMargin={pitchMargin}
            pitchesDictionary={uschiPitchDictionary}
          />
        </Transformable>
        <LyricViewOverlay
          navigateBack={navigateBack}
          isOverlayVisible={isLyricOverlayVisible && !isLayoutEditable}
          bpm={bpm}
          isPlaying={isPlaying}
          handlePlayPause={handlePlayPause}
          volume={volume}
          volumeThreshold={volumeThreshold}
          changeVolumeThreshold={changeVolumeThreshold}
          pitch={pitch}
          pitchMargin={pitchMargin}
          changePitchMargin={changePitchMargin}
          isLayoutEditable={isLayoutEditable}
          setLayoutEditMode={setIsLayoutEditable}
        />
      </StyledPageWrapper>
    )
  );
};

export default LyricView;

const LyricViewOverlay = ({
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
}: {
  isPlaying: boolean;
  handlePlayPause: () => void;
  bpm: number;
  volume: number;
  volumeThreshold: number;
  changeVolumeThreshold: (volumeThreshold: number) => void;
  pitch: number;
  pitchMargin: number;
  changePitchMargin: (pitchMargin: number) => void;
  isOverlayVisible: boolean;
  navigateBack: () => void;
  isLayoutEditable: boolean;
  setLayoutEditMode: (isEditable: boolean) => void;
}) => {
  return (
    <div>
      <motion.div
        tw="w-screen backdrop-blur flex justify-center items-center h-screen fixed top-0 left-0"
        initial={{ backgroundColor: "#00000000", display: "none" }}
        animate={{
          backgroundColor: isOverlayVisible ? "#00000040" : "#00000000",
          display: !isPlaying ? "flex" : "none",
        }}
      >
        <div tw="text-9xl text-white cursor-pointer" onClick={handlePlayPause}>
          <IoPlay />
        </div>
      </motion.div>
      <motion.div
        animate={{
          opacity: isLayoutEditable ? 1 : 0,
          scale: isLayoutEditable ? 1 : 0.9,
          display: isLayoutEditable ? "flex" : "none",
        }}
        tw="fixed top-10 right-10 bg-white text-white bg-opacity-20 backdrop-blur-xl px-4 rounded-full py-2 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        onClick={() => {
          setLayoutEditMode(false);
        }}
      >
        Done
      </motion.div>
      <BackButton isVisible={isOverlayVisible} navigateBack={navigateBack} />
      <FloatingPanel
        isPlaying={isPlaying}
        bpm={bpm}
        pitch={pitch}
        pitchMargin={pitchMargin}
        volume={volume}
        volumeThreshold={volumeThreshold}
        changeVolumeThreshold={changeVolumeThreshold}
        changePitchMargin={changePitchMargin}
        setLayoutEditMode={setLayoutEditMode}
        handlePlayPause={handlePlayPause}
      />
    </div>
  );
};

const useLyricViewState = () => {
  const { volume, pitch } = useMicrophone();
  const [isPlaying, setIsPlaying] = useState(true);
  const [volumeThreshold, setVolumeThreshold] = useState(0);
  const [pitchMargin, setPitchMargin] = useState(-1);
  const { showTemporaryOverlay, isLyricOverlayVisible } = useIsLyricOverlayVisible();
  const bpm = useBpm(isPlaying);

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleScreenClick = () => showTemporaryOverlay();
  const changeVolumeThreshold = (volumeThreshold: number) => setVolumeThreshold(volumeThreshold);
  const changePitchMargin = (pitchMargin: number) => setPitchMargin(pitchMargin);

  return {
    isPlaying,
    bpm,
    handlePlayPause,
    handleScreenClick,
    isLyricOverlayVisible,
    volume,
    volumeThreshold,
    changeVolumeThreshold,
    pitch,
    pitchMargin,
    changePitchMargin,
  };
};

const useBpm = (isPlaying: boolean) => {
  const [bpm, setBpm] = useState(200);

  useEffect(() => {
    setBpm(isPlaying ? 200 : 1);
  }, [isPlaying]);

  return bpm;
};

const useIsLyricViewDisplayed = (isVisible: boolean) => {
  const [isLyricViewDisplayed, setIsLyricViewDisplayed] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsLyricViewDisplayed(true);
    } else {
      setTimeout(() => setIsLyricViewDisplayed(false), 500);
    }
  }, [isVisible]);

  return isLyricViewDisplayed;
};

const useIsLyricOverlayVisible = () => {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setVisible(false), 4000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTemporaryOverlay = () => {
    setVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setVisible(false), 4000);
  };

  return { isLyricOverlayVisible: visible, showTemporaryOverlay };
};

const BackButton = ({ navigateBack, isVisible }: { navigateBack: () => void; isVisible: boolean }) => {
  return (
    <motion.div
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.9,
        display: isVisible ? "flex" : "none",
      }}
      tw="fixed top-10 right-10 bg-white text-white backdrop-blur-xl bg-opacity-20 rounded-full p-2 text-3xl cursor-pointer"
      whileHover={{ scale: 1.1 }}
      onClick={(e) => {
        e.stopPropagation();
        navigateBack();
      }}
    >
      <IoClose />
    </motion.div>
  );
};
type FloatingPanelProps = {
  isPlaying: boolean;
  bpm: number;
  pitch: number;
  pitchMargin: number;
  volume: number;
  volumeThreshold: number;
  changeVolumeThreshold: (volumeThreshold: number) => void;
  changePitchMargin: (pitchMargin: number) => void;
  setLayoutEditMode: (isEditable: boolean) => void;
  handlePlayPause: () => void;
};

const FloatingPanel: React.FC<FloatingPanelProps> = ({
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
}: FloatingPanelProps) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Draggable handle=".handle">
      <div tw="fixed pt-3 p-4 top-10 w-64 left-10 bg-gray-700 bg-opacity-30 backdrop-blur-xl overflow-hidden rounded-xl flex flex-col">
        <div className="handle" tw="text-white cursor-move flex justify-between items-center">
          <span tw="font-semibold">Settings</span>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(!isVisible);
            }}
          >
            {isVisible ? <IoEyeOff /> : <IoEye />}
          </div>
        </div>

        {isVisible ? (
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

            <div tw="w-40">
              <p tw="font-medium mb-2">Pitch Margin: {pitchMargin}</p>
              <input
                tw="w-full"
                type="range"
                min="-1"
                max="100"
                value={pitchMargin}
                onChange={(e) => changePitchMargin(parseInt(e.target.value))}
              />
            </div>

            <div>
              <p tw="font-medium mb-2">Threshold: {volumeThreshold}</p>
              <input
                tw="w-full"
                type="range"
                min="0"
                max="100"
                value={volumeThreshold}
                onChange={(e) => changeVolumeThreshold(parseInt(e.target.value))}
              />
            </div>

            <div>
              <button
                tw="w-full text-center py-2 bg-white bg-opacity-5 rounded-lg transition"
                onClick={() => setLayoutEditMode(true)}
              >
                Edit Layout
              </button>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    </Draggable>
  );
};
