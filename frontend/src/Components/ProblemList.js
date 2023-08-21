import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './navBara';
import NavBarU from './navBarUser';
import styles from '../Styling/ProblemList.module.css';
//import AddProblem from './addProblem';

function Problems() {
  const [problems, setProblems] = useState([]);
  const [sortedProblems, setSortedProblems] = useState([]);
  const [sortBySolv, setSortBySolv] = useState('');
  const [sortByDiff, setSortByDiff] = useState('');
  const [isAscending, setIsAscending] = useState(true);
  const [userSolvedProblems, setUserSolvedProblems] = useState([]);
  const [isAdmin,setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch problems from the backend
    fetchProblems();
    const role = localStorage.getItem('role');
    console.log(role);
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    // Sort problems based on selected criteria
    sortProblems();
  }, [problems, sortByDiff, sortBySolv, isAscending]);

  const fetchProblems = async () => {
    try {
      const response = await fetch('http://localhost:5000/problems');
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.log('Error fetching problems:', error);
    }
  };

  const sortProblems = () => {
    let sortedArray = [...problems];
  
    sortedArray.sort((a, b) => {
      const difficultyOrder = {
        easy: 0,
        medium: 1,
        hard: 2,
      };
  
      if (sortByDiff === 'difficulty') {
        return isAscending
          ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      }
  
      if (sortBySolv === 'solved') {
        return isAscending ? a.solved - b.solved : b.solved - a.solved;
      }
  
      return 0; // No sorting applied
    });
  
    setSortedProblems(sortedArray);
  };

  const fetchUserSolvedProblems = async () => {
    try {
      // Fetch user-specific solved problems from the backend
      const response = await fetch('http://localhost:5000/user/solved-problems', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUserSolvedProblems(data.solvedProblems);
    } catch (error) {
      console.log('Error fetching user-specific solved problems:', error);
    }
  };

  const handleProblemSolved = async (problemId) => {
    try {
      // Mark problem as solved by the user
      await fetch(`http://localhost:5000/user/solved-problems/${problemId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: localStorage.getItem('userId') }),
      });
      // Update the user-specific solved problems list
      fetchUserSolvedProblems();
    } catch (error) {
      console.log('Error marking problem as solved:', error);
    }
  };

  return (
    <div>
      <div>
      {isAdmin && <NavBar />}
      {!isAdmin && <NavBarU />}
      </div>
      <h2 className={styles.heading}>Problems</h2>
      <div>
      <label className={styles.sortstuff}>
  Sort by:
  {/* <select value={sortBySolv} onChange={(e) => setSortBySolv(e.target.value)}>
    <option value="">None</option>
    <option value="solved">Solved</option>
  </select> */}
  <select value={sortByDiff} onChange={(e) => setSortByDiff(e.target.value)}>
    <option value="">None</option>
    <option value="difficulty">Difficulty</option>
  </select>
</label>
        <label className={styles.sortstuff}>
          <input type="checkbox" checked={isAscending} onChange={() => setIsAscending(!isAscending)} />
          Ascending
        </label>
      </div>
        <div className="styles.container">
      <div className="row">
        {sortedProblems.map((problem) => (
          <div key={problem._id} >
            <div>
              <div>
              <Link to={`/problems/${problem._id}`} className={styles.link}>
                <h5 className={styles.title}>{problem.title}</h5>
                <p className={styles.diff}>{problem.difficulty}</p>
                {/* <p className={styles.solv}>
                  {problem.solved ? 'Solved' : 'Not Solved'}
                </p> */}
                </Link>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Problems;