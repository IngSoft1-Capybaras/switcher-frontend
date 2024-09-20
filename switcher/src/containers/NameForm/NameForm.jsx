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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div className="space-y-4"> {/* Add space between form items */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Ingrese su nombre de usuario</FormLabel>
                <FormControl>
                  <Input className="" placeholder="Nombre de usuario" {...field} />
                </FormControl>
                <FormDescription>
                  Este nombre será visible para el resto de jugadores.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Ingresar</Button>
      </form>
    </Form>
  )
}
