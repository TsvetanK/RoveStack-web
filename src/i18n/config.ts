export const locales = ["en", "de", "fr", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  en: { name: "English", nativeName: "English",  flag: "🇬🇧" },
  de: { name: "German",  nativeName: "Deutsch",  flag: "🇩🇪" },
  fr: { name: "French",  nativeName: "Français", flag: "🇫🇷" },
  es: { name: "Spanish", nativeName: "Español",  flag: "🇪🇸" },
};
