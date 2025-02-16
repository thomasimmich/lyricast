import { FC, createContext, useContext, useEffect, useState } from "react";
import supabaseClient from "../lib/supabase";

interface StateContextType {
  isScreenOverlayVisible: boolean;
  setIsScreenOverlayVisible: (isVisible: boolean) => void;
  userId: string | undefined;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};

interface StateProviderProps {
  children: React.ReactNode;
}

export const StateProvider: FC<StateProviderProps> = ({ children }) => {
  const [isScreenOverlayVisible, setIsScreenOverlayVisible] = useState(false);
  const userId = useUserId();

  const stateContextValue: StateContextType = {
    isScreenOverlayVisible,
    setIsScreenOverlayVisible,
    userId,
  };

  return (
    <StateContext.Provider value={stateContextValue}>
      {children}
    </StateContext.Provider>
  );
};

const useUserId = () => {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await supabaseClient.auth.getUser();
      const userId = user.data.user?.id;

      setUserId(userId || "undefined");
    };

    fetchUserData();
  }, []);

  return userId;
};
