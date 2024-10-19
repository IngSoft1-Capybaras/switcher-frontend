import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

export function PageFilter( {setGames, setTotalPages, setIsFiltering, formData, setFormData, fetchGames}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterInfoSubmit = async (e) => {
    e.preventDefault()
    setIsFiltering(true);
    const name = formData.name || null;
    const players = formData.players || null;

    if(!name && !players){
      setIsFiltering(false);
    }
    else{
      try {
        await fetchGames(1, formData);
        //const games = await filterGames(name, players);
        /*const games = await getGames(0, formData)
        console.log('PASO 1');
        setGames(games.games);
        console.log(games.games)
        console.log('PASO 2');
        setTotalPages(games.total_pages);
        console.log('PASO 3');
        */
      }
      catch (error) {
        console.log('hubo un error');
      }
    }
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          data-testid='triggerButton'
          onClick={() => setIsOpen(true)}
          className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-500 transition duration-200"
          variant="outline"
        >
          Filtrar Partida
        </Button>
      </PopoverTrigger>

      <PopoverContent data-testid='popOverId' className="w-90 bg-zinc-800 p-6 rounded-md shadow-lg">
        <form onSubmit={handleFilterInfoSubmit} className="grid gap-6">
          <div className="space-y-2 text-white">
            <h4 className="font-semibold text-lg">Filtrar Partida</h4>
            <p className="text-sm text-gray-400">
              Filtrar por nombre y/o número de jugadores
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="nombrePartida" className="text-white font-medium">Nombre</Label>
              <Input
                id="nombrePartida"
                name="name"
                placeholder="Opcional"
                className="col-span-2 h-10 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="jugadoresPartida" className="text-white font-medium">N° jugadores</Label>
              <Input
                id="jugadoresPartida"
                name="players"
                placeholder="Opcional"
                className="col-span-2 h-10 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.players}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Button
            data-testid='submitButtonId'
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200"
          >
            Filtrar
          </Button>
        </form>
      </PopoverContent>
    </Popover>

  )
}
