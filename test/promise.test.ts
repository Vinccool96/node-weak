import assert from "assert"
import weak from "../src/weak"

describe('promise', function () {
  if (!global.Promise) {
    // Version of JS without `Promise`; nothing to do.
    return;
  }

  it('should not mistake a promise for a weak reference', function () {
    var p = new Promise(function () {});
    assert(!weak.isWeakRef(p));
  });
})
