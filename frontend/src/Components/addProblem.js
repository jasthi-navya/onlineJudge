import React, { useState } from 'react';
import NavBar from './navBara';
import styles from '../Styling/addProblem.module.css';

function AddProblem() {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [sampleCasesInput, setSampleCasesInput] = useState('');
  const [sampleCasesOutput, setSampleCasesOutput] = useState('');
  const [hiddenTestCaseInput,setHiddenTestCasesInput] = useState('');
  const [hiddenTestCaseOutput,setHiddenTestCasesOutput] = useState('');
  const [tcTitle,setTcTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send problem data to the backend
      const response = await fetch('http://localhost:5000/problems', {
        method: 'POST',
        headers: {    
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          difficulty,
          problemStatement,
          sampleCasesInput, 
          sampleCasesOutput,
        }),
      });

      // Handle submission response
      if (response.ok) {
        // Problem added successfully, redirect to some other page
        setTitle('');
        setDifficulty('');
        setProblemStatement('');
        setSampleCasesInput('');
        setSampleCasesOutput('');
        const responseData = await response.json();
      console.log(responseData.message);
      } else {
        // Problem addition failed, handle error
        const data = await response.json();
        console.log('Problem addition error:', data.error);
      }
    } catch (error) {
      console.log('Problem addition error:', error);
    }
  };

  const handleTestCases = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/test-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: tcTitle, 
          hiddenTestCasesInput: hiddenTestCaseInput,
          hiddenTestCasesOutput: hiddenTestCaseOutput,
        }),
      });

      // Handle submission response
      if (response.ok) {
        // Test cases added successfully, reset testCases state
        setTcTitle('');
        setHiddenTestCasesOutput('');
    setHiddenTestCasesInput('');
    const responseData = await response.json();
      console.log(responseData.message);
      } else {
        // Test case addition failed, handle error
        const data = await response.json();
        console.log('Test case addition error:', data.error);
      }
    } catch (error) {
      console.log('Test case addition error:', error);
    }
  }

  return (
    <div>
      <NavBar />
      <h2 className={styles.title}>Add Problem</h2>
      <form onSubmit={handleSubmit}>
        <label className={styles.ip}>
          Title:
          <input className={styles.ip_in} type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className={styles.ip}>
          Difficulty:
          <input className={styles.ip_in} type="text" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
        </label>
        <label className={styles.ip}>
          Problem Statement:
          <textarea rows={10} value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} />
        </label>
        <label className={styles.ip}>
          Sample Case:
          <br />
          Input:
          <input className={styles.ip_in} type="text" value={sampleCasesInput} onChange={(e) => setSampleCasesInput(e.target.value)} />
          <br />
          Output:
          <input className={styles.ip_in} type="text" value={sampleCasesOutput} onChange={(e) => setSampleCasesOutput(e.target.value)} />
        </label>
        <button className={styles.button} type="submit">Submit</button>
      </form>
      <form onSubmit={handleTestCases}>
      <label className={styles.ip}>
          Hidden Sample Case:
          <br />
          Title:
          <input className={styles.ip_in} type="text" value = {tcTitle} onChange = {(e) => setTcTitle(e.target.value)} />
          <br />
          Input:
          <input className={styles.ip_in} type="text" value={hiddenTestCaseInput} onChange={(e) => setHiddenTestCasesInput(e.target.value)} />
          <br />
          Output:
          <input className={styles.ip_in} type="text" value={hiddenTestCaseOutput} onChange={(e) => setHiddenTestCasesOutput(e.target.value)} />
        </label>
        <button className={styles.button} type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddProblem;
