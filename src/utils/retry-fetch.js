const curves = {
  linear: (attempt) => attempt,
};

const withRetry = (fetchFunction) => {
  return async (
    url,
    {
      maxRetries = 3,
      msBetweenRetries = 500,
      retryDelayCurve = "linear",
      ...opts
    } = {}
  ) => {
    const curveFunction =
      typeof retryDelayCurve === "function"
        ? retryDelayCurve
        : curves[retryDelayCurve];

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fetchFunction(url, opts);
      } catch (error) {
        console.log(`Attempt ${attempt}: ${error.message}`);
        if (attempt === maxRetries)
          throw new Error(`Max retries reached. ${error.message}`);

        const retryDelay = msBetweenRetries * curveFunction(attempt);
        console.log(`Retrying in ${retryDelay}ms`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  };
};

export default withRetry;
