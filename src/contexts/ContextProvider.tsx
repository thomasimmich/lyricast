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
  const userId = "123"; // TODO: Get user ID from Auth0

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

