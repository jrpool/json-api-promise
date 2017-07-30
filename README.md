# json-api-promise
Express API using request-promise-native and cheerio to fetch HTML and responding with JSON

## Project Members

[Jonathan Pool](https://github.com/jrpool)

## modules

```
app.js
```

## Discussion

### General

This application demonstrates the use of:

- The [`express` package][exp] to create an API that receives HTTP requests and responds with JSON

- The [`request-promise-native` package][epn] to make the API fetch data from a remote server

- The [`cheerio` package][cheerio] to process the HTML data received from the remote server

The demonstration takes the form of a search service for motion pictures. You can use it to get information from IMDB in response to a query string.

The application fulfills the requirements of the “Movie Search API” module in Phase 2 of the [Learners Guild][lg] curriculum.

### Implementation notes

Direct searching at the IMDB website will in some cases yield more hits than this application does, because this application disregards title lines that do not begin with a title, a space, an opening parenthesis, a year, and a closing parenthesis. A minority of IMDB title lines fail to conform to that format.

In order to satisfy the requirement that the content type of the response must be `application/json` and, simultaneously, the requirement that the JSON response must be multi-line and indented, the application deviates from what might otherwise be the most straightforward methods. Specifically:

- It avoids using the `res.json()` method of Express. That method provides the right header, but does not allow JSON responses to be multi-line and embedded. Instead, the application formats the JSON string itself and uses the `res.send()` method to serve it.

- Thus, it uses the `res.send()` method, but does not make the JSON string its argument, because if it did so then the response content type would have to be `text/html`.

- Thus, it converts the JSON string to a Buffer object and uses that as the `res.send()` argument, because Express allows the default `application/octet-stream` content type to be overridden when a Buffer object is the argument of `res.send()`.

- Thus, it pre-defines the content type as `application/json`, but not using the `res.type()` method, because Express accepts a content-type override only if the type has been set by means of the more verbose `res.set()` method.

## Installation and Setup

0. These instructions presuppose that (1) [npm][npm] is installed.

1. Your copy of this project will be located in its own directory, inside some other directory that you may choose or create. For example, to create that parent directory inside your own home directory’s `Documents` subdirectory and call it `projects`, you can execute:

    `mkdir ~/Documents/projects`

Make that parent directory your working directory, by executing, for example:

    `cd ~/Documents/projects`

2. Clone this project’s repository into it, thereby creating the project directory, named `file-api`, by executing:

    `git clone https://github.com/jrpool/json-api-promise.git json-api-promise`

2. Make the project directory your working directory by executing:

    `cd json-api-promise`

3. Install required dependencies (you can see them listed in `package.json`) by executing:

    `npm i`

## Usage and Examples

To start the application, execute `npm start` (or, if under Windows, `npm run startwin`).

To conduct a motion-picture search, submit a query to the application by using a web browser or (in a separate terminal window)`cURL` to request a URL conforming to these examples:

`http://localhost:3000/api/search/nuclear` (browser)
`http://localhost:3000/api/search/nuclear waste` (browser)
`curl http://localhost:3000/api/search/nuclear` (`cURL`)
`curl http://localhost:3000/api/search/nuclear%20waste` (`cURL`)

As shown, your search string must be URL-encoded. `cURL` does not do this for you, but browsers typically do.

To perform linting, execute `npm run lint`.

[cheerio]: https://www.npmjs.com/package/cheerio
[exp]: https://www.npmjs.com/package/express
[lg]: https://www.learnersguild.org
[rpn]: https://www.npmjs.com/package/request-promise-native
