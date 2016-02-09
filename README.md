# gl-texture2d-read-float

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Read out the contents of a floating-point
[gl-texture2d](http://github.com/stackgl/gl-texture2d).

This will *eventually* be supported natively in WebGL
[(it's listed in the OpenGL ES 3 spec)](https://www.khronos.org/opengles/sdk/docs/man31/html/glReadPixels.xhtml),
but this fills that need until then!

## Usage

[![NPM](https://nodei.co/npm/gl-texture2d-read-float.png)](https://nodei.co/npm/gl-texture2d-read-float/)

### `read(glTex2d, done(err, data))`

Reads out the contents of `glTex2d`, which should be an instance of
`gl-texture2d`. When complete, `done(err, data)` will be called where `data` is
a `Float32Array` containing the resulting floats in the texture.

``` javascript
const canvas    = document.createElement('canvas')
const gl        = require('gl-context')(canvas)

const read      = require('gl-texture2d-read-float')
const Texture2d = require('gl-texture2d')
const baboon    = require('baboon-image')
const assert    = require('assert')

const texture  = Texture2d(gl, baboon)

read(texture, function(err, data) {
  if (err) throw err

  assert.deepEqual(data, baboon.data)
})
```

A few things to note:

* Right now, this is slow as it requires reading data back from the GPU.
  There's not much that can be done about this for the time being unfortunately.
* The data is retrieved synchronously under the hood, but the API has been made
  asynchronous in preparation for WebGL's eventual async `readPixels` equivalent.
* Only `gl.RGBA`/`gl.FLOAT` textures are currently supported. Pull requests are,
  however, very welcome! :)

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/stackgl/gl-texture2d-read-float/blob/master/LICENSE.md) for details.
