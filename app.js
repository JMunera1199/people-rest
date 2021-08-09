const express = require('express');
const bodyParser = require('body-parser');

const peopleRoutes = require('./routes/people');
const { Validator } = require('jsonschema');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/people', peopleRoutes);

app.listen(8080);