const apiUrl = import.meta.env.VITE_API_URL

export async function getGames(currentPage, totalPages) {
    const url = `${apiUrl}/games?page=${currentPage}?total=${totalPages}`; // TODO: coordinar con back
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        
        throw error;
    }
}
