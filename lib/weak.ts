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
 * Internal emitter event name.
 * This is completely arbitrary...
 * Could be any value....
 */
const CB = '_CB';

export type WeakRef<T> = {
  [key in keyof T]: T[key]
}

/**
 * Makes weak references to JavaScript Objects
 *
 * @param object can be a regular Object, an Array, a Function, a RegExp, or any of the primitive types or constructor function created with new
 * @param callback a callback function to be invoked before the object is garbage collected
 */
export function create<T extends object>(object: T, callback?: (obj: T) => void): WeakRef<T> {
  const weakref = bindings._create(object, new EventEmitter());
  if ('function' == typeof callback) {
    exports.addCallback(weakref, callback);
  }
  return weakref;
}

/**
 * Adds callback to the Array of callback functions that will be invoked before the Object gets garbage collected. The callbacks get executed in the order that they are added.
 *
 * @param ref weak reference object
 * @param callback function to be called
 */
export function addCallback(ref: WeakRef<any>, callback: () => void): NodeJS.EventEmitter {
  const emitter = bindings._getEmitter(ref);
  return emitter.on(CB, callback);
}

/**
 * Removes callback from the Array of callback functions that will be invoked before the Object gets garbage collected.
 *
 * @param ref weak reference object
 * @param callback function to be called
 */
export function removeCallback(ref: WeakRef<any>, callback: () => void): NodeJS.EventEmitter {
  const emitter = bindings._getEmitter(ref);
  return emitter.removeListener(CB, callback);
}

/**
 * Returns an Array that ref iterates through to invoke the GC callbacks. This utilizes node's EventEmitter#listeners() function and therefore returns a copy in node 0.10 and newer.
 *
 * @param ref weak reference object
 */
export function callbacks(ref) {
  const emitter = bindings._getEmitter(ref);
  return emitter.listeners(CB);
}

/**
 * Empties the Array of callback functions that will be invoked before the Object gets garbage collected.
 *
 * @param ref weak reference object
 */
export function removeCallbacks(ref) {
  const emitter = bindings._getEmitter(ref);
  return emitter.removeAllListeners(CB);
}

/**
 * Common weak callback function.
 *
 * @api private
 */
function callback(emitter) {
  emitter.emit(CB);
  emitter = null;
}

/**
 * Returns the actual reference to the Object that this weak reference was created with. If this is called with a dead reference, undefined is returned.
 * @param ref weak reference object
 */
export function get<T>(ref: WeakRef<T>): T | undefined {
  const emitter = bindings._getEmitter(ref);
  return emitter.get(CB);
}

/**
 * Checks to see if ref is a dead reference. Returns true if the original Object has already been GC'd, false otherwise
 *
 * @param ref weak reference object
 */
export function isDead(ref: WeakRef<any> | WeakRef<undefined>): ref is WeakRef<undefined> {
  const emitter = bindings._getEmitter(ref);
  return emitter.isDead(CB);
}

/**
 * Checks to see if obj is "weak reference" instance. Returns true if the passed in object is a "weak reference", false otherwise.
 *
 * @param obj object to check
 */
function isWeakRef(obj: any): obj is WeakRef<any> {
  const emitter = bindings._getEmitter(obj);
  return emitter.isWeakRef(CB);
}

// Keep consistency with old weak package
create.create = create
create.callbacks = callbacks
create.addCallback = addCallback
create.removeCallback = removeCallback
create.removeCallbacks = removeCallbacks
create.get = get
create.isDead = isDead
create.isWeakRef = isWeakRef

Object.keys(bindings).forEach(function (key) {
  create[key] = bindings[key]
})

export default create