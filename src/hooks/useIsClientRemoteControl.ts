import { useState, useEffect } from "react";

export const useIsClientRemoteControl = () => {
  const [isClientRemoteControl, setIsClientRemoteControl] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isRemoteControl = url.searchParams.get("remote-control") === "true";
    setIsClientRemoteControl(isRemoteControl);
  }, []);

  return isClientRemoteControl;
};
