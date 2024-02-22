const curveLinear = (attempt) => attempt;

const curves = {
  linear: curveLinear,
};

const withRetry = (fetchFunction) => {
  return async (url, opts = {}) => {
    const maxRetries = opts.maxRetries || 3;
    const msBetweenRetries = opts.msBetweenRetries || 500;
    let retryDelayCurve = opts.retryDelayCurve || curves.linear;
    if (typeof retryDelayCurve === "string") {
      retryDelayCurve = curves[retryDelayCurve];
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fetchFunction(url, opts);
      } catch (error) {
        console.log(`Attempt ${attempt}: ${error.message}`);
        if (attempt === maxRetries)
          throw new Error(`Max retries reached. ${error.message}`);

        const retryDelay = msBetweenRetries * retryDelayCurve(attempt);
        console.log(`Retrying in ${retryDelay}ms`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  };
};

export default withRetry;
