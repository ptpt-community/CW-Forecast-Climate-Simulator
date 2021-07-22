import SimplexNoise from './simplex-noise';
import perlin from './perlin';

export const noise = (function() {

  class _PerlinWrapper {
    constructor() {
    }

    noise2D(x, y) {
      return perlin(x, y) * 2.0 - 1.0;
    }
  }

  class _NoiseGenerator {
    constructor(params) {
      this._params = params;
      this._Init();
    }

    _Init() {
      this._noise = {
        simplex: new SimplexNoise(this._params.seed),
        perlin: new _PerlinWrapper()
      };
    }

    Get(x, y) {
      const xs = x / this._params.scale;
      const ys = y / this._params.scale;
      const noiseFunc = this._noise[this._params.noiseType];
      let amplitude = 1.0;
      let frequency = 1.0;
      let normalization = 0;
      let total = 0;
      for (let o = 0; o < this._params.octaves; o++) {
        const noiseValue = noiseFunc.noise2D(
            xs * frequency, ys * frequency) * 0.5 + 0.5;
        total += noiseValue * amplitude;
        normalization += amplitude;
        amplitude *= this._params.persistence;
        frequency *= this._params.lacunarity;
      }
      total /= normalization;
      return Math.pow(total, this._params.exponentiation) * this._params.height;
    }
  }

  return {
    Noise: _NoiseGenerator
  }
})();
