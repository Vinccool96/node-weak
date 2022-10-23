/**
 * Module dependencies.
 */

import {EventEmitter} from "events"
import b from "bindings"

const bindings = b('weakref.node');

/**
 * Set global weak callback function.
 */

bindings._setCallback(callback);

/**
 * Module exports.
 */

// re-export all the binding functions onto the exports

/**
 * Internal emitter event name.
 * This is completely arbitrary...
 * Could be any value....
 */
const CB = '_CB';

declare class WeakRef<T> {}

/**
 * Makes weak references to JavaScript Objects
 *
 * @param object can be a regular Object, an Array, a Function, a RegExp, or any of the primitive types or constructor function created with new
 * @param callback a callback function to be invoked before the object is garbage collected
 */
export function create<T extends object>(object: T, callback?: () => void): WeakRef<T> {
  const weakref = bindings._create(object, new EventEmitter());
  if ('function' == typeof callback) {
    exports.addCallback(weakref, callback);
  }
  return weakref;
}

/**
 * Adds a weak callback function to the Weakref instance.
 *
 * @api public
 */
export function addCallback(weakref, fn) {
  const emitter = bindings._getEmitter(weakref);
  return emitter.on(CB, fn);
}

/**
 * Removes a weak callback function from the Weakref instance.
 */
export function removeCallback(weakref, fn) {
  const emitter = bindings._getEmitter(weakref);
  return emitter.removeListener(CB, fn);
}

/**
 * Returns a copy of the listeners on the Weakref instance.
 *
 * @api public
 */

export function callbacks(weakref) {
  const emitter = bindings._getEmitter(weakref);
  return emitter.listeners(CB);
}


/**
 * Removes all callbacks on the Weakref instance.
 *
 * @api public
 */

export function removeCallbacks(weakref) {
  const emitter = bindings._getEmitter(weakref);
  return emitter.removeAllListeners(CB);
}

/**
 * Common weak callback function.
 *
 * @api private
 */

export function callback(emitter) {
  emitter.emit(CB);
  emitter = null;
}

export default create

// Keep consistency with old weak package
create.create = create
create.callbacks = callbacks
create.addCallback = addCallback
create.removeCallback = removeCallback
create.removeCallbacks = removeCallbacks

Object.keys(bindings).forEach(function (key) {
  create[key] = bindings[key]
})