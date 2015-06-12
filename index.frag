precision mediump float;

uniform sampler2D data;
uniform vec2 size;

#pragma glslify: encode = require('glsl-read-float')

void main() {
  vec2 uv     = gl_FragCoord.xy / size;
  float value = texture2D(data, uv)[CHANNEL];

  gl_FragColor = vec4(encode(value));
}
