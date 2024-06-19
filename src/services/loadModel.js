const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
        console.log('Loading model from URL:', process.env.MODEL_URL);
        const model = await tf.loadGraphModel(process.env.MODEL_URL);
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

module.exports = loadModel;
