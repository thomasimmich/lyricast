import { useState, useEffect } from "react";
import { useStateContext } from "../contexts";
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
  const { userId } = useStateContext();
  const [transform, setTransform] = useState(defaultTransform);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabaseClient
        .from(SupabaseTable.SETTINGS)
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        // No rows found
        const { data: newData, error: insertError } = await supabaseClient
          .from(SupabaseTable.SETTINGS)
          .insert([{ user_id: userId, ...defaultTransform }])
          .select()
          .single();
        if (insertError) console.error("Error inserting:", insertError);
        else setTransform(newData);
      } else if (data) {
        setTransform(data);
      } else {
        console.error("Error fetching settings:", error);
      }
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
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setTransform({
            scale: payload.new.scale,
            translate_x: payload.new.translate_x,
            translate_y: payload.new.translate_y,
            border_radius: payload.new.border_radius,
            width: payload.new.width,
            height: payload.new.height,
          });
        },
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return { transform, setTransform };
};
