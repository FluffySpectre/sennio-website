import cachedJSONFetch from "./cached-fetch";

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

const retryFetch = async (url, maxRetries = 3, timeout = 1000) => {
  let attempts = 0;
  try {
    const response = await fetchWithTimeout(url, timeout);
    return response;
  } catch (error) {
    if (attempts < maxRetries) {
      attempts++;
      console.log(`Attempt ${attempts}: Retrying...`);
      // recursive attempt
      return retryFetch();
    } else {
      throw new Error("Max retries reached. " + error.message);
    }
  }
};

export default retryFetch;
