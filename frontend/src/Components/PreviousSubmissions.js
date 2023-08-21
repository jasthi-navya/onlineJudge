import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Styling/prevSubmission.module.css';

function PreviousSubmissions({ submissions }) {
 // const [selectedSubmission, setSelectedSubmission] = useState(null);
  const navigate = useNavigate();

  const handleSubmissionClick = (submissionid) => {
   // setSelectedSubmission(submission);
    navigate(`/submissiondetails/${submissionid}`);
  };

  return (
    <div>
      <h3 className={styles.title}>My Previous Submissions of the Problem</h3>
      <ul>
        {submissions.map((submission) => (
          <li key={submission._id}>
            <p className={styles.para}>Verdict: {submission.verdict}</p>
            <p className={styles.para}>Submission Time: {new Date(submission.createdAt).toLocaleString()}</p>
            <button className={styles.button} onClick={() => handleSubmissionClick(submission._id)}>View Code</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PreviousSubmissions;
