import React from 'react';
import './Home.css'; // Assuming you have a CSS file for styling
import NameForm from '../containers/NameForm/NameForm';

const Home = () => {
  return (
    <div className="w-svw h-svh flex ">
      <div className="w-1/2 bg-gray-900 flex flex-col items-center justify-center ">
        <h1 className="home-title text-7xl text-white">EL SWITCHER</h1>
      </div>
      <div className="w-1/2 bg-gray-800 flex flex-col items-center justify-center">
        <NameForm />
      </div>
    </div>
  );
};

export default Home;

