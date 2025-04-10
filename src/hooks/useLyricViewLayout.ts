import { useEffect, useState } from "react";
import { SupabaseTable } from "../interfaces/enums";
import supabaseClient from "../lib/supabase";

interface Transform {
  scale: number;
  translate_x: number;
  translate_y: number;
  border_radius: number;
  width: number;
  height: number;
  font_size: number;
  rotation: number; 
}

const defaultTransform: Transform = {
  scale: 1,
  translate_x: 0,
  translate_y: 0,
  border_radius: 0,
  width: 100,
  height: 100,
  font_size: 1,
  rotation: 90,
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
      localStorage.setItem("font_size", data[0].font_size.toString());
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
          setTransform({
            scale: payload.new.scale,
            translate_x: payload.new.translate_x,
            translate_y: payload.new.translate_y,
            border_radius: payload.new.border_radius,
            width: payload.new.width,
            height: payload.new.height,
            font_size: payload.new.font_size,
            rotation: payload.new.rotation,
          });
          localStorage.setItem("font_size", payload.new.font_size.toString());
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return { transform, setTransform };
};
