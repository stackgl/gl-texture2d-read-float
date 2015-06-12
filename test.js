const Texture = require('gl-texture2d')
const ndarray = require('ndarray')
const test    = require('tape')
const read    = require('./')

test('gl-texture2d-read-float', function(t) {
  const canvas  = document.body.appendChild(document.createElement('canvas'))
  const gl      = canvas.getContext('webgl')
  const data    = new Float32Array([0, 1.2, 2.4, 3.6, 4, 5, 6, 7])
  const stride1 = [2, 1, 4]
  const stride2 = [1, 2, 4]

  const tex1 = Texture(gl, ndarray(data, stride1), { float: true })
  const tex2 = Texture(gl, ndarray(data, stride2), { float: true })

  t.plan(4)

  read(tex1, function(err, res) {
    t.ifError(err, 'ran without error')
    t.deepEqual(res, data, 'RGBA: data returned is equivalent to what was passed in')
  })

  read(tex2, function(err, res) {
    t.ifError(err, 'ran without error')
    t.deepEqual(res, data, 'RGBA: data returned is equivalent to what was passed in')
  })
})
