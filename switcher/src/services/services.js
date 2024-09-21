const apiUrl = import.meta.env.VITE_API_URL

export const getGames = async (currentPage, totalPages) => {
    let response=null;
    const url = `${apiUrl}/games?page=${currentPage}?total=${totalPages}`; // TODO: coordinar con back
    try {
        response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
    return response;
}
