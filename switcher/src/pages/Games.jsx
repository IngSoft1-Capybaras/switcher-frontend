import GamesList from '../containers/NameForm/GamesList';


const Games = () => {

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black space-y-20">
      <h1 className="text-5xl font-bold mb-6 text-white">Lista de partidas</h1>
      <div className="w-1/3 text-white">
        < GamesList />
      </div>
    </div>
  );
};

export default Games;
