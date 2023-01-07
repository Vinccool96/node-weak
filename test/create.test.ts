import assert from "assert"
import weak from "../src/weak"
import { gc } from "expose-ts-gc"

describe('create()', function () {

  afterEach(gc)

  it('should throw on non-"object" values', function () {
    [0, 0.0, true, false, null, undefined, 'foo'
    ].forEach(function (val) {
      assert.throws(function () {
        // @ts-ignore
        weak.create(val)
      })
    })
  })

  it('should acknowledge the weakness of created values', function () {
    var ref = weak.create([]);
    assert(weak.isWeakRef(ref));
  })

})
