import cachedJSONFetch from "../cached-fetch";

export const getLastPlayedGames = async () => {
  // const backendAPI = "http://localhost/website-backend/index.php";
  const backendAPI = "https://sennio.de/website-backend";
  const response = await cachedJSONFetch(backendAPI, 60000);
  return response.games;
};
