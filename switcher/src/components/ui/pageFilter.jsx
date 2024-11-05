import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";

export function PageFilter({ setIsFiltering, formData, setFormData, fetchGames }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterInfoSubmit = async (e) => {
    e.preventDefault();
    setIsFiltering(true);
    const name = formData.name || null;
    const players = formData.players || null;

    if (!name && !players) {
      setIsFiltering(false);
    } else {
      try {
        await fetchGames(1, formData);
      } catch (error) {
        console.log('Error occurred while filtering');
        setIsFiltering(false);
      }
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-transparent text-white rounded-md hover:text-gray-400 hover:bg-transparent transition duration-200"
          variant="default"
          data-testid="triggerButton" // Added test ID here
        >
          <FaFilter className="mr-2" /> {/* Icon for the trigger */}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-90 bg-zinc-800 p-6 rounded-md shadow-lg" data-testid="popOverId">
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
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200"
            data-testid="submitButtonId" // Added test ID here
          >
            Filtrar
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
