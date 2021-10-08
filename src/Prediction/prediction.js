
import * as tf from '@tensorflow/tfjs-node-gpu'

const predict_year = 1950;
export async function prediction(predict_year) {
    // 1. Set data
    const trainData = {
        xs: tf.tensor2d([-1.0, 0.0, 1.0, 2.0, 3.0, 4.0], [6, 1]),
        ys: tf.tensor2d([-3.0, -1.0, 2.0, 3.0, 5.0, 7.0], [6, 1])
    }
    // 2. Create a model
    const model = tf.sequential()
    model.add(tf.layers.dense({
        units: 1,
        inputShape: [1]
    }))
    model.compile({
        loss: "meanSquaredError",
        optimizer: "sgd"
    })
    model.summary()

    // 3. Train model
    await model.fit(trainData.xs, trainData.ys, {
        epochs: 500,
        callbacks: {
            // onEpochEnd: (epoch, logs) => {
            //     console.log(`Epoch: ${epoch} Loss: ${logs.loss}`);
            // }
        }
    })

    // 4. Make a prediction
    const testPredictValue = tf.tensor2d([predict_year - 1980], [1, 1])
    const prediction = await model.predict(testPredictValue).data()

    console.log(prediction);
}