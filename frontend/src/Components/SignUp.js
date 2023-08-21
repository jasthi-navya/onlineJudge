import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import Login from './Login';
import styles from '../Styling/SignUp.module.css';

function SignUp(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [secretCode, setsecretCode] = useState('');
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

    const validateSecretCode = async () => {
      if (!secretCode) {
        setSecretCodeError('Code required');
      } else if (role === 'Admin' || role === 'admin') {
        try {
          const response = await fetch('/secret-code');
          const data = await response.json();
    
          if (response.ok) {
            // Use the secret code in your frontend code
            const storedSecretCode = data.secretCode;
            console.log('Secret Code:', storedSecretCode);
    
            // Compare the provided secretCode with the stored secret code
            if (secretCode !== storedSecretCode) {
              setSecretCodeError('Invalid Code for admin');
            } else {
              setSecretCodeError('');
            }
          } else {
            console.error('Error:', response.status);
          }
        } catch (error) {
          console.error('Error fetching secret code:', error);
        }
      } else if (role === 'User' || role === 'user') {
        // Compare the provided secretCode with the stored secret code
        if (secretCode !== 'User' && secretCode !== 'user') {
          setSecretCodeError('Invalid Code for user');
        } else {
          setSecretCodeError('');
        }
      } else {
        setSecretCodeError('');
      }
    };
    
    
      const validateRole = () => {
        if (!role) {
          setRoleError('Role is required');
        } else {
          setRoleError('');
        }
      };

    const handleSignup = async () => {
        validateEmail();
        validatePassword();
        validateSecretCode();
        validateRole();
    
        if (emailError || passwordError || secretCodeError || roleError) {
          return;
        }
    
        try {
          const response = await axios.post('http://localhost:5000/signup', {
            email,
            password,
            role,
            secretCode,
          });
          console.log(response.data);
          navigate('/login');
        } catch (error) {
          console.log(error.response.data);
        }
      };

    return (
        <div className={styles.container}>
          <h2 className={styles.txt}>Signup</h2>
          <input className={styles.ip}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={validateEmail}
          />
          {emailError && <div className={styles.error}>{emailError}</div>}
          <input className={styles.ip}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={validatePassword}
          />
          {passwordError && <div className={styles.error}>{passwordError}</div>}
          <input className={styles.ip}
            type="role"
            placeholder="Enter 'User' if User, else enter 'Admin' if Admin"
            value={role}
            onChange={e => setRole(e.target.value)}
            onBlur={validateRole}
          />
          {roleError && <div className={styles.error}>{roleError}</div>}
          <input className={styles.ip}
            type="secretCode"
            placeholder="Enter 'User' if User, else the secret code"
            value={secretCode}
            onChange={e => setsecretCode(e.target.value)}
            onBlur={validateSecretCode}
          />
          {secretCodeError && <div className={styles.error}>{secretCodeError}</div>}
          <button className={styles.btn} onClick={handleSignup}>Signup</button>
          <p className={styles.txt2} >Already Signed up??</p>
          <Link className={styles.btn} to="/Login">Login</Link>
        </div>
    );
}

export default SignUp;
