/**
 * Helper Class for Fetch Requests
 */
export class FetchUtils {

  /**
   * Adds params object as query params to get url.
   *
   * @static
   * @param {String} url The blank url.
   * @param {Object} params The queryParams as an object.
   * @returns {String} The modified url.
   */
  static addParams(url, params) {
    Object.keys(params)
      .forEach((key, i) => {
        const q = i === 0 ? '?' : '&';
        const value = params[key];
        url += `${q}${key}=${value}`;
      });
    return url;
  }
}
