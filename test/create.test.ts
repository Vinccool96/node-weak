import assert from "assert"
import { create, isWeakRef } from "../src/weak"
import { gc } from "expose-ts-gc"

describe("create()", function () {
  afterEach(gc)

  it('should throw on non-"object" values', function () {
    ;[0, 0.0, true, false, null, undefined, "foo"].forEach(function (val) {
      assert.throws(function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        create(val)
      })
    })
  })

  it("should acknowledge the weakness of created values", function () {
    const ref = create([])
    assert(isWeakRef(ref))
  })
})
