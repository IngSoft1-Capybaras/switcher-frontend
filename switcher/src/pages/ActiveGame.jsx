import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { getPlayers, getBoard, calculateFigures, pathEndTurn, startGame } from '@/services/services';
import { useActiveGameSocket } from '@/components/hooks/use-active_game-socket';
import { useUpdateBoardSocket } from '@/components/hooks/use-update_board-socket';
import { fetchGameState } from '@/services/services';
import { motion, sync } from 'framer-motion';
import CardsMovement from '../components/ui/CardsMovement';
import CardsFigure from '../components/ui/CardsFigure';
import PlayerPanel from '../components/ui/PlayerPanel';
import Board from '../components/ui/GameBoard';
import { useTurnInfoSocket } from '@/components/hooks/use-turn_info-socket';
import Chat from '@/components/ui/chat';
import EndTurnButton from '@/components/ui/EndShiftButton';
import LeaveButton from '@/components/ui/LeaveButton';
import UndoButton from '@/components/ui/undoButton';
import ClaimFigureButton from '@/components/ui/claimFigureButton';
import ConfirmMovementButton from '@/components/ui/ConfirmButton';
import BlockCardFigureButton from '@/components/ui/BlockCardFigureButton';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSocketContext } from '@/context/SocketContext';
import { parse } from 'dotenv';

export default function ActiveGame() {
  const { gameId } = useParams();
  const { players, setPlayers, currentTurn, setCurrentTurn, username, setPlayerId, setUsername } = useGameContext();
  const {socket} = useSocketContext();
  const [boxes, setBoxes] = useState();
  const [selectedMovementCard, setSelectedMovementCard] = useState(null);
  const [selectedMovementPositions, setSelectedMovementPositions] = useState([]);
  const [blockedColor, setBlockedColor] = useState(null);
  const [selectedBoardFigure, setSelectedBoardFigure ] = useState([]);
  const [selectedCardFigure, setSelectedCardFigure] = useState(null);
  const [figuresFormed, setFiguresFormed] = useState([]);
  const [fetchedTurn, setFetchedTurn] = useState(null);
  const [loadingFig, setLoadingFig] = useState(false);
  const [loadingOut, setLoadingOut] = useState(false);
  const [syncEffect, setSyncEffect] = useState(true);
  const [previousPlayers, setPreviousPlayers] = useState(players);
  const [selectedBlockCard, setSelectedBlockCard] = useState(null);
  let {playerId} = useParams();
  playerId = Number(playerId);

  // variables para manejar local storage
  const location = useLocation();
  const url = location.pathname;
  /*
  window.performance.getEntriesByType("navigation") method returns an array of PerformanceNavigationTiming entries, which includes the type of page load
    . "navigate": TYPE_NAVIGATE (Basic navigation)
    . "reload": TYPE_RELOAD
    . "back_forward": TYPE_BACK_FORWARD
    . "prerender": TYPE_PRERENDER
  */
  let navigationType = window.performance.getEntriesByType("navigation")[0].type;

  //const TIMER_DURATION = 120000;


  const getTurnInfo = useCallback(async () => {
    try {
      const newTurnData = await fetchGameState(gameId);
      if (newTurnData.current_player) {
        setCurrentTurn(newTurnData.current_player);
        setFetchedTurn(newTurnData.current_player); // Store fetched value
        
        setBlockedColor(newTurnData.forbidden_color);
      } else {
        console.error("Received an undefined player ID.");
      }
    } catch (err) {
      // console.log(err);
      throw err;
    }
  }, [setCurrentTurn, gameId]);

  const fetchPlayers = useCallback(async () => {
    try {
      const fetchedPlayers = await getPlayers(gameId);
      setPlayers(fetchedPlayers);

      const isHost = fetchedPlayers.some(player => player.host && player.id === playerId);

      if (isHost) {
        // verifo que jugadores salieron
        const leftPlayers = previousPlayers.filter(
          prevPlayer => !fetchedPlayers.some(newPlayer => newPlayer.id === prevPlayer.id)
        );
        leftPlayers.forEach(leftPlayer => {
          if (socket) {
            socket.send(JSON.stringify({
              type: `${gameId}:CHAT_MESSAGE`,
              message: `${leftPlayer.name} se ha ido del juego.`
            }));
          }
        });

        setPreviousPlayers(fetchedPlayers);
      }
    } catch (err) {
      console.error("Error al obtener jugadores", err);
    }
  }, [gameId, setPlayers, url]);

  const fetchBoard = useCallback(async () => {
    try {
      // console.log("fetchBoard ejecutado");
      const res = await getBoard(gameId);
      console.log(res);
      setBoxes(res.boxes);
      setFiguresFormed(res.formed_figures);
      setSyncEffect(true);
      // return;
    } catch (err) {
      console.error("Error fetching board:", err);
    }
  }, [gameId]);



  const resetFigureSelection = useCallback(() => {
    setSelectedBoardFigure([]);
    setSelectedCardFigure(null);
  }, [setSelectedBoardFigure, setSelectedCardFigure]);

  const resetMovement = useCallback(() => {
    setSelectedMovementCard(null);
    setSelectedMovementPositions([]);
  }, [setSelectedMovementCard, setSelectedMovementPositions]);

  const resetBlock = useCallback(() => {
    // console.log('reset cardMovementSelect:', selectedMovementCard);
    // console.log('reset cardPositionsSelect:', selectedMovementPositions);
    setSelectedBlockCard(null);
    setSelectedBoardFigure([]);
  }, [setSelectedBlockCard, setSelectedBoardFigure]);


  useEffect(() => {
    Promise.all([fetchPlayers(), fetchBoard(), getTurnInfo()]).then(() => {
      if (fetchedTurn === playerId) {
        calculateFigures(gameId); // highlight board figures
      }
    });
  }, [fetchBoard, fetchPlayers, getTurnInfo, fetchedTurn, url]);


  useEffect(() => {
    if (currentTurn !== playerId && gameId) {
      resetMovement();  // Reset if turn changes
    }
  }, [gameId, currentTurn, playerId, resetMovement]);


  useEffect(() => {
    const TIMER_DURATION = 20000;
    const timer_storage_key = `start-time-${url}`;
    let time_remaining = TIMER_DURATION;
    console.log(`.................................`)
    if (navigationType === 'reload' && currentTurn === playerId) {
      console.log(`||||||||||||||||||||||||||||||||||||`)
      const start_time = Number(localStorage.getItem(timer_storage_key));

      if (start_time) {
        const time_elapsed = Date.now() - parseInt(start_time, 10);
        console.log(`TIME ELAPSED -> ${time_elapsed/1000}s`);
        time_remaining = Math.max(0, TIMER_DURATION - time_elapsed);
        console.log(`TIME REMAINING -> ${time_remaining/1000}s`);
      }
      localStorage.setItem(timer_storage_key, Date.now().toString());
    }

    if ((navigationType === 'navigate' || navigationType === 'prerender') && currentTurn === playerId) {
      localStorage.setItem(timer_storage_key, Date.now().toString());
    }

    const timer = setTimeout(async () => {
      if (currentTurn === playerId) {
        await pathEndTurn(gameId);
        localStorage.removeItem(timer_storage_key);
      }
    }, time_remaining);

    return () => {
      clearTimeout(timer);
    };
  }, [currentTurn, url]);


  // local storage -> seteo y obtencion de data
  useEffect(() => {

    // si recargo la pagina, traigo la data de local storage
    if (navigationType === 'reload') {
      const data = JSON.parse(localStorage.getItem(url));
      console.log(`local storage data ${JSON.stringify(data)}`);
      if(data){
        setPlayerId(data.playerId);
        setUsername(data.username);
        setCurrentTurn(data.currentTurn);
      }
    };

    // si estoy en la pagina, seteo la data en local storage
    if (navigationType === 'navigate' || navigationType === 'prerender') {
      const data = {
                    username: username,
                    playerId: playerId,
                    currentTurn: currentTurn
                   };
      localStorage.setItem(url,JSON.stringify(data));
    };
  }, [url]);

  useActiveGameSocket(gameId, fetchPlayers);
  useUpdateBoardSocket(gameId, fetchBoard, setSyncEffect, setLoadingFig);
  useTurnInfoSocket(gameId, fetchBoard, setLoadingFig, setSyncEffect);


  const otherPlayers = players.filter(p => {
    console.log(`p.id: ${JSON.stringify(p.id)}, playerID: ${JSON.stringify(playerId)}`);
    return p.id != playerId;
  });

  console.log(`player id = ${playerId}, players = ${JSON.stringify(players.map(p => p.id))}
  currentTurn = ${currentTurn}`);

  console.log("TIPOS")
  console.log(`currentTurn = ${typeof(currentTurn)}`)
  console.log(`playerId = ${typeof(playerId)}`)

  return (
    <div className="flex flex-col h-screen bg-zinc-950">

      {loadingFig && currentTurn === playerId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <AiOutlineLoading3Quarters className="animate-spin text-white" size={50} />
          <h2 className="text-white text-2xl ml-4">Calculando figuras formadas...</h2>
        </div>
      )}
      {loadingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <AiOutlineLoading3Quarters className="animate-spin text-white" size={50} />
          <h2 className="text-white text-2xl ml-4">Redirigiendo...</h2>
        </div>
      )}

      {/* Other Player Panels */}
      <div className="flex flex-row w-full text-white justify-center">
        {otherPlayers.map((player) => (
          <div key={player.id} className="relative w-[600px] mx-10">
            <PlayerPanel
              game={gameId}
              panelOwner={player.id}
              playerId={playerId}
              name={player.name}
              setSelectedCardFigure={setSelectedCardFigure}
              selectedCardFigure={selectedCardFigure}
              currentTurn={currentTurn}
              getTurnInfo={getTurnInfo}
              resetMovement={resetMovement}
              selectedBlockCard={selectedBlockCard}
              setSelectedBlockCard={setSelectedBlockCard}
              resetFigureSelection={resetFigureSelection}
              resetBlock={resetBlock}
            />
            {currentTurn === player.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-white h-1"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 120 }}

              />
            )}
          </div>
        ))}
      </div>

      {/* Board and Turn Info */}
      <div className="flex flex-col md:flex-row w-full text-white p-4 justify-center space-y-4 md:space-y-0">

        {/* Board */}
        <div className="flex flex-col justify-around items-end mr-5 p-4 md:w-1/2">
          <div className="relative">
            {boxes?
             <Board
             boxes={boxes} blockedColor={blockedColor}
             currentTurn={currentTurn} playerId={playerId}
             selectedCardFigure={selectedCardFigure}
             selectedBoardFigure={selectedBoardFigure}
             setSelectedBoardFigure={setSelectedBoardFigure}
             selectedMovementCard={selectedMovementCard}
             setSelectMovementPosition={setSelectedMovementPositions}
             selectedMovementPositions={selectedMovementPositions}
             figuresFormed={figuresFormed}
             syncEffect={syncEffect}
             selectedBlockCard={selectedBlockCard}
             />


            :<>Loading board...</>}
            {currentTurn != playerId && currentTurn && (
             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl">
               {`Turno de ${players.find(p => p.id === currentTurn)?.name}`}
             </div>
           )}
          </div>
        </div>

        {/* Right-side Panel: Turn Info and Your Cards */}
        <div className="md:w-1/2 h-full flex flex-col p-4 justify-center items-start ml-5">

          <Chat gameId={gameId}/>
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 text-white p-4 flex flex-col h-full w-[600px]">
            <h2 className="text-2xl text-center mb-10">Tus cartas</h2>
            <div className="flex-grow">
              <CardsMovement
                gameId={gameId}
                playerId={playerId}
                setSelectedMovementCard={setSelectedMovementCard}
                selectedMovementCard={selectedMovementCard}
                currentTurn={currentTurn}
                resetFigureSelection={resetFigureSelection}
                resetBlock={resetBlock}
                />
            </div>
            <div className="flex-grow">
              <CardsFigure
                gameId={gameId}
                playerId={playerId} 
                panelOwner={playerId}
                setSelectedCardFigure={setSelectedCardFigure}
                selectedCardFigure={selectedCardFigure}
                resetMovement={resetMovement}
                currentTurn={currentTurn}
                getTurnInfo={getTurnInfo}
                selectedBlockCard={selectedBlockCard}
                setSelectedBlockCard={setSelectedBlockCard}
                resetFigureSelection={resetFigureSelection}
                resetBlock={resetBlock}
                // turnBorder={turnBorder}
              />
            </div>
          </div>
          {currentTurn === playerId && (
            <motion.div
              className=" bg-green-500 h-2 z-40"
              initial={{ width: 600 }}
              animate={{ width: '0%' }}
              transition={{ duration: 120 }}
            />
          )}

        </div>
      </div>



      <motion.div
        className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-zinc-800 p-4 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <LeaveButton gameId={gameId} setLoadingOut={setLoadingOut} />
        <ClaimFigureButton gameId={gameId} cardId={selectedCardFigure ? selectedCardFigure.id : null} figure={selectedBoardFigure} resetFigureSelection={resetFigureSelection}/>
        <UndoButton gameId={gameId} currentTurn={currentTurn} setLoadingFig={setLoadingFig} resetFigureSelection={resetFigureSelection} setSyncEffect={setSyncEffect} resetMov={resetMovement}/>
        <ConfirmMovementButton gameId={gameId} playerId={playerId} currentTurn={currentTurn}
          selectedCard={selectedMovementCard} selectedPositions={selectedMovementPositions}
          resetMov={resetMovement} setLoadingFig={setLoadingFig} setSyncEffect={setSyncEffect}// agrgue el setLoading
          />
        <BlockCardFigureButton gameId={gameId} playerIdBlock={selectedBlockCard ? selectedBlockCard.player_id : null} currentTurn={currentTurn} cardId={selectedBlockCard ? selectedBlockCard.id : null} figure={selectedBoardFigure} resetBlock={resetBlock}/>
        <EndTurnButton gameId={gameId} currentTurn={currentTurn} getTurnInfo={getTurnInfo} resetFigureSelection={resetFigureSelection} resetMovement={resetMovement} setLoadingFig={setLoadingFig}/>

      </motion.div>
    </div>
  );
}
