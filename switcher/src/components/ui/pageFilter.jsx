import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { filterGames, getGames } from "@/services/services"
import { useNavigate } from "react-router-dom"

export function PageFilter( {setGames, setTotalPages, setIsFiltering}) {
  const [formData, setFormData] = useState({name:'', players:''})
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterInfoSubmit = async (e) => {
    e.preventDefault()
    setIsFiltering(true);
    const name = formData.name || null;
    const players = formData.players || null;

    if (!name && !players) {
      // fetchGames
    }
    try {
      const games = await filterGames(name, players);
      console.log('PASO 1');
      setGames(games.games);
      console.log('PASO 2');
      setTotalPages(games.total_pages);
      console.log('PASO 3');
      //navigate(`/games/`)
    }
    catch (error) {
      console.log('hubo un error');
    }
    setIsOpen(false);
    setIsFiltering(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="bg-slate-600" variant="outline">Filtar Partida</Button>
      </PopoverTrigger>

      <PopoverContent className="w-90 bg-zinc-600">
        <form onSubmit={handleFilterInfoSubmit} className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filtrar Partida</h4>
            <p className="text-sm text-muted-foreground">
              Filtrar por Nombre y/o número de jugadores
            </p>
          </div>

          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="nombrePartida">Nombre</Label>
              <Input
                id="nombrePartida"
                name='name'
                placeholder='opcional'
                className="col-span-2 h-8"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="jugadoresPartida">N° jugadores</Label>
              <Input
                id="jugadoresPartida"
                name='players'
                placeholder='opcional'
                className="col-span-2 h-8"
                value={formData.players}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Button type="submit">Filtrar</Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
