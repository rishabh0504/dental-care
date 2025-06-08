"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

const DEFAULT_TRANSLATIONS = {
  en: {
    common: {
      loading: "Loading...",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
    },
    brand: {
      name: "DentalCare",
    },
    language: {
      english: "English",
      arabic: "العربية",
      switchLanguage: "Switch Language",
    },
  },
  ar: {
    common: {
      loading: "جاري التحميل...",
      cancel: "إلغاء",
      save: "حفظ",
      edit: "تعديل",
      delete: "حذف",
    },
    brand: {
      name: "دنتال كير",
    },
    language: {
      english: "English",
      arabic: "العربية",
      switchLanguage: "تغيير اللغة",
    },
  },
};

export type Language = "en" | "ar";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<string, any>>(
    DEFAULT_TRANSLATIONS["en"]
  );

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage === "en" || savedLanguage === "ar") {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
          console.error(
            `Failed to load translations: ${response.status} ${response.statusText}`
          );
          setTranslations(DEFAULT_TRANSLATIONS[language]);
          return;
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Failed to load translations:", error);
        setTranslations(DEFAULT_TRANSLATIONS[language]);
      }
    };

    loadTranslations();
  }, [language]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        let defaultValue: any = DEFAULT_TRANSLATIONS[language];
        for (const dk of keys) {
          if (
            defaultValue &&
            typeof defaultValue === "object" &&
            dk in defaultValue
          ) {
            defaultValue = defaultValue[dk];
          } else {
            return key;
          }
        }
        return typeof defaultValue === "string" ? defaultValue : key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  const isRTL = language === "ar";

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </TranslationContext.Provider>
  );
}
