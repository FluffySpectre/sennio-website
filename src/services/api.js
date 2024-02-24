import extendedFetch from "../utils/extended-fetch";

// const backendAPI = "http://localhost/website-backend";
const backendAPI = "https://sennio.de/website-backend";

export const getLastPlayedGames = async () => {
  const response = await extendedFetch(backendAPI + "/last_played_games.json", {
    timeout: 2000,
    maxRetries: 120,
  });
  return response.lastPlayedGames;
};
