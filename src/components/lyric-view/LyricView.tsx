import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { uschiLyricsDictionary } from "../../assets/uschi/uschi.lyrics";
import { uschiPitchDictionary } from "../../assets/uschi/uschi.pitches";
import { getDictionaryFromLyricsTabString } from "../../functions/getDictionaryFromLyricsTab";
import useMicrophone from "../../hooks/useMicrophone";
import supabaseClient from "../../lib/supabase";
import Transformable from "./layout-editing/Transformable";
import { LyricsSnippetDisplay } from "./LyricsSnippetDisplay";
import { LyricViewControls } from "./LyricViewControls";
import { useStateContext } from "../../contexts";

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
    volume,
    volumeThreshold,
    changeVolumeThreshold,
    isLyricOverlayVisible,
    pitch,
    pitchMargin,
    changePitchMargin,
  } = useLyricSession();

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

export const useLyricSession = () => {
  const { userId } = useStateContext();
  const { volume, pitch } = useMicrophone();
  const [isPlaying, setIsPlaying] = useState(true);
  const [volumeThreshold, setVolumeThreshold] = useState(0);
  const [pitchMargin, setPitchMargin] = useState(-1);
  const [bpm, setBpm] = useState(200);
  const { showTemporaryOverlay, isLyricOverlayVisible } = useIsLyricOverlayVisible();

  useEffect(() => {
    const setupSession = async () => {
      const { data: existingSession, error } = await supabaseClient
        .from("sessions")
        .select("*")
        .eq("user_id", userId)
        .single();

      const now = new Date().toISOString();

      if (error || !existingSession || new Date(existingSession.last_seen) < new Date(Date.now() - 120000)) {
        const { data, error: insertError } = await supabaseClient
          .from("sessions")
          .upsert([
            {
              user_id: userId,
              bpm: 200,
              pitch_margin: -1,
              threshold: 0,
              tab_key: "uschi",
              last_seen: now,
            },
          ])
          .select()
          .single();
        if (error) {
          console.error("Error fetching session", error);
        } else if (!insertError) {
          setBpm(data.bpm);
          setPitchMargin(data.pitch_margin);
          setVolumeThreshold(data.threshold);
        }
      } else {
        setBpm(existingSession.bpm);
        setPitchMargin(existingSession.pitch_margin);
        setVolumeThreshold(existingSession.threshold);
        console.log("Existing session", existingSession);
      }
    };

    setupSession();
  }, [userId]);

  useEffect(() => {
    const subscription = supabaseClient
      .channel("session_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const updatedSession = payload.new as Session;
          setBpm(updatedSession.bpm);
          setPitchMargin(updatedSession.pitch_margin);
          setVolumeThreshold(updatedSession.threshold);
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      supabaseClient.from("sessions").update({ last_seen: new Date().toISOString() }).eq("user_id", userId);
    }, 30000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [userId]);

  return {
    isPlaying,
    bpm,
    handlePlayPause: () => setIsPlaying((prev) => !prev),
    handleScreenClick: showTemporaryOverlay,
    isLyricOverlayVisible,
    volume,
    volumeThreshold,
    changeVolumeThreshold: setVolumeThreshold,
    pitch,
    pitchMargin,
    changePitchMargin: setPitchMargin,
  };
};

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
