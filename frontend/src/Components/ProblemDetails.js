import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styling/problemDetails.module.css';
import PreviousSubmissions from './PreviousSubmissions';

function ProblemDetails({ match }) {
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [verdict, setVerdict] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [showPreviousSubmissions, setShowPreviousSubmissions] = useState(false); 
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    fetchSubmissions();
  }, [id]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userid');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`http://localhost:5000/problems/${id}/submissions`, {
        headers: headers,
        userId: userId,
      });
  
      setSubmissions(response.data);
    } catch (error) {
      console.log('Error fetching submissions:', error);
    }
  };
  

  useEffect(() => {
    // Fetch problem details from the backend
    fetchProblemDetails(id);
  }, [id]);

  const fetchProblemDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/problems/${id}`);
      const data = await response.json();
      setProblem(data);
    } catch (error) {
      console.log('Error fetching problem details:', error);
    }
  };

  const setCodeAndLanguage = (code, language) => {
    setCode(code);
    setLanguage(language);
    setShowPreviousSubmissions(false);
  };

  const handleSubmission = async () => {
    try {
      // Send solution submission to the backend
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userid');
      const response = await axios.post(`http://localhost:5000/problems/${id}/execute-code`, {
        code,
        language,
        title: problem.title,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the request headers
        },
      });
      console.log('sent req');

      // Handle submission response
      if (response.data.error) {
        // Error during compilation or execution
        setVerdict(`Error: ${response.data.error}`);
      } else {
        // Successful execution, check verdict
        const { output, isCorrect } = response.data;
        setVerdict(isCorrect ? 'Successful' : 'Wrong Answer');

        // Save the submission to the backend
        saveSubmission(code, language, isCorrect);
      }
    } catch (error) {
      console.log('Submission error:', error);
    }
  };

  const saveSubmission = async (code, language, isCorrect) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/submissions`, {
        code,
        language,
        isCorrect,
        problemId: id, // Include the problem ID in the submission data
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Submission saved to MongoDB Atlas');
    } catch (error) {
      console.log('Error saving submission:', error);
    }
  };

  return (
    <div>
      {problem ? (
        <div>
          <h2 className={styles.title}>{problem.title}</h2>
          <p className={styles.para}>Difficulty: {problem.difficulty}</p>
          <p className={styles.stat}>Problem Statement: {problem.problemStatement}</p>
          <p className={styles.para}>Sample Case Input: {problem.sampleCasesInput}</p>
          <p className={styles.para}>Sample Case Output: {problem.sampleCasesOutput}</p>
          <textarea
            rows={10}
            cols={50}
            placeholder="Enter your code here"
            value={code}
            onChange={(e) => setCode(e.target.value)} className={styles.ta}
          ></textarea>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className={styles.sort}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
          <button className={styles.button} onClick={handleSubmission}>Submit</button>
          <p className={styles.para}>Verdict: {verdict}</p>
          {showPreviousSubmissions ? (
        <PreviousSubmissions submissions={submissions} onSelectSubmission={setCodeAndLanguage} />
      ) : (
        <button className={styles.button} onClick={() => setShowPreviousSubmissions(true)}>Show Previous Submissions</button>
      )}
        </div>
      ) : (
        <p className={styles.para} >Loading problem details...</p>
      )}
    </div>
  );
}

export default ProblemDetails;

