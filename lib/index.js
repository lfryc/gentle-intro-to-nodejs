'use strict';

let express = require('express');
let dataEndpoint = require('./endpoints/data.js');

const PORT = 5000;

let app = express();

app.use('/data', dataEndpoint.router);

app.use((err, req, res, next) => {

  if (err) {
    console.error(err.stack);
    res.status(500).send({ message: err.message || 'Unknown error' });
  }

});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
