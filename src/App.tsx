import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { uschiLyricsTabString } from "./assets/uschi/uschi-lyrics-tab";
import { LyricsSnippetDisplay } from "./components/LyricsSnippetDisplay";
import { getDictionaryFromLyricsTabString } from "./functions/getDictionaryFromLyricsTab";
import useMicrophone from "./hooks/useMicrophone";

function App() {
  const { volume } = useMicrophone();
  const [uschiTabString] = useState(
    getDictionaryFromLyricsTabString(uschiLyricsTabString)
  );

  // Map volume to size, adjust the scale factor as needed
  const size = Math.min(100 + volume * 2, 200); // Example scaling, adjust as necessary

  return (
    <div>
      {/* <header className="App-header">
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            backgroundColor: `rgb(0, ${volume > 0 ? 255 : 0}, 0)`, // Green if there's volume, otherwise black
            transition: "width 0.2s, height 0.2s, background-color 0.2s", // Smooth transitions for visual changes
          }}
        ></div>
      </header> */}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <LyricsSnippetDisplay
                bpm={135}
                lyricsTabDictionary={uschiTabString}
                volumeThreshold={8}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
