import assert from "assert"
import { addCallback, callbacks, create, removeCallback, removeCallbacks } from "../src/weak"
import { gc } from "expose-ts-gc"

describe("create()", function () {
  afterEach(gc)

  describe("garbage collection callback", function () {
    it("should accept a function as second argument", function () {
      const r = create({}, function () {})
      assert.equal(1, callbacks(r).length)
    })

    it("should invoke the callback before the target is gc'd", function () {
      let called = false
      create({}, function () {
        called = true
      })
      assert(!called)
      gc()
      assert(called)
    })

    it('should invoke *all* callbacks in the internal "callback" Array', function () {
      let r = create({}),
        called1 = false,
        called2 = false
      addCallback(r, function () {
        called1 = true
      })
      addCallback(r, function () {
        called2 = true
      })
      gc()
      assert(called1)
      assert(called2)
    })

    it("should preempt code for GC callback but not nextTick callbacks", function (done) {
      let calledGcCallback = false,
        calledTickCallback = false
      create({}, function () {
        calledGcCallback = true
      })

      process.nextTick(function () {
        calledTickCallback = true
      })

      assert(!calledGcCallback)
      assert(!calledTickCallback)
      gc()
      assert(calledGcCallback)
      assert(!calledTickCallback)
      setTimeout(function () {
        assert(calledTickCallback)
        done()
      }, 0)
    })
  })
})

describe("callbacks()", function () {
  it('should return the Weakref\'s "callback" Array', function () {
    const r = create({}, function () {}),
      cbs = callbacks(r)
    assert(Array.isArray(cbs))
    assert.equal(1, cbs.length)
  })
})

describe("removeCallback()", function () {
  it("removed callbacks should not be called", function () {
    let called = false,
      fn = function () {
        called = true
      },
      r = create({}, fn)
    removeCallback(r, fn)
    gc()
    assert(!called)
  })
})

describe("removeCallbacks()", function () {
  it("removed callbacks should not be called", function () {
    let called = false,
      fn = function () {
        called = true
      },
      r = create({}, fn)
    removeCallbacks(r)
    gc()
    assert(!called)
  })
})
