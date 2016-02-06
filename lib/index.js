'use strict';

let express = require('express');
let request  = require('request');
let redis = require('redis').createClient();

let app = express();

app.get('/data', (req, res, next) => {

});

app.use((err, req, res, next) => {

  if (err) {
    res.status(500).send({ message: err.message || 'Unknown error' });
  }



});



app.listen(5050);
