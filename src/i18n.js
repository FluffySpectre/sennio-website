import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          fakeLoadingScreen: {
            loadingStep1: "Loading projects...",
            loadingStep2: "Searching for bugs...",
            loadingStep3: "Creating additional bugs...",
            loadingStep4: "Recalibrating flux capacitor...",
            // loadingStep5: "Applying retro filter...",
          },

          title: "Hi there, I'm Björn",
          subTitle:
            "I like to build things and here you can find some of my projects",

          menuLinks: {
            projects: "Projects",
            aboutMe: "About Me",
            contact: "Contact",
            lastPlayedGames: "Last played",
          },

          followMe: "Follow me:",

          projectPage: {
            playButton: "PLAY",
            downloads: "DOWNLOADS",
          },

          githubLink: "More projects on GitHub",

          impressumLink: "Legal Notice",
        },
      },
      de: {
        translation: {
          fakeLoadingScreen: {
            loadingStep1: "Lade Projekte...",
            loadingStep2: "Suche nach Bugs...",
            loadingStep3: "Erstelle zusätzliche Bugs...",
            loadingStep4: "Kalibriere Fluxkompensator...",
            // loadingStep5: "Wende Retro-Filter an...",
          },

          title: "Hey, ich bin Björn",
          subTitle:
            "Hier findest Du einige meiner Games, Tools und anderer Projekte",

          menuLinks: {
            projects: "Projekte",
            aboutMe: "Über mich",
            contact: "Kontakt",
            lastPlayedGames: "Zuletzt gespielt",
          },

          followMe: "Folge mir:",

          projectPage: {
            playButton: "PLAY",
            downloads: "DOWNLOADS",
          },

          githubLink: "Weitere Projekte bei GitHub",

          impressumLink: "Impressum",
        },
      },
    },
  });

export default i18n;
