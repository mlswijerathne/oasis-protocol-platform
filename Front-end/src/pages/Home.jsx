import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1> Welcome to the OASIS Platform</h1>
      <p>Secure and gamified coding platform for teams</p>
      <nav style={{ marginTop: '1rem' }}>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </div>
  );
};

export default Home;
