import assert from "assert"
import { isWeakRef } from "../src/weak"

describe("promise", function () {
  if (!global.Promise) {
    // Version of JS without `Promise`; nothing to do.
    return
  }

  it("should not mistake a promise for a weak reference", function () {
    const p = new Promise(function () {})
    assert(!isWeakRef(p))
  })
})
