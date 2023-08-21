import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import styles from '../Styling/SignUp.module.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [secretCodeError, setSecretCodeError] = useState('');
  const [role, setRole] = useState('');
  const [roleError, setRoleError] = useState('');
  const navigate = useNavigate();

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
    } else if (password.length < 6) {
      setPasswordError('Password should be at least 6 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    validateEmail();
    validatePassword();
  
    if (emailError || passwordError || secretCodeError || roleError) {
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/login', {  // Updated URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const { token, role, userid } = await response.json();
        localStorage.setItem('token', token);
        // const { role } = await response.json();
        localStorage.setItem('role', role);
        localStorage.setItem('userid',userid);
        console.log('Login successful');
        console.log('Token:', token); 
        navigate('/ProblemList');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.txt}>Login</h2>
      <input
        className={styles.ip}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={validateEmail}
      />
      {emailError && <div className={styles.error}>{emailError}</div>}
      <input
        className={styles.ip}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={validatePassword}
      />
      {passwordError && <div className={styles.error}>{passwordError}</div>}
      <button className={styles.btn} onClick={handleLogin}>
        Login
      </button>
      <p className={styles.txt2}>Already Signed up??</p>
      <Link className={styles.btn} to="/signup">
        Signup
      </Link>
    </div>
  );
}

export default SignUp;