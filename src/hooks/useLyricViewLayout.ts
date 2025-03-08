import { useEffect, useState } from "react";
import { SupabaseTable } from "../interfaces/enums";
import supabaseClient from "../lib/supabase";

const defaultTransform: Transform = {
  scale: 1,
  translate_x: 0,
  translate_y: 0,
  border_radius: 0,
  width: 100,
  height: 100,
};

export const useLyricViewLayout = () => {
  const [transform, setTransform] = useState(defaultTransform);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabaseClient.from(SupabaseTable.SETTINGS).select("*");

      if (error) {
        console.error("Error fetching settings", error);
        return;
      }
      setTransform(data[0]);
    };

    fetchSettings();

    const channel = supabaseClient
      .channel("realtime-lyric-view")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: SupabaseTable.SETTINGS,
          filter: `id=eq.global`,
        },
        (payload) => {
          console.log("Updated settings", payload.new);
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
  }, []);

  return { transform, setTransform };
};
