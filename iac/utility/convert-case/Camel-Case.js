const Expression = new RegExp("[a-z]+(?:[A-Z0-9]+[a-z0-9]+[A-Za-z0-9]*)*");

Expression.prototype = RegExp.prototype;
Expression.prototype.constructor = RegExp.prototype.constructor;

const Module = Expression;

Object.seal(Module);

export default Module;
