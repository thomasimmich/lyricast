import { motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import LyricView from "./LyricView";

const LyricList = ({}: { navigateBack: () => void }) => {
  const lyrics = useLyrics();

  return (
    <div>
      <div tw="w-full grid grid-cols-4 gap-4 h-fit p-10">
        {lyrics.map((lyric, idx) => (
          <LyricCard key={idx} lyric={lyric} idx={idx} />
        ))}
      </div>
    </div>
  );
};

export default LyricList;

const useLyrics = () => {
  const lyrics: Lyric[] = [
    {
      title: "Uschi",
      text: "Subtile Invasion",
    },
  ];

  return lyrics;
};

interface Lyric {
  title: string;
  text: string;
}

interface LyricCardProps {
  lyric: Lyric;
  idx: number;
}

const StyledLyricCard = styled(motion.div)`
  ${tw`bg-[#708ad7] text-[#EEEEEC] w-full h-40 p-4`}
`;

const LyricCard = ({ lyric, idx }: LyricCardProps) => {
  const [isLyricSelected, setIsLyricSelected] = useState(false);

  return (
    <div>
      <motion.div
        onClick={() => setIsLyricSelected(true)}
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.5 }}
        transition={{ delay: idx * 0.1 }}
      >
        <StyledLyricCard whileHover={{ scale: 1.05 }}>
          <p tw="text-2xl font-black">{lyric.title}</p>
          <p tw="text-lg mt-1">{lyric.text}</p>
        </StyledLyricCard>
      </motion.div>
      <LyricView isVisible={isLyricSelected} lyric={lyric} navigateBack={() => setIsLyricSelected(false)} />
    </div>
  );
};
