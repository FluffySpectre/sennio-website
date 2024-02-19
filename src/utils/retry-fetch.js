import cachedJSONFetch from "./cached-fetch";

const fetchWithTimeout = async (url, timeout) => {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    return await Promise.race([
      cachedJSONFetch(url, { signal }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), timeout)
      ),
    ]);
  } finally {
    return controller.abort();
  }
};

const retryFetch = async (url, opts) => {
  const maxRetries = opts.maxRetries || 3;
  const timeout = opts.timeout || 1000;
  const msBetweenRetries = opts.msBetweenRetries || 500;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchWithTimeout(url, timeout);
    } catch (error) {
      console.log(`Attempt ${attempt}: ${error.message}`);
      if (attempt === maxRetries)
        throw new Error(`Max retries reached. ${error.message}`);
      // wait before the next attempt
      await new Promise((resolve) => setTimeout(resolve, msBetweenRetries));
    }
  }
};

export default retryFetch;
