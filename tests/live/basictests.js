var test = require('tape');
var headFilterURLs = require('../../index');
var callNextTick = require('call-next-tick');
var pathExists = require('object-path-exists');
var assertNoError = require('assert-no-error');

function isImageMIMEType(response, done) {
  if (pathExists(response, ['headers', 'content-type'])) {
    callNextTick(
      done, null, response.headers['content-type'].indexOf('image/') === 0
    );
  }
  else {
    callNextTick(done, null, false);
  }
}

var testCases = [
  {
    opts: {
      urls: [
        'http://images.nypl.org/index.php?id=4033624&t=g',
        'http://images.nypl.org/index.php?id=1638888&t=g',
        'http://images.nypl.org/index.php?id=5337461&t=g'
      ],
      responseChecker: isImageMIMEType,
      encoding: null
    },
    expected: [
        'http://images.nypl.org/index.php?id=4033624&t=g',
        'http://images.nypl.org/index.php?id=5337461&t=g'
    ]
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test('Filter test', function basicTest(t) {
    headFilterURLs(testCase.opts, checkResult);

    function checkResult(error, urls) {
      assertNoError(t.ok, error, 'No error while filtering.');
      t.deepEqual(urls, testCase.expected, 'Picks correct URLs.');
      t.end();
    }
  });
}
