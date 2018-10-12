/**
 * Helper Class for Strings
 */
export class StringUtils {
  static urlify(text, name) {
    name = name || '$1';
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, `<a href="$1" target="_blank">${name}</a>`);
  }

  /**
   * This coereces the value of a string by casting it to the most plausible
   * datatype, guessed by the value itself.
   *
   * @param {String} string The input string to coerce.
   * @return {string|boolean|float|object} The coerced value.
   */
  static coerce(string) {
    if (!(string instanceof String || typeof string === 'string')) {
      return string;
    }

    if (string.toLowerCase() === 'true') {
      return true;
    } else if (string.toLowerCase() === 'false') {
      return false;
    } else if (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(string)) {
      return parseFloat(string);
    } else if (string.startsWith('[') && !string.startsWith('[[')) {
      return JSON.parse(string).map(a => StringUtils.coerce(a));
    } else if (string.startsWith('{') && !string.startsWith('{{')) {
      const parsedObj = JSON.parse(string);
      let coercedObj = {};
      Object.keys(parsedObj).forEach(key => {
        coercedObj[key] = StringUtils.coerce(parsedObj[key]);
      });
      return coercedObj;
    } else {
      return string;
    }
  }
}
