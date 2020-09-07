var reporter = require('cucumber-html-reporter');

var options = {
  theme: 'bootstrap',
  jsonFile: 'test/report/cuke.json',
  output: 'test/report/cuke.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true
};

reporter.generate(options);