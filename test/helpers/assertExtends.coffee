assert = require('assert')

# Assert that objA `extends` objB.
# Ie: obj A has all methods and properties found in obj B
# note: B does not necessarily have all methods/props from A
assertExtends = module.exports = (objA, objB) ->
  for prop of objB
    aType = typeof objA[prop]
    bType = typeof objB[prop]
    assert.equal aType, bType,
      "unequal property '#{prop}'"