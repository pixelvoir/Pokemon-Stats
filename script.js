const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cardContainer = document.getElementById("card-container");

searchBtn.addEventListener("click", searchPokemon);
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") searchPokemon();
});

async function searchPokemon() {
  const name = searchInput.value.trim().toLowerCase();
  if (!name) return;

  cardContainer.innerHTML = "Loading...";

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    renderPokemon(data);
  } catch {
    cardContainer.innerHTML = "❌ Pokémon not found";
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderPokemon(pokemon) {
  const stats = Object.fromEntries(
    pokemon.stats.map(s => [s.stat.name, s.base_stat])
  );

  const abilities = pokemon.abilities
    .map(a => capitalize(a.ability.name.replace("-", " ")))
    .join(", ");

  const types = pokemon.types
    .map(t => `<span>${capitalize(t.type.name)}</span>`)
    .join("");

  const moves = pokemon.moves
    .map(m => capitalize(m.move.name.replace("-", " ")))
    .join("<br>");

  cardContainer.innerHTML = `
    <div class="card-wrapper">
      <div class="pokemon-card">
        <div class="header">
          <h2>${capitalize(pokemon.name)}</h2>
          <div class="types">${types}</div>
        </div>

        <img class="sprite" src="${pokemon.sprites.front_default}" />

        <div class="divider"></div>

        <div class="stat"><span>HP</span><span>${stats.hp}</span></div>
        <div class="stat"><span>Attack</span><span>${stats.attack}</span></div>
        <div class="stat"><span>Defense</span><span>${stats.defense}</span></div>
        <div class="stat"><span>Sp. Atk</span><span>${stats["special-attack"]}</span></div>
        <div class="stat"><span>Sp. Def</span><span>${stats["special-defense"]}</span></div>
        <div class="stat"><span>Speed</span><span>${stats.speed}</span></div>

        <div class="abilities">Abilities: ${abilities}</div>

        <button class="moves-btn" onclick="toggleMoves()">Show Moves</button>
        <div class="moves" id="moves">${moves}</div>
      </div>
    </div>
  `;
}

function toggleMoves() {
  const moves = document.getElementById("moves");
  moves.style.display = moves.style.display === "block" ? "none" : "block";
}
