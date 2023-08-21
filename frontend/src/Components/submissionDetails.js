import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styling/problemDetails.module.css';

function SubmissionDetails() {

  const { submissionid } = useParams();
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [submissionid]);

  const fetchSubmissionDetails = async () => {
    try {
    const response = await axios.get(`http://localhost:5000/submissions/${submissionid}`);
    setSubmission(response.data);
    } catch (error) {
      console.log('Error fetching submission details:', error);
    }
  };
  
  return (
    <div>
      {submission ? (
        <div>
          <h2 className={styles.title}>Submission Details</h2>
          <p className={styles.para}>Verdict: {submission.verdict}</p>
          <p className={styles.para}>Submission Time: {new Date(submission.createdAt).toLocaleString()}</p>
          <h3 className={styles.title}>Submitted Code:</h3>
          <pre className={styles.ta}>{submission.code}</pre>
        </div>
      ) : (
        <p>Loading submission details. huhu..</p>
      )}
    </div>
  );

}

export default SubmissionDetails;
