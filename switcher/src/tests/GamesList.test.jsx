import {render} from "@testing-library/react"


describe('Listado de partidas', ()=> {
    it('Deberia mostrar "No hay partidas" cuando llega un arreglo vacio', ()=> {
        render(<GameList />);
    })
});