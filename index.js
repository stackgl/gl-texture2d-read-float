var readFloat = require('glsl-read-float')
var triangle  = require('a-big-triangle')
var Symbol    = require('es6-symbol')
var Shader    = require('gl-shader')
var glslify   = require('glslify')
var createFBO = require('gl-fbo')

var SHADERS = Symbol('gl-texture2d-read-float:shader')
var FBO     = Symbol('gl-texture2d-read-float:fbo')

module.exports = function(texture, done) {
  var gl       = texture.gl
  var width    = texture.shape[0]
  var height   = texture.shape[1]
  var viewport = gl.getParameter(gl.VIEWPORT)
  var fbo      = gl.getParameter(gl.FRAMEBUFFER_BINDING)
  var rbo      = gl.getParameter(gl.RENDERBUFFER_BINDING)
  var tex      = gl.getParameter(gl.TEXTURE_BINDING_2D)
  var prog     = gl.getParameter(gl.CURRENT_PROGRAM)

  gl.viewport(0, 0, width, height)
  gl[FBO]     = gl[FBO] || createFBO(gl, [1, 1], { float: true })
  gl[SHADERS] = gl[SHADERS] || [0, 1, 2, 3].map(function(n) {
    return Shader(gl
      , '#define CHANNEL ' + n + '\n' + glslify('./index.vert')
      , '#define CHANNEL ' + n + '\n' + glslify('./index.frag')
    )
  })

  var output = new Float32Array(width * height * 4)
  var fbdump = new Uint8Array(width * height * 4)
  var buffer = gl[FBO]

  buffer.shape = [width, height]
  buffer.bind()

  for (var channel = 0; channel < 4; channel++) {
    var shader = gl[SHADERS][channel]

    shader.bind()
    shader.uniforms.data = texture.bind(0)
    shader.uniforms.size = [width, height]
    triangle(gl)

    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, fbdump)

    for (var j = 0, x = 0, n = channel; x < width; x++)
    for (var y = 0; y < height; y++, n += 4) {
      output[n] = readFloat(fbdump[j++], fbdump[j++], fbdump[j++], fbdump[j++])
    }
  }

  gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3])
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.bindRenderbuffer(gl.RENDERBUFFER, rbo)
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.useProgram(prog)

  setTimeout(function() {
    done(null, output)
  })
}
