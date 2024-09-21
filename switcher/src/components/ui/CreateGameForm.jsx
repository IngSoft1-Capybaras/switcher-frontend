import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import Slider from '@mui/material/Slider';
import { Button } from "./button";

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
        color: '#3b82f6', // Tailwind blue-500 color
        '& .MuiSlider-thumb': {
          backgroundColor: '#2563eb', // Tailwind blue-600 color
        },
        '& .MuiSlider-track': {
          backgroundColor: '#3b82f6', // Tailwind blue-500 color
        },
        '& .MuiSlider-rail': {
          backgroundColor: '#93c5fd', // Tailwind blue-300 color
        },
      }}
    />
  );
}

export default function CreateGameForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
      playersRange: [MIN_PLAYERS, MAX_PLAYERS],
    },
  });

  const onSubmit = (data) => {
    console.log('Datos del formulario: ', data);
    form.reset();
  };

  return (
    <form 
      data-testid="formComponent" 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="space-y-8 bg-zinc-700 p-6 rounded-lg shadow-lg"
    >
      <div className="mb-4"> {/* Added vertical spacing */}
        <label className="block text-lg mb-2">Nombre de la partida</label>
        <input 
          placeholder="Ingrese el nombre de la partida" 
          {...form.register('name')} 
          className="p-2 w-full rounded bg-white text-black"
        />
        {form.formState.errors.name && <p className="text-red-500">{form.formState.errors.name.message}</p>}
      </div>

      <div className="mb-4"> {/* Added vertical spacing */}
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

      <div className="mb-4"> {/* Added vertical spacing */}
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
        <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-1/3">Crear</Button>
      </div>
    </form>
  );
}
