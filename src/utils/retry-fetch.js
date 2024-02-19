const withRetry = (fetchFunction) => {
  return async (url, opts = {}) => {
    const maxRetries = opts.maxRetries || 3;
    const msBetweenRetries = opts.msBetweenRetries || 500;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fetchFunction(url, opts);
      } catch (error) {
        console.log(`Attempt ${attempt}: ${error.message}`);
        if (attempt === maxRetries)
          throw new Error(`Max retries reached. ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, msBetweenRetries));
      }
    }
  };
};

export default withRetry;
