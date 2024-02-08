class SteamService {
  async getLastPlayedGames() {
    // const backendAPI = "http://localhost/website-backend/index.php";
    const backendAPI = "https://sennio.de/website-backend";
    const response = await fetch(backendAPI);
    const data = await response.json();
    return data.games;
  }
}

export default SteamService;
