import { z } from "zod"


const formSchema = z.object({
    name: z.string().min(1, "El nombre de la partida es obligatorio"),
    password: z.string()
    .optional()
    .min(8,"La contraseña debe tener 8 caracteres mínimo")
    .max(16,"La contraseña debe tener 16 caracteres máximo")
})