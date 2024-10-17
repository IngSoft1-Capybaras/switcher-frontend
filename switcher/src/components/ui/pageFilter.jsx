import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useState } from "react"


export function PageFilter() {

  const [isOpen, setIsOpen] = useState(false);


  const handleFilterInfoSubmit = () => {
    console.log(formData);
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="bg-slate-600" variant="outline">Filtar Partida</Button>
      </PopoverTrigger>

      <PopoverContent className="w-90">
        <form className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filtrar Partida</h4>
            <p className="text-sm text-muted-foreground">
              Filtrar por Nombre y/o número de jugadores
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
          </div>

          <button type="submit">Filtrar</button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
