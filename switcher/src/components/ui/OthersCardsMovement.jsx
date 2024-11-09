import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { cardImg } from '../utils/getCardImg';
import { getDeckMovement } from '@/services/services';
import { useUpdateCardsMovementSocket } from '@/components/hooks/used-update-cards_movement-socket';
import { AnimatedGroup } from './animated-group';
import { useGameContext } from "@/context/GameContext";

export default function OthersCardsMovement({ gameId }) {
    const { playerId, currentTurn } = useGameContext();
    const [movementCards, setMovementCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMovementCards = async () => {
        try {
            const cards = await getDeckMovement(gameId, playerId);
            setMovementCards(cards);
        } catch (error) {
            setError("Error al obtener las cartas de movimiento");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardPlayed = (cardId) => {
        setMovementCards((prevCards) => prevCards.filter(card => card.id !== cardId));
    };

    useEffect(() => {
        fetchMovementCards();
    }, [gameId, playerId]);

    useUpdateCardsMovementSocket(gameId, playerId, fetchMovementCards);

    if (loading) return <div className='m-auto align-middle'>Cargando cartas de movimiento...</div>;
    if (error) return <div className='w-full h-full mt-10 text-center'>{error}</div>;

    return (
        <AnimatedGroup
            className='flex justify-center items-center transform translate-x-[-9rem] translate-y-[-23rem]'
            variants={{
                container: {
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.05,
                        },
                    },
                },
                item: {
                    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
                    visible: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: {
                            duration: 1.2,
                            type: 'spring',
                            bounce: 0.3,
                        },
                    },
                },
            }}
        >
            {movementCards.slice(0, 3).map((card, index) => (
                <div
                    key={card.id}
                    className={cn(
                        "relative h-28 w-auto rounded-lg overflow-hidden transform",
                        index === 0 ? '-rotate-0 translate-x-[5rem] translate-y-[-0rem] z-30' :
                        index === 1 ? 'rotate-0 translate-x-[-1rem] translate-y-[-1.1rem] z-20' :
                        'rotate-0 translate-x-[-7rem] translate-y-[-2rem] z-10'
                    )}
                    style={{ pointerEvents: 'none' }}
                    onClick={() => handleCardPlayed(card.id)}
                >
                    <img
                        src={cardImg("DORSO_MOV")}
                        alt="Dorso de carta de movimiento"
                        className="object-cover w-full h-full"
                    />
                </div>
            ))}
        </AnimatedGroup>
    );
}
