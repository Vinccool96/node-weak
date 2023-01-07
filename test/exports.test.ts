import assert from "assert"
import weak from "../src/weak"
import { gc } from "expose-ts-gc"

function checkFunction (prop) {
  it('should have a function "' + prop + '"', function () {
    assert('function' == typeof weak[prop]);
  })
}

describe('exports', function () {

  afterEach(gc)

  it('should be a function', function () {
    assert('function' == typeof weak);
  })

  checkFunction('get')
  checkFunction('create')
  checkFunction('isWeakRef')
  checkFunction('isDead')
  checkFunction('callbacks')
  checkFunction('addCallback')
  checkFunction('removeCallback')
  checkFunction('removeCallbacks')

  it('should be a circular reference to "create"', function () {
    const w = weak
    assert(weak === weak.create);
  })

})
