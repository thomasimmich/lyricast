import { motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { uschiLyricsDictionary } from "../../assets/uschi/uschi.lyrics";
import { uschiPitchDictionary } from "../../assets/uschi/uschi.pitches";
import { getDictionaryFromLyricsTabString } from "../../functions/getDictionaryFromLyricsTab";
import { LyricsSnippetDisplay } from "./LyricsSnippetDisplay";
import Transformable from "./layout-editing/Transformable";

const StyledDoneButton = styled(motion.div)`
  ${tw`fixed top-10 right-10 bg-opacity-20 bg-white text-white backdrop-blur-2xl px-4 rounded-full py-2 cursor-pointer`}
`;

const EditLyricLayoutView = () => {
  const [uschiTabString] = useState(
    getDictionaryFromLyricsTabString(uschiLyricsDictionary)
  );

  return (
    <div>
      <Transformable editable={true}>
        <LyricsSnippetDisplay
          startIndex={0}
          pitchesDictionary={uschiPitchDictionary}
          bpm={100}
          lyricsDictionary={uschiTabString}
          volumeThreshold={0}
          volume={0}
          pitch={0}
          pitchMargin={0}
        />
      </Transformable>

      <StyledDoneButton
        whileHover={{ scale: 1.1 }}
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Done
      </StyledDoneButton>
    </div>
  );
};

export default EditLyricLayoutView;
