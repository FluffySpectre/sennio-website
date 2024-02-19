const basicFetch = async (url, opts = {}) => {
  const response = await fetch(url, opts);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export default basicFetch;
