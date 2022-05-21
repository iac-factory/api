/***
 * Generic Type Definition
 * ---
 *
 * @type {Symbol}
 */

export const Any: Symbol & Object = Symbol(typeof Object);

export type Generic = typeof Any;

export default Any;