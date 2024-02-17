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

const retryFetch = async (
  url,
  maxRetries = 3,
  timeout = 1000,
  msBetweenRetries = 500,
  attempt = 0
) => {
  try {
    const response = await fetchWithTimeout(url, timeout);
    return response;
  } catch (error) {
    if (attempt < maxRetries) {
      attempt++;
      console.log(`Attempt ${attempt}: Retrying...`);

      // wait a bit
      await new Promise((resolve) => setTimeout(resolve, msBetweenRetries));

      // recursive attempt
      return retryFetch(
        url,
        maxRetries,
        timeout,
        msBetweenRetries,
        attempt + 1
      );
    } else {
      throw new Error("Max retries reached. " + error.message);
    }
  }
};

export default retryFetch;
