import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { uschiLyricsDictionary } from "../../assets/uschi/uschi.lyrics";
import { uschiPitchDictionary } from "../../assets/uschi/uschi.pitches";
import { getDictionaryFromLyricsTabString } from "../../functions/getDictionaryFromLyricsTab";
import Transformable from "./layout-editing/Transformable";
import { LyricsSnippetDisplay } from "./LyricsSnippetDisplay";
import { LyricViewControls } from "./LyricViewControls";
import { useLyricSession } from "../../hooks/useLyricSession";
import useMicrophone from "../../hooks/useMicrophone";

const StyledLyricViewWrapper = styled(motion.div)`
  ${tw`top-0 z-[200] left-0 w-screen h-screen fixed`}
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

interface LyricViewProps {
  lyric: Lyric | null;
  navigateBack: () => void;
  isVisible: boolean;
}

const LyricView: React.FC<LyricViewProps> = ({ lyric, navigateBack, isVisible }) => {
  const [lyricsDictionary] = useState(getDictionaryFromLyricsTabString(uschiLyricsDictionary));
  const {
    isPlaying,
    bpm,
    handlePlayPause,
    handleScreenClick,
    volumeThreshold,
    changeVolumeThreshold,
    isLyricOverlayVisible,
    pitchMargin,
    changePitchMargin,
  } = useLyricSession();
  const { volume, pitch } = useMicrophone();
  const isLyricViewVisible = useIsLyricViewVisible(isVisible);
  const [isLayoutEditable, setIsLayoutEditable] = useState(false);

  return (
    isLyricViewVisible && (
      <StyledLyricViewWrapper
        onClick={handleScreenClick}
        transition={{ duration: 0.5, type: "spring" }}
        initial={{ opacity: 0, display: "none", y: 200 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          display: isVisible ? "block" : "none",
          y: isVisible ? 0 : 200,
        }}
      >
        <Transformable editable={isLayoutEditable}>
          <LyricsSnippetDisplay
            bpm={bpm}
            lyricsDictionary={lyricsDictionary}
            volume={volume}
            volumeThreshold={volumeThreshold}
            pitch={pitch}
            pitchMargin={pitchMargin}
            pitchesDictionary={uschiPitchDictionary}
          />
        </Transformable>

        <LyricViewControls
          navigateBack={navigateBack}
          isOverlayVisible={isLyricOverlayVisible && !isLayoutEditable}
          isPlaying={isPlaying}
          bpm={bpm}
          volume={volume}
          volumeThreshold={volumeThreshold}
          changeVolumeThreshold={changeVolumeThreshold}
          pitch={pitch}
          pitchMargin={pitchMargin}
          changePitchMargin={changePitchMargin}
          isLayoutEditable={isLayoutEditable}
          setLayoutEditMode={setIsLayoutEditable}
          handlePlayPause={handlePlayPause}
        />
      </StyledLyricViewWrapper>
    )
  );
};

export default LyricView;

export const useIsLyricViewVisible = (isVisible: boolean) => {
  const [isLyricViewVisible, setIsLyricViewVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsLyricViewVisible(true);
    } else {
      setTimeout(() => setIsLyricViewVisible(false), 500);
    }
  }, [isVisible]);

  return isLyricViewVisible;
};

export const useIsLyricOverlayVisible = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setIsOverlayVisible(false), 4000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTemporaryOverlay = () => {
    setIsOverlayVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsOverlayVisible(false), 4000);
  };

  return { isLyricOverlayVisible: isOverlayVisible, showTemporaryOverlay };
};
