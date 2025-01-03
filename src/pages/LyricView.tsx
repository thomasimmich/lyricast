import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoClose, IoPlay } from "react-icons/io5";
import styled from "styled-components";
import tw from "twin.macro";
import { uschiLyricsDictionary } from "../assets/uschi/uschi.lyrics";
import { uschiPitchDictionary } from "../assets/uschi/uschi.pitches";
import { Lyric } from "../base/interfaces";
import { LyricsSnippetDisplay } from "../components/LyricsSnippetDisplay";
import Transformable from "../components/Transformable";
import { getDictionaryFromLyricsTabString } from "../functions/getDictionaryFromLyricsTab";
import useMicrophone from "../hooks/useMicrophone";

const StyledPageWrapper = styled(motion.div)`
  ${tw`top-0 left-0 w-screen h-screen fixed`}
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
  const [lyricsTabDictionary] = useState(
    getDictionaryFromLyricsTabString(uschiLyricsDictionary)
  );
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
          scale: 0.5,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          display: isVisible ? "block" : "none",
          y: isVisible ? 0 : 200,
          scale: isVisible ? 1 : 0.5,
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
          ;
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
          isLayoutEditable={false}
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
      <BackButton isVisible={isOverlayVisible} navigateBack={navigateBack} />
      <motion.div
        animate={{
          opacity: isOverlayVisible ? 1 : 0,
          y: isOverlayVisible ? 0 : 100,
        }}
        transition={{ duration: 0.5 }}
        tw="fixed text-white bottom-0 flex justify-between w-screen bg-black h-10"
      >
        <button tw="" onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <p>{bpm.toFixed(2)} BPM</p>
        <p>{volume.toFixed(2)} dB</p>
        <p>{pitch.toFixed(2)} Hz</p>

        <div>
          <input
            type="range"
            min="0"
            max="100"
            value={pitchMargin}
            onChange={(e) => changePitchMargin(parseInt(e.target.value))}
          />
          <p>{pitchMargin}</p>
        </div>
        <div>
          <input
            type="range"
            min="0"
            max="100"
            value={volumeThreshold}
            onChange={(e) => changeVolumeThreshold(parseInt(e.target.value))}
          />
          <p>{volumeThreshold}</p>
        </div>
        <button onClick={() => setLayoutEditMode(true)}>Edit Layout</button>
      </motion.div>

      <motion.div
        animate={{
          opacity: isLayoutEditable ? 1 : 0,
          scale: isLayoutEditable ? 1 : 0.9,
          display: isLayoutEditable ? "flex" : "none",
        }}
        tw="fixed top-10 right-10 bg-white text-black px-4 rounded-full py-2 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        onClick={(e) => {
          setLayoutEditMode(false);
        }}
      >
        Done
      </motion.div>
    </div>
  );
};

const useLyricViewState = () => {
  const { volume, pitch } = useMicrophone();
  const [isPlaying, setIsPlaying] = useState(true);
  const [volumeThreshold, setVolumeThreshold] = useState(0);
  const [pitchMargin, setPitchMargin] = useState(0);
  const { showTemporaryOverlay, isLyricOverlayVisible } =
    useIsLyricOverlayVisible();
  const bpm = useBpm(isPlaying);

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleScreenClick = () => showTemporaryOverlay();
  const changeVolumeThreshold = (volumeThreshold: number) =>
    setVolumeThreshold(volumeThreshold);
  const changePitchMargin = (pitchMargin: number) =>
    setPitchMargin(pitchMargin);

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

const BackButton = ({
  navigateBack,
  isVisible,
}: {
  navigateBack: () => void;
  isVisible: boolean;
}) => {
  return (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
      tw="fixed top-10 right-10 bg-white text-black text-opacity-40 rounded-full p-2 text-3xl cursor-pointer"
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
