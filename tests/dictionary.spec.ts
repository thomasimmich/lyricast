import { describe, expect, it } from "vitest";
import { uschiLyricsTabString } from "../src/assets/uschi/uschi-lyrics-tab";
import { getDictionaryFromLyricsTabString } from "../src/functions/getDictionaryFromLyricsTab";
import { getKeyFromMicroBeatIndex } from "../src/functions/getKeyFromMicroBeatIndex";

describe("Parser", () => {
  it(
    "should generate a dictionary from a lyrics tab file",
    async () => {
      const lyricsTabDictionary =
        getDictionaryFromLyricsTabString(uschiLyricsTabString);

      expect(lyricsTabDictionary["0|3u"]).toBe("Du__");
      expect(lyricsTabDictionary["1|1"]).toBe("🐳Haare_");
      expect(lyricsTabDictionary["0|4u"]).toBe("die");
    },
    Infinity
  );
});

describe("Mapper", () => {
  it(
    "should map micro beat indexes to dictonary keys",
    async () => {
      expect(getKeyFromMicroBeatIndex(0)).toBe("0|1");
      expect(getKeyFromMicroBeatIndex(1)).toBe("0|1u");
      expect(getKeyFromMicroBeatIndex(2)).toBe("0|2");
      expect(getKeyFromMicroBeatIndex(3)).toBe("0|2u");
      expect(getKeyFromMicroBeatIndex(15)).toBe("1|4u");
    },
    Infinity
  );
});
