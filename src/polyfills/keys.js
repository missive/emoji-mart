// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
var hasOwnProperty = Object.prototype.hasOwnProperty,
  hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
  dontEnums = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor',
  ],
  dontEnumsLength = dontEnums.length

export default function(obj) {
  if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
    throw new TypeError('Object.keys called on non-object')
  }

  var result = [],
    prop,
    i

  for (prop in obj) {
    if (hasOwnProperty.call(obj, prop)) {
      result.push(prop)
    }
  }

  if (hasDontEnumBug) {
    for (i = 0; i < dontEnumsLength; i++) {
      if (hasOwnProperty.call(obj, dontEnums[i])) {
        result.push(dontEnums[i])
      }
    }
  }
  return result
}
