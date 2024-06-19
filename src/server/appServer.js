require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const ValidationError = require('../exceptions/ValidationError');

(async () => {
    const app = express();
    const port = process.env.PORT || 50503;
    const host = '0.0.0.0'; 

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    try {
        const model = await loadModel();
        app.locals.model = model;
    } catch (error) {
        console.error('Error loading the model:', error);
        process.exit(1);
    }

    app.use('/', routes);

    app.use((err, req, res, next) => {
        if (err instanceof ValidationError) {
            res.status(err.statusCode).json({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi',
            });
        } else if (err.status === 413) {
            res.status(413).json({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            });
        } else {
            res.status(err.status || 500).json({
                status: 'fail',
                message: err.message,
            });
        }
    });

    app.listen(port, host, () => { 
        console.log(`Server started at http://${host}:${port}`);
    });
})();
