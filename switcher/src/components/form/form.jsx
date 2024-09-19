import { Button, Slider } from '@mui/material';
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;

const formSchema = z.object({
  name: z.string().min(1, "El nombre de la partida es obligatorio"),
  password: z.string()
    .optional()
    .refine(val => val === undefined || val =='' || (val.length >= 8 && val.length <= 16), {
      message: "La contraseña debe tener entre 8 y 16 caracteres.",
    }),
  playersRange: z.array(z.number()).length(2).refine(([min, max]) => min >= MIN_PLAYERS && max <= MAX_PLAYERS, {
    message: `El rango de jugadores debe estar entre ${MIN_PLAYERS} y ${MAX_PLAYERS}.`,
  })
});

function FormSlider({ value, onChange }) {
  return (
    <Slider
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      valueLabelDisplay='auto'
      min={MIN_PLAYERS}
      max={MAX_PLAYERS}
      sx={{ width: 150 }}
    />
  );
}

export function CreateGameForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
      playersRange: [MIN_PLAYERS, MAX_PLAYERS],  // valor inicial del slider
    },
  });

  const onSubmit = (data) => {
    console.log('Datos del formulario: ', data);
    form.reset()
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label>Nombre de la partida</label>
        <br />
        <input placeholder="Ingrese el nombre de la partida" {...form.register('name')} />
        {form.formState.errors.name && <p>{form.formState.errors.name.message}</p>}
      </div>

      <div>
        <label>Rango de jugadores</label>
        <br />
        <Controller
          name="playersRange"
          control={form.control}
          render={({ field }) => (
            <FormSlider value={field.value} onChange={field.onChange} />
          )}
        />
        {form.formState.errors.playersRange && <p>{form.formState.errors.playersRange.message}</p>}
      </div>

      <div>
        <label>Contraseña</label>
        <br />
        <input placeholder="Ingrese una contraseña (opcional)" {...form.register('password')} />
        {form.formState.errors.password && <p>{form.formState.errors.password.message}</p>}
      </div>

      <Button type='submit'>Crear</Button>
    </form>
  );
}
