export const REGION_FLAGS: Record<string, string> = {
  Europe: "🇪🇺",
  Asia: "🌏",
  "North America": "🌎",
  Africa: "🌍",
  "South America": "🌎",
  "Middle East": "🕌",
  Oceania: "🐨",
};

export function regionFlag(nameOrSlug: string): string {
  const key = Object.keys(REGION_FLAGS).find(
    (k) =>
      k.toLowerCase() === nameOrSlug.toLowerCase() ||
      k.toLowerCase().replace(/ /g, "-") === nameOrSlug.toLowerCase()
  );
  return key ? REGION_FLAGS[key] : "🌍";
}
