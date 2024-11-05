import React, { useState } from 'react';
import { MdLogout } from "react-icons/md";
import { startGame } from '@/services/services';
import { FaPlay } from 'react-icons/fa';


export default function StartButton({ gameId, isActive }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [error, setError] = useState('');

    const onStartClick = () => {
        if (isActive) {
            startGame(gameId).catch(error => {
                setError(error.message);
                console.error(error);
            });
        }
    };

    return (
        <div className="relative w-100"> 
            <button
                onClick={onStartClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={` ${
                    isActive ? "text-green-400 cursor-pointer animate-pulse hover:scale-110 transition-transform" : "cursor-not-allowed text-zinc-700"
                }`}
                disabled={!isActive}
                data-testid="startButtonId"
            >
                <FaPlay size={28} color={`${isActive ? '' : ''}`}/>
            </button>

            {showTooltip && (
                <div className="absolute bottom-full mb-2 p-2 text-sm bg-gray-700 text-white rounded shadow-lg w-30">
                    Iniciar juego
                </div>
            )}

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
