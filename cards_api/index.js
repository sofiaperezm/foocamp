
async function getPokemon() {
    const url = 'https://pokeapi.co/api/v2/pokemon/1'
    const response = await fetch(url)
    const jsonResponse = await response.json()
    console.log(jsonResponse)
}

getPokemon()
