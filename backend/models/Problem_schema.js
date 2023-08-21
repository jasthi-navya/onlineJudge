const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: String,
  problemStatement: String,
  difficulty: String,
  sampleCasesInput: String,
  sampleCasesOutput: String,
  hiddenTestCasesInput: String,
  hiddenTestCasesOutput: String,
});

module.exports = mongoose.model('Problem', problemSchema);
