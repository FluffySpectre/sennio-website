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
          title: "Hey, I'm Björn",
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
        },
      },
      de: {
        translation: {
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
        },
      },
    },
  });

export default i18n;
