import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {useState} from "react";
import Slider from '@mui/material/Slider';
import { Button } from "./button";
import { useGameContext } from "@/context/GameContext";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;


const formSchema = z.object({
  name: z.string().min(1, "El nombre de la partida es obligatorio"),
  password: z.string()
    .optional()
    .refine(val => val === undefined || val === '' || (val.length >= 8 && val.length <= 16), {
      message: "La contraseña debe tener entre 8 y 16 caracteres.",
    }),
  playersRange: z.array(z.number()).length(2).refine(([min, max]) => min >= MIN_PLAYERS && max <= MAX_PLAYERS, {
    message: `El rango de jugadores debe estar entre ${MIN_PLAYERS} y ${MAX_PLAYERS}.`,
  })
});

function FormSlider({ value, onChange }) {
  return (
    <Slider
      data-testid="players-slider"
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      valueLabelDisplay='auto'
      min={MIN_PLAYERS}
      max={MAX_PLAYERS}
      sx={{
        width: 200,
        color: '#eab308', // Tailwind blue-500 color
        '& .MuiSlider-thumb': {
          backgroundColor: '#eab308', // Tailwind blue-600 color
        },
        '& .MuiSlider-track': {
          backgroundColor: '#eab308', // Tailwind blue-500 color
        },
        '& .MuiSlider-rail': {
          backgroundColor: '#eab308', // Tailwind blue-300 color
        },
      }}
    />
  );
}



export default function CreateGameForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const { username } = useGameContext();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
      playersRange: [MIN_PLAYERS, MAX_PLAYERS],
    },
  });

  const onSubmit = async (data) => {
    // console.log('Datos del formulario: ', data);

    const body = {
      game: {
        name: data.name,
        maxPlayers: data.playersRange[1],
        minPlayers: data.playersRange[0],
      },
      player: {
        name: username,
        host: true,
        turn: "PRIMERO"
      }
    }

    // le pego a la api
    fetch(`${apiUrl}/games`, {
      method: 'POST', // HTTP method
      headers: {
        'Content-Type': 'application/json', // Ensures the body is sent as JSON
        // Other headers like Authorization can be added here
      },
      body: JSON.stringify(body), // Converts your data to a JSON string
    })

    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          setErrorMessage('Error al crear la partida.');
          throw new Error(errorData.message || 'An error occurred');
        });
      }
      return response.json(); // Parses the JSON response
    })
    .then(data => {
      console.log('Success:', data); // Handle success
      navigate(`games/ongoing/${data.game.id}`);
      // Perform navigation or other success actions here
    })
    .catch(error => {
      console.error('Error:', error.message); // Handle error
    });
    // form.reset();
  };

  return (
    <form 
      data-testid="formComponent" 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="space-y-8 bg-zinc-950 p-6 rounded-lg"
    >
      <div className="mb-4"> 
        <label className="block text-lg mb-2">Nombre de la partida</label>
        <input 
          placeholder="Ingrese el nombre de la partida" 
          {...form.register('name')} 
          className="p-2 w-full rounded bg-white text-black"
        />
        {form.formState.errors.name && <p className="text-red-500">{form.formState.errors.name.message}</p>}
      </div>

      <div className="mb-4"> 
        <label className="block text-lg mb-2">Rango de jugadores</label>
        <div className="flex justify-center">
          <Controller
            name="playersRange"
            control={form.control}
            render={({ field }) => (
              <FormSlider value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        {form.formState.errors.playersRange && <p className="text-red-500 text-center">{form.formState.errors.playersRange.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-2">Contraseña (opcional)</label>
        <input 
          placeholder="Ingrese una contraseña (opcional)" 
          {...form.register('password')} 
          className="p-2 w-full rounded bg-white text-black"
        />
        {form.formState.errors.password && <p className="text-red-500">{form.formState.errors.password.message}</p>}
      </div>

      {/* Centered button */}
      <div className="flex justify-center">
        <Button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded mb-6 w-1/3">Crear</Button>
      </div>

      {errorMessage && <p>{errorMessage}</p>}
    </form>
  );
}
