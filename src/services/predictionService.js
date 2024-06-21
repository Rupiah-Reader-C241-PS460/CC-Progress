const tf = require('@tensorflow/tfjs-node');
const ValidationError = require('../exceptions/ValidationError');

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

const labels = [
    "Seratus Ribu", 
    "Sepuluh Ribu", 
    "Seribu", 
    "Dua Puluh Ribu", 
    "Dua Ribu", 
    "Lima Puluh Ribu", 
    "Lima Ribu"
];

async function predictClassification(model, image) {
    try {
        if (!image || !image.length) {
            throw new Error('Invalid image buffer');
        }

        const input = tf.node.decodeImage(image, 3);
        const reshapedInput = input.expandDims(0);
        const prediction = model.predict(reshapedInput);
        const logits = await prediction.data();



        const maxIndex = findLargestByIndex(logits);

        const result = labels[maxIndex];

        const suggestion = `Prediksi uang: ${result}`;

        input.dispose();
        reshapedInput.dispose();
        prediction.dispose();

        return { result, suggestion };

    } catch (error) {
        console.error('Error during inference:', error); // Logging error
        throw new ValidationError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;