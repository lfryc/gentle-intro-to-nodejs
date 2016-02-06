'use strict';

let Promise = require('bluebird');
let express = require('express');
let request  = require('request-promise');
let redis = Promise.promisifyAll( require('redis').createClient() );

let router = express.Router();
router.get('/', handler);

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
  redis.setexAsync('merged_data4', 1, JSON.stringify(data));
  return data;
}


module.exports = {
  router,
  handler,
  getData,
  retrieveAllData,
  retrieveBackendData,
  retrieveThirdPartyData,
  getCachedValue,
  setCachedValue
};
