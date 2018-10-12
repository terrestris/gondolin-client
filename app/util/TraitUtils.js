import isInteger from 'lodash/isInteger';
import isNumber from 'lodash/isNumber';

export class TraitUtils {

  static traitsToProps(traits, traitDefs, props = {}) {
    traitDefs.forEach(def => {
      props[def.id] = traits[def.id];
    });
    return props;
  }

  static propsToTraits(props, traitDefs) {
    const traits = {};
    traitDefs.forEach(def => {
      if (props[def.traitgerman]) {
        const val = TraitUtils.parseValToType(props[def.traitgerman], def.traittype);
        traits[def.id] = val;
      }
    });
    return traits;
  }

  /**
   * Parses the value to its type.
   *
   * @param {String} val The value of the trait.
   * @param {String} type The type of the trait.
   * @return {string|boolean|float|object} The parsed value.
   */
  static parseValToType(val, type) {
    switch (type) {
      case 'INTEGER':
        return isInteger(val) ? val : parseInt(val.replace(',', '.'), 10);
      case 'DOUBLE PRECISION':
        return isNumber(val) ? val : parseFloat(val.replace(',', '.'));
      case 'DATE':
      case 'TIME':
      case 'TIMESTAMP':
      case 'VARCHAR':
      default:
        return val;
    }
  }

  /**
   * Returns the correct filter string for a given traittype.
   *
   * @param {String} type The traittype.
   * @return {String} The filtername.
   */
  static gridFilterByTraitType(type) {
    switch (type) {
      case 'INTEGER':
      case 'DOUBLE PRECISION':
        return 'agNumberColumnFilter';
      case 'DATE':
      case 'TIME':
      case 'TIMESTAMP':
        return 'agDateColumnFilter';
      case 'VARCHAR':
      default:
        return 'agTextColumnFilter';
    }
  }

};
