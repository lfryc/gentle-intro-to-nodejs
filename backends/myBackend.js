'use strict';

let express = require('express');

let app = express();

app.get('/backend-data', (req, res, next) => {
  res.json({
    'backend': 'data',
    'confidential': 'supersecret'
  });
});

app.listen(5001, () => {
  console.log('Listening on port 5001');
});
