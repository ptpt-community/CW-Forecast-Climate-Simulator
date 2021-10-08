"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prediction = prediction;

var tf = _interopRequireWildcard(require("@tensorflow/tfjs-node-gpu"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var predict_year = 1950;

function prediction(predict_year) {
  var trainData, model, testPredictValue, prediction;
  return regeneratorRuntime.async(function prediction$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // 1. Set data
          trainData = {
            xs: tf.tensor2d([-1.0, 0.0, 1.0, 2.0, 3.0, 4.0], [6, 1]),
            ys: tf.tensor2d([-3.0, -1.0, 2.0, 3.0, 5.0, 7.0], [6, 1])
          }; // 2. Create a model

          model = tf.sequential();
          model.add(tf.layers.dense({
            units: 1,
            inputShape: [1]
          }));
          model.compile({
            loss: "meanSquaredError",
            optimizer: "sgd"
          });
          model.summary(); // 3. Train model

          _context.next = 7;
          return regeneratorRuntime.awrap(model.fit(trainData.xs, trainData.ys, {
            epochs: 500,
            callbacks: {// onEpochEnd: (epoch, logs) => {
              //     console.log(`Epoch: ${epoch} Loss: ${logs.loss}`);
              // }
            }
          }));

        case 7:
          // 4. Make a prediction
          testPredictValue = tf.tensor2d([predict_year - 1980], [1, 1]);
          _context.next = 10;
          return regeneratorRuntime.awrap(model.predict(testPredictValue).data());

        case 10:
          prediction = _context.sent;
          console.log(prediction);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}
//# sourceMappingURL=prediction.dev.js.map
