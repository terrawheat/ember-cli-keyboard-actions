/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var path = require('path');
var jsStringEscape = require('js-string-escape');
var app = new EmberAddon({
  eslint: {
    testGenerator: eslintTestGenerator
  }
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

function render(errors) {
  if (!errors) { return ''; };
  return errors.map(function(error) {
    return error.line + ':' + error.column + ' ' +
      ' - ' + error.message + ' (' + error.ruleId +')';
  }).join('\n');
}

function eslintTestGenerator(relativePath, errors) {
  var pass = !errors || errors.length === 0;
  return "import { describe, it }  from 'mocha';\n" +
    "import { assert } from 'chai';\n" +
    "describe('ESLint - " + path.dirname(relativePath) + "', function() {\n" +
    "  it('" + relativePath + " should pass ESLint', function() {\n" +
    "    assert.ok(" + pass + ", '" + relativePath + " should pass ESLint." +
    jsStringEscape("\n" + render(errors)) + "');\n" +
    "  });\n});\n";
}
module.exports = app.toTree();
