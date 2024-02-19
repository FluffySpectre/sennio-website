import basicFetch from "./basic-fetch";
import withCache from "./cached-fetch";
import withRetry from "./retry-fetch";
import withTimeout from "./timeout-fetch";

const extendedFetch = withCache(withRetry(withTimeout(basicFetch)));

export default extendedFetch;
