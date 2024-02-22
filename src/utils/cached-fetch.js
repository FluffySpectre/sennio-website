let cache = {};

const withCache = (fetchFunction) => {
  return async (url, { cacheMs = 60000, ...opts } = {}) => {
    const cacheKey = url;
    if (cache[cacheKey] && Date.now() <= cache[cacheKey].ttl) {
      return cache[cacheKey].data;
    }

    const data = await fetchFunction(url, opts);

    cache[cacheKey] = { data, ttl: Date.now() + cacheMs };

    return data;
  };
};

export default withCache;
