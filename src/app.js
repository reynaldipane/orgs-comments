const express = require('express');
const mongoose = require('mongoose');
const apiLoader = require('./utils/api_loader');
const config = require('./configs/config');

require('dotenv').config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.config = config.loadConfig()

app.mongoConnection = mongoose.createConnection(app.config.mongoUri, {useNewUrlParser: true})

mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

apiLoader.load(app, __dirname);
app.use(require('./middlewares/response')());

app.listen(app.config.port || 9000);

module.exports = app;
