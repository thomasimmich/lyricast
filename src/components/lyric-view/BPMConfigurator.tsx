import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";

const StyledButton = styled.button`
  ${tw`w-full  hover:bg-blue-600 text-center py-14 px-10 bg-blue-500 text-white font-bold rounded-lg text-2xl transition-all duration-100 shadow-lg border-t-0 border-b-4 border-blue-700`}

  &:active {
    ${tw`bg-blue-700 shadow-inner scale-95 transform border-t-0 border-b-4 border-blue-900 border-opacity-0`}
  }
`;

interface BPMConfiguratorProps {
  minBpm?: number;
  maxBpm?: number;
  requiredInitialTaps?: number;
}

interface BPMConfiguratorProps {
  minBpm?: number;
  maxBpm?: number;
  requiredInitialTaps?: number;
  onBpmChange?: (bpm: number) => void;
}

const BPMConfigurator: React.FC<BPMConfiguratorProps> = ({
  minBpm = 100,
  maxBpm = 130,
  requiredInitialTaps = 3,
  onBpmChange,
}) => {
  // State variables
  const [bpm, setBpm] = useState<number>(120);
  const [taps, setTaps] = useState<number[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(
    "Tap the button to detect BPM"
  );
  const [isPressed, setIsPressed] = useState<boolean>(false);

  // Constants
  const MS_PER_MINUTE = 60000;

  // Refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate time for break threshold (twice the current beat interval)
  const breakThreshold = (MS_PER_MINUTE / bpm) * 2;

  // Handle tap button click
  const handleTap = (): void => {
    const now = Date.now();
    const newTaps = [...taps, now];

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout for break detection
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
      setMessage("Tap the button to detect BPM");
      setTaps([]);
    }, breakThreshold);

    // Check if this is the first tap after a break
    if (!isActive) {
      setIsActive(true);
      setTaps([now]);
      setMessage(`Keep tapping (${requiredInitialTaps - 1} more taps needed)`);
      return;
    }

    setTaps(newTaps);

    // Only calculate BPM after required initial taps
    if (newTaps.length > requiredInitialTaps) {
      calculateBPM(newTaps);
    } else {
      setMessage(
        `Keep tapping (${requiredInitialTaps - newTaps.length} more taps needed)`
      );
    }
  };

  // Calculate BPM based on tap intervals
  const calculateBPM = (tapArray: number[]): void => {
    // Only use the last 8 taps (or fewer if not available)
    const recentTaps = tapArray.slice(-8);

    if (recentTaps.length < 2) return;

    // Calculate intervals between taps
    const intervals: number[] = [];
    for (let i = 1; i < recentTaps.length; i++) {
      intervals.push(recentTaps[i] - recentTaps[i - 1]);
    }

    // Calculate average interval
    const avgInterval =
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

    // Convert to BPM
    const calculatedBpm = Math.round(MS_PER_MINUTE / avgInterval);

    // Check if within allowed range
    if (calculatedBpm >= minBpm && calculatedBpm <= maxBpm) {
      setBpm(calculatedBpm);
      setMessage(`BPM: ${calculatedBpm} (within range ${minBpm}-${maxBpm})`);
      // Call the callback function if provided
      if (onBpmChange) {
        onBpmChange(calculatedBpm);
      }
    } else if (calculatedBpm < minBpm) {
      setMessage(
        `Tap faster (current: ~${calculatedBpm} BPM, min: ${minBpm} BPM)`
      );
    } else if (calculatedBpm > maxBpm) {
      setMessage(
        `Tap slower (current: ~${calculatedBpm} BPM, max: ${maxBpm} BPM)`
      );
    }
  };

  // Handle mouse/touch down event
  const handleMouseDown = (): void => {
    setIsPressed(true);
  };

  // Handle mouse/touch up event
  const handleMouseUp = (): void => {
    setIsPressed(false);
  };

  // Handle mouse/touch up event
  const handleTouchStart = (): void => {
    setIsPressed(true);
    handleTap();
  };

  // Handle mouse/touch up event
  const handleTouchEnd = (): void => {
    setIsPressed(false);
  };

  // Handle keyboard events for space key
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.code === "Space" && !isPressed) {
      event.preventDefault(); // Prevent page scrolling
      setIsPressed(true);
      handleTap();
    }
  };

  const handleKeyUp = (event: KeyboardEvent): void => {
    if (event.code === "Space" && isPressed) {
      event.preventDefault();
      setIsPressed(false);
    }
  };

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPressed]); // Re-add listeners when isPressed changes

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div tw="flex flex-col items-center justify-center p-6 bg-white bg-opacity-5 rounded-lg shadow-md">
      <StyledButton
        onClick={handleTap}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseLeave={() => isPressed && setIsPressed(false)}
       
      >
        <div>TAP for</div>
        <div>BPM</div>
      </StyledButton>

      <p tw="mt-8 text-white">{message}</p>

      {isActive && (
        <div tw="mt-6 w-full max-w-xs bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            tw="bg-blue-500 h-full transition-all duration-200"
            style={{
              width: `${Math.min(100, (taps.length / requiredInitialTaps) * 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BPMConfigurator;
