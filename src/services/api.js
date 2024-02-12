import cachedJSONFetch from "../cached-fetch";

// const backendAPI = "http://localhost/website-backend";
const backendAPI = "https://sennio.de/website-backend";

// export const getLastPlayedGames = async () => {
//   const response = await cachedJSONFetch(
//     backendAPI + "/last-played-games",
//     60000
//   );
//   return response.games;
// };

export const getLastPlayedGames = async () => {
  let attempts = 0;

  const fetchWithTimeout = (url, timeout) => {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const signal = controller.signal;

      // timeout, which aborts the request
      const timer = setTimeout(() => {
        controller.abort();
        reject(new Error("Request timed out"));
      }, timeout);

      cachedJSONFetch(url, { signal }, 60000)
        .then((response) => {
          clearTimeout(timer);
          resolve(response);
        })
        .catch((err) => {
          clearTimeout(timer);
          // ignore abort errors
          if (err.name === "AbortError") {
            reject(new Error("Request was aborted"));
          } else {
            reject(err);
          }
        });
    });
  };

  const attemptFetch = async () => {
    try {
      const response = await fetchWithTimeout(
        backendAPI + "/last-played-games",
        1000
      );
      return response.games;
    } catch (error) {
      if (attempts < 3) {
        attempts++;
        console.log(`Attempt ${attempts}: Retrying...`);
        // recursive attempt
        return attemptFetch();
      } else {
        throw new Error("Max retries reached. " + error.message);
      }
    }
  };

  return attemptFetch();
};
