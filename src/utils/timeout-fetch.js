const withTimeout = (fetchFunction) => {
  return async (url, opts = {}) => {
    const controller = new AbortController();
    const signal = controller.signal;
    opts.signal = signal;

    const timeout = opts.timeout || 1000;

    try {
      return await Promise.race([
        fetchFunction(url, opts),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out")), timeout)
        ),
      ]);
    } catch (error) {
      // abort the fetch and rethrow the exception
      controller.abort();
      throw error;
    }
  };
};

export default withTimeout;
