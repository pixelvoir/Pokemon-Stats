const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cardContainer = document.getElementById("card-container");
const movesContainer = document.getElementById("moves-container");

let currentMoves = [];

searchBtn.addEventListener("click", searchPokemon);
searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") searchPokemon();
});

async function searchPokemon() {
  const name = searchInput.value.trim().toLowerCase();
  if (!name) return;

  cardContainer.innerHTML = "Loading...";
  movesContainer.classList.remove("visible");
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
  // Animated sprite fallback
  const animatedSprite =
    pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated
      ?.front_default;

  const sprite = animatedSprite || pokemon.sprites.front_default;

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

  const abilitiesHTML = pokemon.abilities
    .map(a => `<span class="ability">${capitalize(a.ability.name.replace("-", " "))}</span>`)
    .join("");

  currentMoves = pokemon.moves;

  cardContainer.innerHTML = `
    <div class="pokemon-card">
      <div class="header">
        <h2>${capitalize(pokemon.name)}</h2>
        <div class="types">${typesHTML}</div>
      </div>

      <img class="sprite" src="${sprite}" />

      <div class="divider"></div>

      ${statsHTML}

      <div class="abilities">
        ${abilitiesHTML}
      </div>

      <button class="show-moves" onclick="toggleMoves()">Show Moves</button>
    </div>
  `;
}

function toggleMoves() {
  if (!movesContainer.classList.contains("visible")) {
    renderMoves(currentMoves);
    movesContainer.classList.add("visible");
  } else {
    movesContainer.classList.remove("visible");
  }
}

function renderMoves(moves) {
  movesContainer.innerHTML = `
    <div class="moves-card">
      ${moves
        .map(
          m =>
            `<span class="move">${capitalize(m.move.name.replace("-", " "))}</span>`
        )
        .join("")}
    </div>
  `;
}
