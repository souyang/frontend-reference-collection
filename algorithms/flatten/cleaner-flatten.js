/**
 * Write a flatten function that takes in a value and returns a flattened version of that value.
 * For the purpose of this problem, a flattened value is defined as follows:
 * Primitive values should be left unchanged.
 * Nested arrays should have their values brought up to the top level array
 * For example, [1, 2, [3, 4, [5, 6]]] would be flattened to [1, 2, 3, 4, 5, 6].
 * Nested objects should have their key-value pairs brought up to the top level object.
 * For example, {a: 1, b: {c: 2, d: 3, e: {f: 4}}} would be flattened to {a: 1, c: 2, d: 3, f: 4}.
 * Note that this means the keys "b" and "e" were completely removed, since their values were
 * flattened to the top level. In the event of a key collision (e.g. {a: 1, b: {a: 2}}), any
 * associated value can be used.
 * Arrays nested in objects and objects nested in arrays should be flattened. For example,
 * {a: [1, 2, [3, 4]]} would be flattened to {a: [1, 2, 3, 4]}, and [{a: 1, b: {c: 2, d: 3}}]
 * would be flattened to [{a: 1, c: 2, d: 3}].
 * For simplicity, you can assume the value as well as any nested values will not be functions.
 * Additionally, you can assume that all object keys are strings. Your solution can return a
 * flattened value in place, or it can return a new value, either is acceptable.
 */

function flattenArray(value) {
  return value.reduce((array, v) => {
    if (v === null) {
      return array;
    }

    if (Array.isArray(v)) {
      return [...array, ...flattenArray(v)];
    }

    if (typeof v === 'object') {
      return [...array, flattenObject(v)];
    }

    return [...array, v];
  }, []);
}

function flattenObject(value) {
  return Object.entries(value).reduce((obj, [key, val]) => {
    if (val === null || Array.isArray(val)) {
      const flattenedValue = flatten(val);

      return {
        ...obj,
        [key]: flattenedValue,
      };
    }

    if (typeof val === 'object') {
      const flattedObj = flattenObject(val);

      if (JSON.stringify(flattedObj) === '{}') {
        return obj;
      }

      return {
        ...obj,
        ...flattedObj,
      };
    }

    return {
      ...obj,
      [key]: val,
    };
  }, {});
}

function flatten(value) {
  if (value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return flattenArray(value);
  }

  if (typeof value === 'object') {
    return flattenObject(value);
  }

  return value;
}
