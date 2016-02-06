'use strict';

let express = require('express');

let app = express();

app.get('/third-party-data', (req, res, next) => {
  res.json({
    'third-party': 'data'
  });
});

app.listen(5002, () => {
  console.log('Listening on port 5002');
});
