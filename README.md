# json-api-promise
Express API using request-promise-native and cheerio to fetch HTML and responding with JSON

## Project Members

[Jonathan Pool](https://github.com/jrpool)

## modules

```
```

## Discussion

### General

This application demonstrates the use of:

- The [`express` package][exp] to create an API that receives HTTP requests and responds with JSON

- The [`request-promise-native` package][epn] to make the API fetch data from a remote server

- The [`cheerio` package][cheerio] to process the HTML data received from the remote server

The demonstration takes the form of a search service for motion pictures. You can use it to get information from IMDB in response to a query string.

The application fulfills the requirements of the “Movie Search API” module in Phase 2 of the [Learners Guild][lg] curriculum.

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

To conduct a motion-picture search, submit a query to the application by using a web browser or `cURL` to request a URL conforming to this example:

`http://localhost:3000/api/search/nuclear`

To perform linting, execute `npm run lint`.

[cheerio]: https://www.npmjs.com/package/cheerio
[exp]: https://www.npmjs.com/package/express
[lg]: https://www.learnersguild.org
[rpn]: https://www.npmjs.com/package/request-promise-native
