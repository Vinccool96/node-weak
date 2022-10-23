import assert from "assert"
import weak from "../lib/weak"

describe('weak()', function () {

  afterEach(weak.gc)

  describe('Buffer', function () {

    it('should invoke callback before destroying Buffer', function () {

      var called = false
      weak.create(new weak.Buffer('test'), function (buf) {
        called = true
      })

      assert(!called)
      weak.gc()
      assert(called)
    })

  })
})
