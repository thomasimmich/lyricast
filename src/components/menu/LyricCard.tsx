import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { IoMusicalNotes, IoPlay } from "react-icons/io5";
import styled from "styled-components";
import tw from "twin.macro";
import dummy from "../../assets/images/dummy.webp";
import { Lyric } from "../../base/interfaces";
import LyricView from "./LyricView";

const StyledLyricCard = styled(motion.div)`
  ${tw`bg-white bg-opacity-15 backdrop-blur-xl overflow-hidden rounded-3xl w-full`}
`;

interface LyricCardProps {
  lyric: Lyric;
  idx: number;
}

type NewType = LyricCardProps;

const LyricCard = ({ lyric, idx }: NewType) => {
  const [isLyricSelected, setIsLyricSelected] = useState(false);
  const { title, image, text } = lyric;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fragment>
      <motion.div
        tw="h-fit"
        initial={{ scale: 0, y: -600 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          delay: idx * 0.1,
          type: "spring",
          duration: 0.6,
          bounce: 0.15,
        }}
      >
        <StyledLyricCard
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsLyricSelected(true)}
          whileHover={{ scale: 1.05 }}
          style={{
            boxShadow: isHovered
              ? "0px 4px 15px rgba(42, 42, 42, 0.5)"
              : "none",
          }}
        >
          <div
            style={{
              backgroundImage: image ? `url(${dummy})` : "",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            tw="w-full flex items-end justify-center text-[10rem] bg-yellow-500 text-white/60 h-[20rem] lg:h-[16rem]"
          >
            {!image && (
              <div tw="h-full flex items-center">
                <IoMusicalNotes />
              </div>
            )}
            <motion.div
              tw="absolute w-full h-full bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.1 : 0 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 20 : 200 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.15 }}
              tw="p-4 text-base absolute bg-black bg-opacity-10 backdrop-blur-xl w-full flex flex-col justify-between pb-12 h-48"
            >
              <div>
                <p tw="text-2xl mt-2 font-semibold">{title}</p>
                <p tw="mt-1 opacity-80">{text}</p>
              </div>
              <div tw="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-all cursor-pointer text-lg text-yellow-500">
                <IoPlay />
                <p>Start</p>
              </div>
            </motion.div>
          </div>
        </StyledLyricCard>
      </motion.div>

      {isLyricSelected && (
        <LyricView
          isVisible={isLyricSelected}
          lyric={lyric}
          navigateBack={() => setIsLyricSelected(false)}
        />
      )}
    </Fragment>
  );
};

export default LyricCard;
