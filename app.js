// Create a server application.
const app = require('express')();

// Import and configure required modules.
const textParser
  = require('body-parser').text({inflate: false, limit: 1000, type: '*/*'});
const fs = require('fs');

// Formulate a success report.
const reportSuccess = (verb, nextID) =>
  `{"message": "Successfully ${verb} the file ${nextID}.json"}\n`;

// Formulate an error report.
const reportError = (clause, error) =>
  `Could not ${clause}.\nError: ${error.message}\n`;

///// ROUTES /////

// Add a quote.
app.post(
  '/api/quotes',
  textParser,
  (req, res) => {
    // Get the next ID.
    fs.readFile(
      __dirname + '/util/nextid.json',
      'utf8',
      (err, data) => {
        if (err) {
          res.send(reportError('look up the next quote’s ID', err));
        }
        else {
          const nextID = JSON.parse(data).nextID;
          // Write the request body to a file named with the next ID.
          fs.writeFile(
            __dirname + '/public/quotes/' + nextID + '.json',
            req.body,
            'utf8',
            err => {
              if (err) {
                res.send(reportError('record the quote', err));
              }
              else {
                res.send(reportSuccess('created', nextID));
                // Increment the next ID.
                fs.writeFile(
                  __dirname + '/util/nextid.json',
                  `{"nextID": "${Number.parseInt(nextID) + 1}"}`,
                  'utf8',
                  err => {
                    if (err) {
                      res.send(reportError('increment the next ID', err));
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }
);

// Retrieve a quote.
app.get(
  '/api/quotes/:id',
  (req, res) => {
    // Get the specified quote.
    fs.readFile(
      __dirname + '/public/quotes/' + req.params.id + '.json',
      'utf8',
      (err, data) => {
        if (err) {
          res.send(reportError('look up the quote', err));
        }
        else {
          res.send(data + '\n');
        }
      }
    );
  }
);

// Replace a quote.
app.put(
  '/api/quotes/:id',
  textParser,
  (req, res) => {
    // Write the request body to a file named with the specified ID.
    fs.writeFile(
      __dirname + '/public/quotes/' + req.params.id + '.json',
      req.body,
      'utf8',
      err => {
        if (err) {
          res.send(reportError('replace the quote', err));
        }
        else {
          res.send(reportSuccess('replaced', req.params.id));
        }
      }
    );
  }
);

// Delete a quote.
app.delete(
  '/api/quotes/:id',
  (req, res) => {
    // Delete the specified quote.
    fs.unlink(
      __dirname + '/public/quotes/' + req.params.id + '.json',
      (err, data) => {
        if (err) {
          res.send(reportError('delete the quote', err));
        }
        else {
          res.send(reportSuccess('deleted', req.params.id));
        }
      }
    );
  }
);

// Make the application listen for queries.
app.listen(3000, () => {
  console.log('App queriable at http://localhost:3000');
});
