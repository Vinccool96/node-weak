/**
 * Module dependencies.
 */

import {EventEmitter} from "events"
import b from "bindings"

var bindings = b('weakref.node');

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

var CB = '_CB';

/**
 * Creates and returns a new Weakref instance. Optionally attaches
 * a weak callback to invoke when the Object gets garbage collected.
 *
 * @api public
 */
export function create(obj, fn) {
  var weakref = bindings._create(obj, new EventEmitter());
  if ('function' == typeof fn) {
    exports.addCallback(weakref, fn);
  }
  return weakref;
}

/**
 * Adds a weak callback function to the Weakref instance.
 *
 * @api public
 */
export function addCallback(weakref, fn) {
  var emitter = bindings._getEmitter(weakref);
  return emitter.on(CB, fn);
}

/**
 * Removes a weak callback function from the Weakref instance.
 */
export function removeCallback(weakref, fn) {
  var emitter = bindings._getEmitter(weakref);
  return emitter.removeListener(CB, fn);
}

/**
 * Returns a copy of the listeners on the Weakref instance.
 *
 * @api public
 */

export function callbacks(weakref) {
  var emitter = bindings._getEmitter(weakref);
  return emitter.listeners(CB);
}


/**
 * Removes all callbacks on the Weakref instance.
 *
 * @api public
 */

export function removeCallbacks(weakref) {
  var emitter = bindings._getEmitter(weakref);
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

export default {
  create, addCallback, removeCallback, removeCallbacks, callbacks, ...bindings
}