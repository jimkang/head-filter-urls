var async = require('async');
var request = require('request');

function headFilterURLs(opts, filterDone) {
  var URLs;
  var responseChecker;
  var encoding = 'utf8';

  if (opts) {
    urls = opts.urls;
    responseChecker = opts.responseChecker;
    if (opts.encoding !== undefined) {
      encoding = opts.encoding;
    }
  }

  async.filter(urls, urlResponseIsValid, filterDone);

  function urlResponseIsValid(url, done) {
    var requestOpts = {
      method: 'HEAD',
      url: url,
      encoding: encoding
    };
    request(requestOpts, checkResponse);

    function checkResponse(error, response) {
      if (error || response.statusCode !== 200) {
        done(null, false);
      }
      else if (responseChecker) {
        responseChecker(response, translateCheckerResult);
      }
      else {
        done(null, true);
      }

      function translateCheckerResult(error, result) {
        if (!error && result) {
          done(null, true);
        }
        else {
          done(null, false);
        }
      }
    }
  }
}

module.exports = headFilterURLs;
