'use strict';

let express = require('express');
let request  = require('request');
let redis = require('redis').createClient();

let app = express();

app.get('/data', (req, res, next) => {

  redis.get('merged_data3', (err, cachedData) => {

    if (cachedData) {
      console.log('responding from cache');
      return res.send(cachedData);
    }

    var mergedData = {
      backendData: null,
      thirdPartyData: null
    };

    request('http://java.intranet.example.com:5001/backend-data', (err, response, body) => {
      if (err) return next(err);
      mergedData.backendData = JSON.parse(body);
      delete mergedData.backendData.confidential;
      tryRespond();
    });
    request('http://third.party.org:5002/third-party-data', (err, response, body) => {
      if (err) return next(err);
      mergedData.thirdPartyData = JSON.parse(body);
      tryRespond();
    });

    function tryRespond() {
      if (mergedData.backendData && mergedData.thirdPartyData) {
        console.log('direct response');
        res.json(mergedData);
        redis.setex('merged_data3', 5, JSON.stringify(mergedData), (err) => {
          if (err) return console.log(err);
          console.log('cache set');
        });
      }
    }
  });


});

app.use((err, req, res, next) => {

  if (err) {
    res.status(500).send({ message: err.message || 'Unknown error' });
  }

});



app.listen(5000, () => {
  console.log('Listening on port 5000');
});
