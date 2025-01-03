import { motion } from "framer-motion";
import { IoCloseSharp } from "react-icons/io5";
import styled from "styled-components";
import tw from "twin.macro";
import useMicrophone from "../hooks/useMicrophone";

const StyledMicrophoneSymbol = styled.div<{ volume: number; size: number }>`
  ${tw`rounded-full `}
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: ${({ volume }) => (volume > 0 ? "#FA912C" : "#FA912C40")};
`;

const StyledCloseSymbol = styled(motion.div)`
  ${tw`absolute text-2xl rounded-full bg-red-500 size-12 bottom-10 flex justify-center items-center text-white cursor-pointer`}
`;

const MicrophoneCheck = ({ navigateBack }: { navigateBack: () => void }) => {
  const { volume, pitch } = useMicrophone();

  const size = Math.min(100 + volume * 2, 200);

  return (
    <div tw="w-full h-full flex justify-center items-center">
      <div>
        <StyledMicrophoneSymbol volume={volume} size={size} />
        <div>{pitch}</div>
      </div>

      <StyledCloseSymbol
        whileHover={{ scale: 1.1, opacity: 0.7 }}
        onClick={navigateBack}
      >
        <IoCloseSharp />
      </StyledCloseSymbol>
    </div>
  );
};

export default MicrophoneCheck;
