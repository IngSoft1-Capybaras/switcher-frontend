import React from 'react';
import NameForm from '../components/ui/NameForm';
import logo from '../assets/logo_switcher.png';

const Home = () => {
  return (
    <div className="w-svw h-svh flex">
      <div className="w-1/2 bg-black flex flex-col items-center justify-center ">
        <h1 className="home-title text-9xl text-white">EL SWITCHER</h1>
        <img className='h-1/3 w-auto' src={logo} />
      </div>
      <div className="w-1/2 bg-zinc-950 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-6 text-white"> ¡ A jugar !</h1>
        <NameForm />
      </div>
    </div>
  );
};

export default Home;

