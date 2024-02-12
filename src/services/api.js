import retryFetch from "../utils/retry-fetch";

// const backendAPI = "http://localhost/website-backend";
const backendAPI = "https://sennio.de/website-backend";

export const getLastPlayedGames = async () => {
  const response = await retryFetch(backendAPI + "/last-played-games", 3, 1000);
  return response.games;
};
