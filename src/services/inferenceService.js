const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

function findLargestByIndex(arr) {
    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
            maxIndex = i;
        }
    }

    return maxIndex;
}

const labels = ["100K", "10K", "1K", "20K", "2K", "50K", "5K"];

async function predictClassification(model, image) {
    try {
        const input = tf.node.decodeImage(image);
        const preprocessedInput = tf.div(input, tf.scalar(255.0));
        const resizedInput = tf.image.resizeBilinear(preprocessedInput, [256, 256]);
        const reshapedInput = resizedInput.reshape([-1, ...resizedInput.shape]);

        const prediction = model.execute(reshapedInput);
        const confidenceScores = await prediction.data();

        const maxIndex = findLargestByIndex(confidenceScores);
        const result = labels[maxIndex];
        const suggestion = `Prediksi uang: ${result}`;

        return { result, suggestion };

    } catch (error) {
        console.error('Error during inference:', error); // Tambahkan logging
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
