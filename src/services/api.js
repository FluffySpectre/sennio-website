import cachedJSONFetch from "../cached-fetch";

export const getLastPlayedGames = async () => {
  // const backendAPI = "http://localhost/website-backend/last-played-games";
  const backendAPI = "https://sennio.de/website-backend/last-played-games";
  const response = await cachedJSONFetch(backendAPI, 60000);
  return response.games;
};
