const _Object = Object

module.exports = _Object.getPrototypeOf || function (O) {
  O = Object(O)

  if (typeof O.constructor === 'function' && O instanceof O.constructor) {
    return O.constructor.prototype
  }

  return O instanceof Object ? Object.prototype : null
};
