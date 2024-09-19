import { Slider } from '@mui/material';
import { useState } from 'react';
import { z } from "zod";

const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;


// Borro players de Schema porque el range slider de materials ui me ahorra hacer validacion 
const formSchema = z.object({
    name: z.string().min(1, "El nombre de la partida es obligatorio"),
    password: z.string()
      .optional()
      .refine(val => val === undefined || (val.length >= 8 && val.length <= 16), {
        message: "La contraseña debe tener entre 8 y 16 caracteres.",
      }),
  });


export function FormSlider() {
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
        sx={{ width: 150 }}
        />   
    )
}