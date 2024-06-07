require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
    const app = express();
    const port = process.env.PORT || 50503;
    const host = '0.0.0.0'; 

    // Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Load model and attach to app
    const model = await loadModel();
    app.locals.model = model;

    // Routes
    app.use('/', routes);

    // Error handling middleware
    app.use((err, req, res, next) => {
        if (err instanceof InputError) {
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

    app.listen(port, host, () => { // Listen on host
        console.log(`Server started at http://${host}:${port}`);
    });
})();
