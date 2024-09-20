import React from 'react';
import NameForm from '../containers/NameForm/NameForm';

const Home = () => {
  return (
    <div className="w-svw h-svh flex">
      <div className="w-1/2 bg-black flex flex-col items-center justify-center ">
        <h1 className="home-title text-7xl text-white">EL SWITCHER</h1>
      </div>
      <div className="w-1/2 bg-zinc-900 flex flex-col items-center justify-center">
        <NameForm />
      </div>
    </div>
  );
};

export default Home;

