import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoExpand, IoMic, IoPlay, IoSparkles } from "react-icons/io5";
import styled from "styled-components";
import tw from "twin.macro";
import LyricList from "./LyricList";
import MicrophoneCheck from "./MicrophoneCheck";

const menuCards = [
  {
    title: "Select Lyric",
    text: "Select a lyric to get started",
    icon: <IoPlay />,
    color: "#EEEEEC",
    backgroundColor: "#3D65E1",
    content: LyricList,
  },
  {
    title: "Microphone Check",
    text: "Check your microphone",
    icon: <IoMic />,
    color: "#FA912C",
    backgroundColor: "#F4D4BD",
    content: MicrophoneCheck,
  },
  {
    title: "Generate Lyrics",
    text: "Generate lyrics for your song",
    icon: <IoSparkles />,
    color: "#3769E0",
    backgroundColor: "#E6C157",
    content: MicrophoneCheck,
  },
  {
    title: "Layout",
    text: "Change the layout of the lyric view.",
    icon: <IoExpand />,
    color: "#E7C152",
    backgroundColor: "#F49527",
  },
];

const StyledPageWrapper = styled.div`
  ${tw`bg-black w-screen overflow-hidden h-screen`}
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const StyledBackgroundDimmer = styled(motion.div)<{ isActive: boolean }>`
  ${tw`fixed inset-0 bg-black transition-all`}
`;

const Menu = () => {
  const [currentCard, setCurrentCard] = useState<number | null>(null);

  return (
    <StyledPageWrapper>
      {menuCards.map((card, index) => (
        <MenuCard key={index} card={card} idx={index} setCurrentCard={setCurrentCard} />
      ))}
      <StyledBackgroundDimmer
        animate={{
          display: currentCard !== null ? "block" : "none",
          opacity: currentCard !== null ? 0.5 : 0,
        }}
        isActive={currentCard !== null}
      />
    </StyledPageWrapper>
  );
};

export default Menu;

const StyledCardWrapper = styled(motion.div)`
  ${tw`absolute`}
`;

const StyledCard = styled(motion.div)<{ color: string; backgroundColor: string }>`
  ${tw`select-none w-full h-full`}
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledCardIcon = styled.div`
  ${tw`text-8xl`}
`;

const StyledCardTitle = styled.p`
  ${tw`text-5xl mt-10 font-black`}
`;

const StyledCardText = styled.p`
  ${tw`mt-4 text-3xl`}
`;

interface MenuCardProps {
  card: (typeof menuCards)[0];
  idx: number;
  setCurrentCard: (idx: number | null) => void;
}

const MenuCard = ({
  card: { title, text, icon, color, backgroundColor, content },
  idx,
  setCurrentCard,
}: MenuCardProps) => {
  const [isActive, setIsActive] = useState(false);
  const delay = useMenuCardDelay(idx);
  const animation = useNavCardAnimation(idx, isActive, delay);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (idx == 3) {
      window.location.href = "/edit-layout";
    } else {
      setCurrentCard(idx + 1);
      setIsActive((prev) => !prev);
    }
  };

  const handleOutsideClick = () => {
    setCurrentCard(null);
    setIsActive(false);
  };

  useOutsideClick(ref, handleOutsideClick, isActive);

  return (
    <StyledCardWrapper ref={ref} {...animation}>
      <StyledCard color={color} backgroundColor={backgroundColor}>
        <motion.div
          animate={{ display: isActive ? "none" : "flex", opacity: isActive ? 0 : 1, scale: isActive ? 0.5 : 1 }}
          onClick={handleClick}
          tw="h-full w-full"
        >
          <div tw="items-center justify-center h-full w-full flex flex-col">
            <StyledCardIcon>{icon}</StyledCardIcon>
            <StyledCardTitle>{title}</StyledCardTitle>
            <StyledCardText>{text}</StyledCardText>
          </div>
        </motion.div>
        <motion.div
          tw="h-full absolute top-0 w-full"
          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.5, display: isActive ? "block" : "none" }}
          initial={{ opacity: 0, scale: 0 }}
        >
          {content && content({ navigateBack: handleOutsideClick })}
        </motion.div>
      </StyledCard>
    </StyledCardWrapper>
  );
};

const useNavCardAnimation = (idx: number, isActive: boolean, delay: number) => {
  const zIndex = useZIndex(isActive);
  const initialTop = idx < 2 ? "-100%" : "100%";
  const initialLeft = idx % 2 === 0 ? "-100%" : "100%";
  const initialRotate = idx < 2 ? "-90deg" : "90deg";

  const normalTop = idx < 2 ? "0%" : "50%";
  const normalLeft = idx % 2 === 0 ? "0%" : "50%";
  const activeTop = "10%";
  const activeLeft = "10%";

  const top = isActive ? activeTop : normalTop;
  const left = isActive ? activeLeft : normalLeft;
  const rotate = "0deg";
  const width = isActive ? "80%" : "50%";
  const height = isActive ? "80%" : "50%";

  const animation = {
    initial: { top: initialTop, left: initialLeft, rotate: initialRotate },
    animate: { top, left, rotate, width, height, zIndex },
    transition: { type: "spring", duration: 1, delay: delay },
  };

  return animation;
};

const useZIndex = (isActive: boolean) => {
  const [zIndex, setZIndex] = useState(0);

  useEffect(() => {
    if (isActive) {
      setZIndex(1);
    } else {
      const timeout = setTimeout(() => setZIndex(0), 300);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  return zIndex;
};

const useMenuCardDelay = (idx: number) => {
  const [delay, setDelay] = useState(idx * 0.2);

  useEffect(() => {
    const timeout = setTimeout(() => setDelay(0), 300);
    return () => clearTimeout(timeout);
  }, []);

  return delay;
};

const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: () => void, isActive: boolean) => {
  const activeTimer = useRef<number | null>(null);

  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node) && isActive && activeTimer.current === null) {
      callback();
    }
  };

  useEffect(() => {
    if (isActive) {
      activeTimer.current = window.setTimeout(() => {
        activeTimer.current = null; // Timer abgelaufen, erlaubt den Callback
      }, 100);
    } else {
      if (activeTimer.current !== null) {
        clearTimeout(activeTimer.current);
        activeTimer.current = null; // Timer zurücksetzen
      }
    }
  }, [isActive]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isActive]);

  return null;
};
