import styled from "styled-components";
import tw from "twin.macro";
import { Lyric } from "../../base/interfaces";
import LyricCard from "./LyricCard";

const StyledLyricWrapper = styled.div`
  ${tw`w-full grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-fit p-4 md:p-10`}
`;

const LyricList = () => {
  const lyrics = useLyrics();

  return (
    <StyledLyricWrapper>
      {lyrics.map((lyric, idx) => (
        <LyricCard key={idx} lyric={lyric} idx={idx} />
      ))}
    </StyledLyricWrapper>
  );
};

export default LyricList;

const useLyrics = () => {
  const lyrics: Lyric[] = [
    {
      title: "Uschi",
      text: "Subtile Invasion",
      image: "https://source.unsplash.com/1600x900/?music",
    },
    {
      title: "Lil Peep",
      text: "Star Shopping",
    },
    {
      title: "Lil Peep",
      text: "Life is Beautiful",
    },
  ];

  return lyrics;
};
