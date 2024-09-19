import React from 'react';
import './Home.css'; // Assuming you have a CSS file for styling
import NameForm from '../containers/NameForm/NameForm';

const Home = () => {
  return (
    <div className="container">
      <div className="left-box">
        <h1 className="home-title">EL SWITCHER</h1>
      </div>
      <div className="right-box">
        <NameForm />
      </div>
    </div>
  );
};

export default Home;

