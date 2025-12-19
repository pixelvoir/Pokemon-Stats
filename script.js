const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cardContainer = document.getElementById("card-container");

searchBtn.addEventListener("click", searchPokemon);
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchPokemon();
  }
});

async function searchPokemon() {
  const name = searchInput.value.toLowerCase().trim();
  if (!name) return;

  cardContainer.innerHTML = "Loading...";

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );

    if (!response.ok) {
      throw new Error("Pokémon not found");
    }

    const data = await response.json();
    displayPokemon(data);
  } catch (error) {
    cardContainer.innerHTML = "❌ Pokémon not found";
  }
}

function displayPokemon(pokemon) {
  const stats = {};
  pokemon.stats.forEach(stat => {
    stats[stat.stat.name] = stat.base_stat;
  });

  const ability = pokemon.abilities[0].ability.name;

  cardContainer.innerHTML = `
    <div class="pokemon-card">
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />

      <div class="stat"><span>HP</span><span>${stats.hp}</span></div>
      <div class="stat"><span>Attack</span><span>${stats.attack}</span></div>
      <div class="stat"><span>Defense</span><span>${stats.defense}</span></div>
      <div class="stat"><span>Sp. Atk</span><span>${stats["special-attack"]}</span></div>
      <div class="stat"><span>Sp. Def</span><span>${stats["special-defense"]}</span></div>
      <div class="stat"><span>Speed</span><span>${stats.speed}</span></div>

      <div class="ability">Ability: ${ability}</div>
    </div>
  `;
}
