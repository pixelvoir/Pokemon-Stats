const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cardContainer = document.getElementById("card-container");
const movesContainer = document.getElementById("moves-container");

searchBtn.addEventListener("click", searchPokemon);
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") searchPokemon();
});

async function searchPokemon() {
  const name = searchInput.value.trim().toLowerCase();
  if (!name) return;

  cardContainer.innerHTML = "Loading...";
  movesContainer.innerHTML = "";

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

function statColor(value) {
  if (value < 50) return "#e74c3c";
  if (value < 80) return "#f1c40f";
  if (value < 120) return "#2ecc71";
  if (value < 160) return "#27ae60";
  return "#3498db";
}

function renderPokemon(pokemon) {
  const typesHTML = pokemon.types
    .map(t => `<span class="type-${t.type.name}">${capitalize(t.type.name)}</span>`)
    .join("");

  const statsHTML = pokemon.stats.map(s => {
    const value = s.base_stat;
    return `
      <div class="stat">
        <span>${capitalize(s.stat.name)}</span>
        <div class="stat-bar">
          <div class="stat-fill"
               style="--width:${(value / 255) * 100}%; background:${statColor(value)}">
          </div>
        </div>
        <span>${value}</span>
      </div>
    `;
  }).join("");

  cardContainer.innerHTML = `
    <div class="pokemon-card">
      <div class="header">
        <h2>${capitalize(pokemon.name)}</h2>
        <div class="types">${typesHTML}</div>
      </div>

      <img class="sprite" src="${pokemon.sprites.front_default}" />

      <div class="divider"></div>

      ${statsHTML}
    </div>
  `;

  renderMoves(pokemon.moves);
}

function renderMoves(moves) {
  movesContainer.innerHTML = moves
    .map(m => `<span class="move">${capitalize(m.move.name.replace("-", " "))}</span>`)
    .join("");
}
