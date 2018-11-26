/**
 * A compartor function for grid sorting.
 * Compares two values:
 *  - Numbers are compared numeric
 *  - Strings are compared alphabetic
 *  - Numeric values are smaller then string values
 *  - String values are smaller then NULL values
 *
 * @param {*} valueA
 * @param {*} valueB
 */
const comparator = (valueA, valueB) => {
  let numberA = parseFloat(valueA);
  let numberB = parseFloat(valueB);
  if(valueA && valueB) {
    if (isNaN(numberA) || isNaN(numberB)) {
      if(isNaN(numberA) && isNaN(numberB)) {
        return valueA.localeCompare(valueB);
      }
      if(isNaN(numberA)){
        return 1;
      }
      if(isNaN(numberB)){
        return -1;
      }
    } else {
      return numberA - numberB;
    }
  } else {
    return valueA ? -1 : 1;
  }
};

export default comparator;
