const express = require('express');
const app = express();
const router = express.Router();
const Problem = require('../models/Problem_schema');
const testCase = require('../models/testCase');
const Submission = require('../models/Submission_schema');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const {generateFile} = require('./fileGenerator');
const { compileAndExecuteCode } = require('./executeFile');
const authenticateToken = require('../middleware/authMiddleware.js');


router.post('/test-cases', async (req, res) => {
  const {
    title,
    hiddenTestCasesInput,
    hiddenTestCasesOutput,
  } = req.body;

  try {
    // Create a new problem
    const testcase = new testCase({
      title,
      hiddenTestCasesInput,
      hiddenTestCasesOutput,
    });

    // Save the problem to the database
    await testcase.save();
    res.status(201).json({ message: 'Test Case added successfully' });;
  } catch (error) {
    console.log('Problem addition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/problems', async (req, res) => {
  try {
    // Get all problems
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    console.log('Error fetching problems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/problems/:id', async (req, res) => {
  try {
    // Get a specific problem by ID
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      res.status(404).json({ error: 'Problem not found' });
    } else {
      res.json(problem);
    }
  } catch (error) {
    console.log('Error fetching problem:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/problems', async (req, res) => {
  const {
    title,
      difficulty,
      problemStatement,
      sampleCasesInput,
      sampleCasesOutput,
  } = req.body;

  try {
    // Create a new problem
    const problem = new Problem({
      title,
      difficulty,
      problemStatement,
      sampleCasesInput,
      sampleCasesOutput,
    });

    // Save the problem to the database
    await problem.save();
    res.status(201).json({ message: 'Problem added successfully' });
  } catch (error) {
    console.log('Problem addition error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/problems/:id/submit', async (req, res) => {
  const { code, language } = req.body;

  try {
    // Perform the submission processing and generate verdict
    // You can implement the logic for evaluating the solution and generating a verdict here
    const verdict = 'Accepted'; // Replace with your own logic

    res.json({ verdict });
  } catch (error) {
    console.log('Submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Compile and execute code
router.post('/problems/:id/execute-code', authenticateToken , async (req, res) => {
  const { code, language, title, userId} = req.body;
  const problemId = req.params.id;
  //const userId = req.user._id;

  try {
    const { isCorrect, error } = await compileAndExecuteCode(
      code,
      language,
      title,
    );

    if (error) {
      return res.json({ error });
    }

    // Save the submission to the database
    const submission = new Submission({
      user: userId,
      problem: problemId,
      code,
      language,
      verdict: isCorrect ? 'Successful' : 'Wrong Answer',
    });
    await submission.save();
    console.log('done saving');

    // Return the verdict to the frontend
    return res.json({ isCorrect });
  } catch (error) {
    console.log('Error executing code:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/problems/:id/submissions', authenticateToken , async (req, res) => {
  const {userId} = req.body;
  const problemId = req.params.id;

  try {
    const submissions = await Submission.find({  user: userId, problem: problemId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.log('Error fetching submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new route to handle code submissions
router.post('/submissions', authenticateToken, async (req, res) => {
  const { code, language, isCorrect, problemId } = req.body;
  const userId = req.user._id;

  try {
    // Save the submission to MongoDB Atlas
    const submission = new Submission({
      user: userId,
      problem: problemId,
      code,
      language,
      verdict: isCorrect ? 'Successful' : 'Wrong Answer',
    });
    await submission.save();

    // Return success response to the frontend
    res.json({ message: 'Submission saved successfully' });
  } catch (error) {
    console.log('Error saving submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/submissions/:submissionid', async (req, res) => {
  const submissionId = req.params.submissionid;

  try {
    // Fetch submission details from the database using the Submission model
    const submission = await Submission.findById(submissionId);
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Respond with the submission details
    return res.status(200).json(submission);
  } catch (error) {
    console.error('Error fetching submission details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;