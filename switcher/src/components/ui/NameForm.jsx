import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

const FormSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres.",
    })
    .max(15, {
      message: "El nombre de usuario debe tener como máximo 15 caracteres.",
    }),
})

export default function InputForm() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(data) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    // redirigir
    navigate('/games');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-zinc-950 p-8 rounded-lg shadow-lg border border-zinc-900 max-w-lg mx-auto">
        <div className="space-y-10"> 
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-6 ">
                <FormLabel className="block text-lg text-white mb-2">Nombre de usuario</FormLabel>
                <FormControl>
                  <Input className="p-3 w-full rounded-lg bg-zinc-900 text-white border border-zinc-800 focus:outline-none focus:ring-2" placeholder="Ingrese su nombre de usuario" {...field} />
                </FormControl>
                <FormDescription className="text-base">
                  Este nombre será visible para el resto de jugadores.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-all duration-200 w-1/3" type="submit">Siguiente</Button>
      </form>
    </Form>
  )
}
