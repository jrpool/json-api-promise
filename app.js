// Create a server application.
const app = require('express')();

// Import required modules.
const rpn = require('request-promise-native');
const cheerio = require('cheerio');

/*
  Identify the parameters of external requests that will be made, except
  for the query string.
*/
const extReqParams = {
  url: 'http://www.imdb.com/find',
  q: '',
  ref_: 'nv_sr_fn',
  s: 'all'
};

// Formulate an error report.
const reportError = (clause, error) =>
  `Could not ${clause}.\nError: ${error.message}\n`;

/**
  Define a function to extract an array of title lines from an HTML document
  served by IMDB in response to a search.
*/
const titleList = body => {
  const $ = cheerio.load(body);
  const listCells =
    $('a[name=tt]')
      .parent()
      .parent()
      .children('table')
      .children('tr')
      .children('td.result_text');
  const listTexts = [];
  listCells.each((index, element) => {
    listTexts.push($(element).text().replace(/^ +/, ''));
  });
  return listTexts;
};

/*
  Define a function to convert an array of IMDB title lines to an indented
  JSON string.
*/
const jsonify = listTexts => {
  const listObject = {'movies': []};
  listTexts.forEach(listText => {
    // Ignore lines deviating from title (year) format.
    if(/^([()])+ \((\d{4})\)/) {
      listObject.movies.push({'name': $1, 'year': $2});
    }
  });
  return JSON.stringify(listObject, null, 2);
};

// If it is:
if (query) {
  // Make it the value of the “q” property of requestParams.
  requestParams['q'] = query;
  // Identify the complete URL, including the query.
  // Make an HTTP GET request to that URL and process the result.
  rpn(urlWithQuery, processRequestResult);
}

////// CLIENT REQUEST ROUTES //////

// Perform a search.
app.get(
  '/api/search/:q',
  (req, res) => {
    extReqParams.q = req.params.q;
    const urlWithQuery
      = extReqParams.url
      + '?'
      + ['q', 'ref_', 's'].map(val => val + '=' + extReqParams[val]).join('&');
    rpn(urlWithQuery)
      .then({
        body => {
          res.send(jsonify(titleList(body)));
        }
      })
      .catch(err => {
        reportError('perform your search', err);
      });
  }
);

////// EXECUTION //////

// Make the application listen for queries.
app.listen(3000, () => {
  console.log('App queriable at http://localhost:3000/api/search/«query»');
});
