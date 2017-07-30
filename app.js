// Create a server application.
const app = require('express')();

// Import required modules.
const querystring = require('querystring');
const rpn = require('request-promise-native');
const cheerio = require('cheerio');

// Identify the external request that will be made, except the “q” parameter.
const url = 'http://www.imdb.com/find';
const queryParams = {
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
    const subTexts = listText.match(/^([^()]+) \((\d{4})\)/);
    if (subTexts) {
      listObject.movies.push({'name': subTexts[1], 'year': subTexts[2]});
    }
  });
  return JSON.stringify(listObject, null, 2);
};

/// /// CLIENT REQUEST ROUTES /// ///

// Perform a search.
app.get(
  '/api/search/:q',
  (req, res) => {
    queryParams.q = req.params.q;
    const urlWithQuery = url + '?' + querystring.stringify(queryParams);
    rpn(urlWithQuery)
      .then(body => {
        res.set('Content-Type', 'application/json');
        res.send(Buffer.from(jsonify(titleList(body))));
      })
      .catch(err => {reportError('perform your search', err);});
  }
);

/// /// EXECUTION /// ///

// Make the application listen for queries.
app.listen(3000, () => {
  console.log('App queriable at http://localhost:3000/api/search/«query»');
});
