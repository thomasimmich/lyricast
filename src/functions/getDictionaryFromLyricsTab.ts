import fs from "fs";

export function getDictionaryFromLyricsTabFile(
  filePath: string
): Record<string, string> {
  // Reading the text file content
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n");
  const tab: Record<string, string> = {};
  let currentSection = "";
  let lastBeat = "";

  lines.forEach((line) => {
    line = line.trim();
    if (line.endsWith("|")) {
      // Set the current section when encountering a line ending with '|'
      currentSection = line.slice(0, -1); // Remove the '|' at the end to get the section number
    } else if (line) {
      // Split the line by spaces to separate beats and lyrics
      const parts = line.split(" ");
      const firstPart = parts[0];
      const lyrics = parts.slice(1).join(" ");

      if (firstPart === "u") {
        // When the line starts with 'u', append it to the last beat within the current section
        const key = `${currentSection}|${lastBeat}u`;
        tab[key] = lyrics || ""; // Ensure that an empty string is set if there are no lyrics
      } else {
        // Update lastBeat and record every beat
        lastBeat = firstPart;
        const key = `${currentSection}|${lastBeat}`;
        tab[key] = lyrics || ""; // Ensure that an empty string is set if there are no lyrics
      }
    }
  });

  return tab;
}
