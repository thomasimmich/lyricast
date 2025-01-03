import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoClose, IoPlay } from "react-icons/io5";
import styled from "styled-components";
import tw from "twin.macro";
import { uschiLyricsTabString } from "../assets/uschi/uschi-lyrics-tab";
import { Lyric } from "../base/interfaces";
import { LyricsSnippetDisplay } from "../components/LyricsSnippetDisplay";
import { getDictionaryFromLyricsTabString } from "../functions/getDictionaryFromLyricsTab";

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
  const [uschiTabString] = useState(getDictionaryFromLyricsTabString(uschiLyricsTabString));
  const {
    isPlaying,
    bpm,
    handlePlayPause,
    handleScreenClick,
    isLyricOverlayVisible,
    volumeThreshold,
    changeVolumeThreshold,
  } = useLyricViewState();
  const isLyricViewDisplayed = useIsLyricViewDisplayed(isVisible);

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
        <LyricsSnippetDisplay bpm={bpm} lyricsTabDictionary={uschiTabString} volumeThreshold={volumeThreshold} />;
        <LyricViewOverlay
          navigateBack={navigateBack}
          isOverlayVisible={isLyricOverlayVisible}
          bpm={bpm}
          isPlaying={isPlaying}
          handlePlayPause={handlePlayPause}
          volumeThreshold={volumeThreshold}
          changeVolumeThreshold={changeVolumeThreshold}
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
  volumeThreshold,
  changeVolumeThreshold,
  navigateBack,
}: {
  isPlaying: boolean;
  handlePlayPause: () => void;
  bpm: number;
  volumeThreshold: number;
  changeVolumeThreshold: (volume: number) => void;
  isOverlayVisible: boolean;
  navigateBack: () => void;
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
        animate={{ opacity: isOverlayVisible ? 1 : 0, y: isOverlayVisible ? 0 : 100 }}
        transition={{ duration: 0.5 }}
        tw="fixed text-white bottom-0 flex justify-between w-screen bg-black h-10"
      >
        <button tw="" onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <p>{bpm} BPM</p>
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
      </motion.div>
    </div>
  );
};

const useLyricViewState = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volumeThreshold, setVolumeThreshold] = useState(0);
  const { showTemporaryOverlay, isLyricOverlayVisible } = useIsLyricOverlayVisible();
  const bpm = useBpm(isPlaying);

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleScreenClick = () => showTemporaryOverlay();
  const changeVolumeThreshold = (volume: number) => setVolumeThreshold(volume);

  return {
    isPlaying,
    bpm,
    handlePlayPause,
    handleScreenClick,
    isLyricOverlayVisible,
    changeVolumeThreshold,
    volumeThreshold,
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
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
      tw="fixed top-10 right-10 bg-white text-black text-opacity-40 rounded-full p-2 text-3xl cursor-pointer"
      whileHover={{ scale: 1.1, opacity: 0.8 }}
      onClick={(e) => {
        e.stopPropagation();
        navigateBack();
      }}
    >
      <IoClose />
    </motion.div>
  );
};
