import { describe, expect, it } from "vitest";
import { getDictionaryFromLyricsTabFile } from "../src/functions/getDictionaryFromLyricsTab";

describe("Parser", () => {
  it(
    "should generate a dictionary from a lyrics tab file",
    async () => {
      const lyricsTabDictionary = getDictionaryFromLyricsTabFile(
        "src/assets/uschi/uschi-lyrics-tab.txt"
      );

      expect(lyricsTabDictionary["0|3u"]).toBe("Du");
      expect(lyricsTabDictionary["1|1"]).toBe("Ha");
      expect(lyricsTabDictionary["0|4u"]).toBe("die");
    },
    Infinity
  );
});
