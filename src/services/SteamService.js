import reqmate from "reqmate";

class SteamService {
  async getLastPlayedGames() {
    const backendAPI = "http://localhost/website-backend/index.php";
    // const backendAPI = "https://sennio.de/website-backend";
    const response = await reqmate.get(backendAPI).setCaching(60000).send();
    const data = await response.data;
    return data.games;
  }
}

export default SteamService;
