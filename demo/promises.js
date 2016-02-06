'use strict';

let Promise = require('bluebird');
let express = require('express');
let request  = require('request-promise');
let redis = Promise.promisifyAll( require('redis').createClient() );

const PORT = 5000;

let app = express();

app.get('/data', handler);


function handler(req, res, next ) {
  getData()
    .then( (data) => res.json(data) )
    .catch( next );
}

function getData() {
  return getCachedValue()
    .then( ( value ) => {
      if (value) {
        console.log('respond with cache');
        return value;
      }
      console.log('respond directly');
      return retrieveAllData()
        .then( setCachedValue );
    });
}

function retrieveAllData() {
  return Promise.all([
    retrieveBackendData(),
    retrieveThirdPartyData()
  ])
    .then(([ backendData, thirdPartyData ]) => {
      return { backendData, thirdPartyData };
    })
}

function retrieveBackendData() {
  return request('http://java.intranet.example.com:5001/backend-data')
    .then(JSON.parse)
    .then((data) => {
      delete data.confidential;
      return data;
    });
}

function retrieveThirdPartyData() {
  return request('http://third.party.org:5002/third-party-data').then(JSON.parse);
}

function getCachedValue() {
  return redis.getAsync('merged_data4').then(JSON.parse);
}

function setCachedValue( data ) {
  console.log('set cache');
  redis.setexAsync('merged_data4', 5, JSON.stringify(data));
  return data;
}

app.use((err, req, res, next) => {

  if (err) {
    console.error(err.stack);
    res.status(500).send({ message: err.message || 'Unknown error' });
  }

});

app.listen(5000, () => {
  console.log(`Listening on port ${PORT}`);
});
