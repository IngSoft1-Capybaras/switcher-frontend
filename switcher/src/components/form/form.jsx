import { Slider } from '@mui/material';
import { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


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


function FormSlider() {
    const [SliderValue, setSliderValue] = useState([MIN_PLAYERS,MAX_PLAYERS]);
    // SliderValue contiene la cantidad de jugadores [2,2],[3,3],[4,4],[2,4],[2,3],[3,4]

    const handleSliderChange = (event, newValue) => {
        console.log(event); 
        //console.log(newValue); 
        //setSliderValue(newValue); 
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

export function CreateGame() {
  // se infieren en el hook useForm todos los campos del formSchema
  const form = useForm<z.infer<typeof formSchema>>({
    // cada vez que se actualiza la data del schema, zodResolver se encarga de verificar todo
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      password:""
    }
  });



  return(
    <h1>Hola mundo</h1>
  )
}