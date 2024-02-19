let cache = {};

const withCache = (fetchFunction) => {
  return async (url, opts = {}) => {
    const cacheKey = url;
    if (cache[cacheKey] && Date.now() <= cache[cacheKey].ttl) {
      console.log("withCache FROM CACHE", "cacheKey=", cacheKey);
      return cache[cacheKey].data;
    }

    const data = await fetchFunction(url, opts);
    const cacheMs = opts.cacheMs || 60000;

    cache[cacheKey] = { data, ttl: Date.now() + cacheMs };

    return data;
  };
};

export default withCache;
