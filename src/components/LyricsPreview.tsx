import React, { useMemo, useState } from "react";

// Define types for our component
interface LyricPatch {
  id: string;
  text: string;
  startBar: number;
  startBeat: number;
  emoji?: string;
}

interface LyricPatchDisplayProps {
  lyricsData: string;
  className?: string;
}

/**
 * Parses lyrics data into patches where each patch is a continuous sequence of words
 */
const parseLyricPatches = (lyricsText: string): LyricPatch[] => {
  const lines = lyricsText.split("\n");
  const patches: LyricPatch[] = [];

  let currentBar = 0;
  let currentBeat = 0;
  let currentPatch = "";
  let patchStartBar = 0;
  let patchStartBeat = 0;
  let currentEmoji: string | undefined;

  // Process a line of content (either beat line or u-line)
  const processContent = (content: string) => {
    // Extract emoji if present
    const emojiMatch = content.match(/(🐳|🔴|🔲|📦|🟠|⏺️|▶️|🐋)/);
    const emoji = emojiMatch ? emojiMatch[1] : undefined;

    // Extract text, removing emojis and underscores
    let text = content
      .replace(/(🐳|🔴|🔲|📦|🟠|⏺️|▶️|🐋)/, "")
      .replace(/_+/g, "")
      .trim();

    if (text) {
      // Start new patch if there's an emoji or current patch is empty
      if (emoji || !currentPatch) {
        // Finalize previous patch if any
        if (currentPatch) {
          patches.push({
            id: `patch-${patches.length}`,
            text: currentPatch,
            startBar: patchStartBar,
            startBeat: patchStartBeat,
            emoji: currentEmoji,
          });
        }

        // Start new patch
        currentPatch = text;
        currentEmoji = emoji;
        patchStartBar = currentBar;
        patchStartBeat = currentBeat;
      } else {
        // Continue current patch
        if (text.startsWith("-")) {
          currentPatch += text.substring(1); // Hyphenated continuation
        } else if (currentPatch.endsWith("-")) {
          currentPatch = currentPatch.slice(0, -1) + text; // Hyphenated continuation
        } else {
          currentPatch += " " + text; // Space-separated continuation
        }
      }
    }
  };

  // Parse each line of the lyrics data
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Bar marker
    const barMatch = line.match(/^(\d+)\|$/);
    if (barMatch) {
      currentBar = parseInt(barMatch[1], 10);
      continue;
    }

    // Beat line
    const beatMatch = line.match(/^(\d)(.*)$/);
    if (beatMatch) {
      currentBeat = parseInt(beatMatch[1], 10);
      const content = beatMatch[2].trim();
      processContent(content);
      continue;
    }

    // U-line
    if (line.startsWith("u")) {
      const content = line.substring(1).trim();
      processContent(content);
      continue;
    }
  }

  // Add final patch if any
  if (currentPatch) {
    patches.push({
      id: `patch-${patches.length}`,
      text: currentPatch,
      startBar: patchStartBar,
      startBeat: patchStartBeat,
      emoji: currentEmoji,
    });
  }

  return patches;
};

/**
 * Component to display lyric patches as tiles
 */
const LyricPatchDisplay: React.FC<LyricPatchDisplayProps> = ({
  lyricsData,
  className = "",
}) => {
  const [sortBy, setSortBy] = useState<"bar" | "text">("bar");
  const [filterEmoji, setFilterEmoji] = useState<string | null>(null);

  // Parse the lyrics data
  const patches = useMemo(() => {
    return parseLyricPatches(lyricsData);
  }, [lyricsData]);

  // Get unique emojis for filtering
  const uniqueEmojis = useMemo(() => {
    const emojis = new Set<string>();
    patches.forEach((patch) => {
      if (patch.emoji) emojis.add(patch.emoji);
    });
    return Array.from(emojis);
  }, [patches]);

  // Apply sorting and filtering
  const displayPatches = useMemo(() => {
    // Filter by emoji if needed
    let filtered = filterEmoji
      ? patches.filter((patch) => patch.emoji === filterEmoji)
      : patches;

    // Sort the patches
    return [...filtered].sort((a, b) => {
      if (sortBy === "bar") {
        // Sort by bar and beat
        return a.startBar * 10 + a.startBeat - (b.startBar * 10 + b.startBeat);
      } else {
        // Sort alphabetically
        return a.text.localeCompare(b.text);
      }
    });
  }, [patches, sortBy, filterEmoji]);

  return (
    <div className={`lyrics-patch-display ${className}`}>
      <div className="flex justify-between mb-4 p-2 bg-gray-100 rounded">
        <div className="flex items-center">
          <label htmlFor="sort-select" className="mr-2 font-medium">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "bar" | "text")}
            className="border rounded px-2 py-1"
          >
            <option value="bar">Bar & Beat</option>
            <option value="text">Alphabetical</option>
          </select>
        </div>

        {uniqueEmojis.length > 0 && (
          <div className="flex items-center">
            <label htmlFor="emoji-select" className="mr-2 font-medium">
              Filter by emoji:
            </label>
            <select
              id="emoji-select"
              value={filterEmoji || ""}
              onChange={(e) => setFilterEmoji(e.target.value || null)}
              className="border rounded px-2 py-1"
            >
              <option value="">All</option>
              {uniqueEmojis.map((emoji) => (
                <option key={emoji} value={emoji}>
                  {emoji}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayPatches.map((patch) => (
          <div
            key={patch.id}
            className="lyrics-patch p-4 border rounded shadow hover:shadow-md transition-shadow"
          >
            {patch.emoji && <div className="text-2xl mb-2">{patch.emoji}</div>}
            <div className="font-bold mb-2 text-lg">{patch.text}</div>
            <div className="text-gray-500 text-sm">
              Bar {patch.startBar}, Beat {patch.startBeat}
            </div>
          </div>
        ))}
      </div>

      {displayPatches.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No lyrics patches found.
        </div>
      )}
    </div>
  );
};

/**
 * Main component that imports the lyrics data and renders the display
 */
export const LyricsPreview: React.FC<LyricPatchDisplayProps> = ({
  lyricsData,
}) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lyrics Patch Display</h1>
      <LyricPatchDisplay lyricsData={lyricsData} />
    </div>
  );
};
