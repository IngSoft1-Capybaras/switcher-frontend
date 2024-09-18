import { Slider } from '@mui/material';
import { useState } from 'react';
import { z } from "zod"

const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;


// Borro players de Schema porque el range slider de materials ui me ahorra hacer validacion 
const formSchema = z.object({
    name: z.string().min(1, "El nombre de la partida es obligatorio"),
    password: z.string()
    .optional()
    .min(8,"La contraseña debe tener 8 caracteres mínimo")
    .max(16,"La contraseña debe tener 16 caracteres máximo")
})


function FormSlider() {
    const [SliderValue, setSliderValue] = useState([MIN_PLAYERS,MAX_PLAYERS]);
    
    const handleSliderChange = (event, newValue) => {
        console.log(event); 
        console.log(newValue); 
        setSliderValue(newValue); 
      };
      
    return(
        <Slider
        value={SliderValue}
        onChange={handleSliderChange}
        valueLabelDisplay='auto'
        min={MIN_PLAYERS}
        max={MAX_PLAYERS}
        />   
    )
}