const predictClassification = require('../services/predictionService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');
const ValidationError = require('../exceptions/ValidationError');

async function postPredictHandler(req, res, next) {
    try {
        const { file } = req;
        const { model } = req.app.locals;

        if (!file) {
            throw new ValidationError('No image file provided');
        }

        const { result, suggestion } = await predictClassification(model, file.buffer);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id: id,
            result: result,
            suggestion: suggestion,
            createdAt: createdAt
        };

        await storeData(id, data);

        res.status(201).json({
            status: 'success',
            message: 'Model is predicted successfully',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

async function getHistoriesHandler(req, res, next) {
    try {
        const db = new Firestore();
        const predictCollection = db.collection('predictions');
        const predictSnapshot = await predictCollection.get();

        const data = [];

        predictSnapshot.forEach((doc) => {
            const history = {
                id: doc.id,
                history: doc.data()
            };
            data.push(history);
        });

        res.status(200).json({
            status: 'success',
            data: data
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { postPredictHandler, getHistoriesHandler };
