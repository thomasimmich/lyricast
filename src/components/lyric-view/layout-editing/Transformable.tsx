import React, { ReactNode, useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useStateContext } from "../../../contexts";
import { SupabaseTable } from "../../../interfaces/enums";
import supabaseClient from "../../../lib/supabase";
import { TransformableLayout } from "./TransformableLayout";
import { TransformControls } from "./TransformControls";

interface TransformableProps {
  children: ReactNode;
  editable: boolean;
}

const Transformable: React.FC<TransformableProps> = ({ children, editable }) => {
  const { transform, setTransform } = useLyricViewLayout();
  const { userId } = useStateContext();

  return (
    <TransformableLayout transform={transform} editable={editable} setTransform={setTransform}>
      {children}
      {editable && (
        <Draggable handle=".handle">
          <TransformControls transform={transform} setTransform={setTransform} userId={userId || ""} />
        </Draggable>
      )}
    </TransformableLayout>
  );
};

export default Transformable;

const defaultTransform = {
  scale: 1,
  translate_x: 0,
  translate_y: 0,
  border_radius: 0,
  width: 100,
  height: 100,
};

const useLyricViewLayout = () => {
  const { userId } = useStateContext();
  const [transform, setTransform] = useState(defaultTransform);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabaseClient
        .from(SupabaseTable.SETTINGS)
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) console.error("Error fetching settings:", error);
      else setTransform(data || defaultTransform);
    };

    fetchSettings();
  }, [userId]);

  return { transform, setTransform };
};
