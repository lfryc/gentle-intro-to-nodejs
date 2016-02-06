'use strict';

var assert = require('assert');

describe('endpoint: /data', function () {

  it('should retrieve third-party data', function ( done ) {
    var dataEndpoint = require('../../lib/endpoints/data.js');
    dataEndpoint.retrieveThirdPartyData()
      .then( (data) => {
        assert.deepEqual(data, {
          'third-party': 'data'
        });
      })
      .then( done )
      .catch( done );
  });

  it('should retrieve backend data (without confidential information)', function ( done ) {
    var dataEndpoint = require('../../lib/endpoints/data.js');
    dataEndpoint.retrieveBackendData()
      .then( (data) => {
        assert.deepEqual(data, {
          'backend': 'data'
        });
      })
      .then( done )
      .catch( done );
  });

  it('should merge data into single result', function ( done ) {
    var dataEndpoint = require('../../lib/endpoints/data.js');
    dataEndpoint.retrieveAllData()
      .then( (data) => {
        assert.deepEqual(data, {
          backendData: { backend: 'data' },
          thirdPartyData: { 'third-party': 'data' }
        });
      })
      .then( done )
      .catch( done );
  });

  it('data should be cached', function ( done ) {
    var dataEndpoint = require('../../lib/endpoints/data.js');
    Promise.resolve({ data: 123 })
      .then(dataEndpoint.setCachedValue)
      .then(dataEndpoint.getCachedValue)
      .then((data) => {
        assert.deepEqual(data, { data: 123 });
      })
      .then( done )
      .catch( done );
  });

  it('data cache should expire after 1 second', function ( done ) {
    var dataEndpoint = require('../../lib/endpoints/data.js');
    Promise.resolve({ data: 123 })
      .then(dataEndpoint.setCachedValue)
      .then(() => {
        return new Promise(function(resolve, reject) {
          setTimeout(resolve, 1100);
        });
      })
      .then(dataEndpoint.getCachedValue)
      .then((data) => {
        assert.deepEqual(data, null);
      })
      .then( done )
      .catch( done );
  });
});
