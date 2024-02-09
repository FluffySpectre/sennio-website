let cache = {};

async function cachedJSONFetch(url, cacheMs) {
  if (cache[url] && Date.now() <= cache[url].ttl) {
    return cache[url].data;
  }

  return fetch(url).then(async (response) => {
    const data = await response.json();
    cache[url] = { data, ttl: Date.now() + cacheMs };
    return data;
  });
}

export default cachedJSONFetch;
