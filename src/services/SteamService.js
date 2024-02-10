import cachedJSONFetch from "../cached-fetch";

class SteamService {
  async getLastPlayedGames() {
    // const backendAPI = "http://localhost/website-backend/index.php";
    const backendAPI = "https://sennio.de/website-backend";
    const response = await cachedJSONFetch(backendAPI, 60000);
    return response.games;
  }
}

export default SteamService;
