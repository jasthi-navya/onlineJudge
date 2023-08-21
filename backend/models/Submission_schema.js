const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  problem: { type: mongoose.Types.ObjectId, ref: 'Problem' },
  code: { type: String, required: true },
  language: { type: String, required: true },
  verdict: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
