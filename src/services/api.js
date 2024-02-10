import cachedJSONFetch from "../cached-fetch";

// const backendAPI = "http://localhost/website-backend";
const backendAPI = "https://sennio.de/website-backend";

export const getLastPlayedGames = async () => {
  const response = await cachedJSONFetch(
    backendAPI + "/last-played-games",
    60000
  );
  return response.games;
};
