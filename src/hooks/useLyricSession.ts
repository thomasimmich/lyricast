import { useState, useEffect } from "react";
import { useIsLyricOverlayVisible } from "../components/lyric-view/LyricView";
import { useStateContext } from "../contexts";
import supabaseClient from "../lib/supabase";
import useMicrophone from "./useMicrophone";

export const useLyricSession = () => {
  const { userId } = useStateContext();
  const [isPlaying, setIsPlaying] = useState(true);
  const [volumeThreshold, setVolumeThreshold] = useState(0);
  const [pitchMargin, setPitchMargin] = useState(-1);
  const [bpm, setBpm] = useState(200);
  const [tabKey, setTabKey] = useState("");
  const { showTemporaryOverlay, isLyricOverlayVisible } = useIsLyricOverlayVisible();

  useEffect(() => {
    const setupSession = async () => {
      const { data: existingSession, error } = await supabaseClient
        .from("sessions")
        .select("*")
        .eq("user_id", userId)
        .single();

      const now = new Date().toISOString();

      if (error || !existingSession) {
        const { data, error: insertError } = await supabaseClient
          .from("sessions")
          .upsert([
            {
              user_id: userId,
              bpm: 200,
              pitch_margin: -1,
              threshold: 0,
              tab_key: "_",
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
          setTabKey(updatedSession.tab_key);
          console.log("Updated session", updatedSession.tab_key);
        }
      )
      .subscribe();
  }, [userId]);

  return {
    isPlaying,
    bpm,
    handlePlayPause: () => setIsPlaying((prev) => !prev),
    handleScreenClick: showTemporaryOverlay,
    isLyricOverlayVisible,
    setBpm,
    volumeThreshold,
    changeVolumeThreshold: setVolumeThreshold,
    tabKey,
    pitchMargin,
    changePitchMargin: setPitchMargin,
  };
};
