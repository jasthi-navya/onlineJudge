import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import ProblemList from './Components/ProblemList';
import ProblemDetails from './Components/ProblemDetails';
import AddProblem from './Components/addProblem';
import NavBar from './Components/navBara';
import NavBarU from './Components/navBarUser';
import SubmissionDetails from './Components/submissionDetails';
import styles from './Styling/Main.module.css';
import Logout from './Components/logOut';
import 'bootstrap/dist/css/bootstrap.min.css';



const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<OpeningPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ProblemList" element={<ProblemList />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />
          <Route path="/AddProblem" element={<AddProblem />} />
          <Route path="/navBar" element={<NavBar />} />
          <Route path="/navBarU" element={<NavBarU />} />
          <Route path="/submissiondetails/:submissionid" element={<SubmissionDetails />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
};

const OpeningPage = () => {
  const [showSignup, setShowSignup] = useState(true);
  const [showLogin, setShowLogin] = useState(true);

  const handleSignup = () => {
    setShowSignup(false);
    return <Navigate to="/signup" />;
  };

  const handleLogin = () => {
    setShowLogin(false);
    return <Navigate to="/login" />;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.txt}>Blogs Website</h2>
      {showSignup ? (
        <div>
          <button className={styles.btn} onClick={handleSignup}>Signup</button>
        </div>
      ) : (
        <Navigate to="/signup" replace />
      )}
      {showLogin ? (
        <div>
          <button className={styles.btn} onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <Navigate to="/login" replace />
      )}
    </div>
  );
};

const SignUpPage = () => {
  return (
    <div>
      <SignUp />
    </div>
  );
};

const LoginPage = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default App;
