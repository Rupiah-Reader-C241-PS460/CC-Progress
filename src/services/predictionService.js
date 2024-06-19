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

const labels = ["100K", "10K", "1K", "20K", "2K", "50K", "5K"];

async function predictClassification(model, image) {
    try {
        if (!image || !image.length) {
            throw new Error('Invalid image buffer');
        }

        // Decode the image
        const input = tf.node.decodeImage(image, 3); // 3 channels (RGB)
        
        // Preprocess the input
        const preprocessedInput = tf.div(input, tf.scalar(255.0));
        const resizedInput = tf.image.resizeBilinear(preprocessedInput, [256, 256]);
        const reshapedInput = resizedInput.expandDims(0); // Add batch dimension

        // Execute the model and get prediction
        const prediction = model.predict(reshapedInput);
        const confidenceScores = await prediction.data();

        // Find the label with the highest confidence score
        const maxIndex = findLargestByIndex(confidenceScores);
        const result = labels[maxIndex];
        const suggestion = `Prediksi uang: ${result}`;

        // Dispose tensors to free memory
        input.dispose();
        preprocessedInput.dispose();
        resizedInput.dispose();
        reshapedInput.dispose();
        prediction.dispose();

        return { result, suggestion };

    } catch (error) {
        console.error('Error during inference:', error); // Logging the error
        throw new ValidationError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;

