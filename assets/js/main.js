const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonDetailModal = document.getElementById('pokemonDetailModal')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        document.querySelectorAll('.pokemon').forEach(item => {
            item.addEventListener('click', () => {
                const pokemonNumber = item.querySelector('.number').textContent.replace('#', '');
                const selectedPokemon = pokemons.find(p => p.number == pokemonNumber);
                if (selectedPokemon) {
                    showPokemonDetail(selectedPokemon);
                }
            })
        })    
    })
}

function showPokemonDetail (pokemon) {

    const modal = document.getElementById('pokemonDetailModal')

    modal.innerHTML = `
    <div class="modal-content ${pokemon.type}">
            <span class="close-button">&times;</span>
            <h2 class="name">${pokemon.name}</h2>
            <span class="number">#${pokemon.number}</span>
            
            <div class="pokemon-image">
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>

            <div class="details">
                <p><strong>Tipo:</strong> ${pokemon.types.join(', ')}</p>
                <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
            </div>
        </div>
    `
    modal.className = `modal ${pokemon.type}`;
    
    modal.classList.remove('hidden')

    modal.querySelector('.close-button').addEventListener('click', () => {
        modal.classList.add('hidden')
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})