const TestCase = require('../models/testCase'); // Adjust the path

async function getTestcases(title) {
  try {
    const testcases = await TestCase.find({ title: title });
    return testcases;
  } catch (e) {
    console.log(e, "Error getting test cases");
    return [];
  }
}

module.exports = { getTestcases };

