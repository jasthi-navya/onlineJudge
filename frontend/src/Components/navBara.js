import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import styles from '../Styling/navbar.module.css';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className={styles.totallist}>
            <li className={styles.listelement}>
                <Link className="nav-link" to="/AddProblem">Add Problem</Link>
            </li>
            <li className={styles.listelement}>
            <Link className="nav-link" to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
