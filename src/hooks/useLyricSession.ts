import { useCallback, useEffect, useState } from "react";
import { useIsLyricOverlayVisible } from "../components/lyric-view/LyricView";
import supabaseClient from "../lib/supabase";

export const useLyricSession = () => {
  const [volumeThreshold, setVolumeThreshold] = useState(0);
  const [pitchMargin, setPitchMargin] = useState(-1);
  const [bpm, setBpm] = useState(0);
  const [previousBpm, setPreviousBpm] = useState(0);
  const [tabKey, setTabKey] = useState("");
  const { showTemporaryOverlay, isLyricOverlayVisible } =
    useIsLyricOverlayVisible();

  useEffect(() => {
    const setupSession = async () => {
      const { data: existingSession, error } = await supabaseClient
        .from("sessions")
        .select("*");

      if (error) {
        console.error("Error fetching existing session", error);
        return;
      }

      if (existingSession.length > 0) {
        const session = existingSession[0];
        setBpm(session.bpm);
        setPitchMargin(session.pitch_margin);
        setVolumeThreshold(session.threshold);
      }
    };

    setupSession();
  }, []);

  useEffect(() => {
    setPreviousBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    const subscription = supabaseClient
      .channel("session_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "sessions",
          filter: `id=eq.global`,
        },
        async (payload) => {
          const updatedSession = payload.new as Session;
          setBpm(updatedSession.bpm);
          setPitchMargin(updatedSession.pitch_margin);
          setVolumeThreshold(updatedSession.threshold);
          setTabKey(updatedSession.tab_key);
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, []);

  const pause = useCallback(() => {
    setBpm(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ".") {
        event.preventDefault();

        pause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pause]);

  return {
    bpm,
    changeBpm: setBpm,
    handlePlayPause: () => setBpm(bpm <= 0 ? bpm : previousBpm),
    handleScreenClick: showTemporaryOverlay,
    isLyricOverlayVisible,
    volumeThreshold,
    changeVolumeThreshold: setVolumeThreshold,
    tabKey,
    pitchMargin,
    changePitchMargin: setPitchMargin,
  };
};
