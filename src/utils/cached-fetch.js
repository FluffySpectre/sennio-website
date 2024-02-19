let cache = {};

const cachedJSONFetch = async (url, opts) => {
  if (cache[url] && Date.now() <= cache[url].ttl) {
    return cache[url].data;
  }

  const cacheMs = opts.cacheMs || 60000;

  return fetch(url, opts).then(async (response) => {
    const data = await response.json();
    cache[url] = { data, ttl: Date.now() + cacheMs };
    return data;
  });
};

export default cachedJSONFetch;
