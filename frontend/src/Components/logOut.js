import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import styles from '../Styling/Logout.module.css';
import style from '../Styling/Main.module.css';


const Navigation = () => (
  <nav>
    <ul className={style.container}>
      <li className={style.btn}>
        <Link className={style.lin} to="/new-Blog">New Blog</Link>
      </li>
      <li className={style.btn}>
        <Link className={style.lin} to="/blog-list">Blog List</Link>
      </li>
      <li className={style.btn}>
        <Link className={style.lin} to="/news-page">News</Link>
      </li>
      <li className={style.btn}>
        <Link className={style.lin} to="/log-out">Log Out</Link>
      </li>
      <li className={style.btn}>
        <Link className={style.lin} to="/myblogs">My Blogs</Link>
      </li>
    </ul>
  </nav>
);

const Logout = () => {
  localStorage.removeItem('token');
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate('/Login');
  };

  useEffect(() => {
    const handleBrowserBackButton = (event) => {
      event.preventDefault();
      const token = localStorage.getItem('token');
      if (!token) {
        handleBackButton();
      }
    };

    window.addEventListener('popstate', handleBrowserBackButton);

    return () => {
      window.removeEventListener('popstate', handleBrowserBackButton);
    };
  }, []);

  const handleLogout = () => {

    const handleBrowserBackButton = (event) => {
      event.preventDefault();
      const token = localStorage.getItem('token');
      if (!token) {
        handleBackButton();
      }
    };
    localStorage.removeItem('token');
    navigate('/Login');
    window.addEventListener('popstate', handleBrowserBackButton);
  };

  return (
    <div>
      <div className={styles.screen}>
      <button className={styles.btn} onClick={handleLogout}>Logout..?</button>
      </div>
    </div>
  );
}

export default Logout;
