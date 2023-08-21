const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  title: String,
  hiddenTestCasesInput: String,
  hiddenTestCasesOutput: String,
});

const TestCase = mongoose.model('TestCase', testCaseSchema);

module.exports = TestCase;