import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import { getPlayers, getBoard, calculateFigures } from '@/services/services';
import { useActiveGameSocket } from '@/components/hooks/use-active_game-socket';
import { useUpdateBoardSocket } from '@/components/hooks/use-update_board-socket';
import { fetchTurnInfo } from '@/services/services';
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
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSocketContext } from '@/context/SocketContext';

export default function ActiveGame() {
  const { gameId } = useParams();
  const { players, setPlayers, playerId, currentTurn, setCurrentTurn } = useGameContext();
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
  
  
  
  const getTurnInfo = useCallback(async () => {
    try {
      const newTurnData = await fetchTurnInfo(gameId);
      if (newTurnData.current_player_id) {
        setCurrentTurn(newTurnData.current_player_id);
        setFetchedTurn(newTurnData.current_player_id); // Store fetched value
        setBlockedColor(newTurnData.blocked_color);
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
  }, [gameId, setPlayers]);

  const fetchBoard = useCallback(async () => {
    try {
      // console.log("fetchBoard ejecutado");
      const res = await getBoard(gameId);
      console.log(res);
      setBoxes(res.boxes);
      setFiguresFormed(res.formed_figures);
      // setSyncEffect(true);
      // return;
    } catch (err) {
      console.error("Error fetching board:", err);
    }
  }, [gameId]);



  const resetFigureSelection = useCallback(() => {
    // console.log('reset cardFigureSelect:', selectedCardFigure);
    // console.log('reset boardFigureSelect:', selectedBoardFigure);
    setSelectedBoardFigure([]);
    setSelectedCardFigure(null);
  }, [setSelectedBoardFigure, setSelectedCardFigure]); // Ensure this only depends on relevant state

  const resetMovement = useCallback(() => {
    // console.log('reset cardMovementSelect:', selectedMovementCard);
    // console.log('reset cardPositionsSelect:', selectedMovementPositions);
    setSelectedMovementCard(null);
    setSelectedMovementPositions([]);
  }, [setSelectedMovementCard, setSelectedMovementPositions]);


  useEffect(() => {
    Promise.all([fetchPlayers(), fetchBoard(), getTurnInfo()]).then(() => {
      // console.log(fetchedTurn); // Use fetchedTurn instead of currentTurn
      if (fetchedTurn === playerId) {
        // console.log("HOLLAAAAdsfsdf");
        calculateFigures(gameId); // highlight board figures
      }
    });
  }, [fetchBoard, fetchPlayers, getTurnInfo, fetchedTurn]);


  // Existing effect for resetting movement on turn change
  useEffect(() => {
    if (currentTurn !== playerId && gameId) {
      resetMovement();  // Reset if turn changes
    }
  }, [gameId, currentTurn, playerId, resetMovement]);


  useActiveGameSocket(gameId, fetchPlayers);
  useUpdateBoardSocket(gameId, fetchBoard, setSyncEffect, setLoadingFig);
  useTurnInfoSocket(gameId, fetchBoard, setLoadingFig, setSyncEffect);


  const otherPlayers = players.filter(p => p.id !== playerId);

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
      <div className="flex flex-row w-full text-white  justify-center ">
        {otherPlayers.map((player) => (
          <div key={player.id} className="relative w-[600px] mx-10">
            <PlayerPanel
              game={gameId}
              player={player.id}
              name={player.name}
              setSelectedCardFigure={setSelectedCardFigure}
              selectedCardFigure={selectedCardFigure}

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
             />


            :<>Loading board...</>}
            {currentTurn !== playerId && currentTurn && (
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
                />
            </div>
            <div className="flex-grow">
              <CardsFigure
                gameId={gameId}
                playerId={playerId}
                setSelectedCardFigure={setSelectedCardFigure}
                selectedCardFigure={selectedCardFigure}
                resetMovement={resetMovement}
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
        <EndTurnButton gameId={gameId} currentTurn={currentTurn} getTurnInfo={getTurnInfo} resetFigureSelection={resetFigureSelection} resetMovement={resetMovement} setLoadingFig={setLoadingFig}/>
        
      </motion.div>
    </div>
  );
}
