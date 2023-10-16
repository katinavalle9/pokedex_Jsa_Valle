const pokedexContainer = document.getElementById("pokedex");
const detalles = document.getElementById("detalles");
const url = "https://pokeapi.co/api/v2/pokemon/?limit=100";
let pokemones = [];
const myModal = new bootstrap.Modal(document.getElementById("modalPoke"));
const inputPokemon = document.getElementById("search-pokemon");

(async () => {
  const pokemonesResponse = await (await fetch(url)).json();
  if (
    pokemonesResponse &&
    pokemonesResponse.results &&
    pokemonesResponse.results.length > 0
  ) {
    const fetchPromises = pokemonesResponse.results.map(async (x) => {
      const response = await fetch(x.url);
      return response.json();
    });
    pokemones = await Promise.all(fetchPromises);
    renderPokemon(pokemones);
  }
})();

inputPokemon.addEventListener("input", () => {
  let valorInput = inputPokemon.value;
  let filtradoPokemones = pokemones.filter((p) =>
    p.name.toLowerCase().includes(valorInput.toLowerCase())
  );
  renderPokemon(filtradoPokemones);
});

function renderPokemon(pokemonesFiltrados) {
  if (pokemonesFiltrados.length > 0) {
    pokedexContainer.innerHTML = "";
    pokemonesFiltrados.forEach((pokemon) => {
      const pokemonCard = document.createElement("div");
      pokemonCard.classList.add("col-md-3", "mb-3");
      let aux = JSON.stringify(pokemon.types);
      aux = aux.replace(/"/g, "'");
      pokemonCard.innerHTML = `
                                          <div class="card">
                                              <img src="${
                                                pokemon.sprites.front_default
                                              }" class="card-img-top" alt="${
        pokemon.name
      }"/>
                                              <div class="card-body">
                                                  <h5 class="card-title">${
                                                    pokemon.name
                                                  }</h5>
                                                  <p class="card-text">${pokemon.types
                                                    .map(
                                                      (type) => type.type.name
                                                    )
                                                    .join(", ")}</p>
                                                    <button type="button" class="btn btn-primary btn-detail" data-name="${
                                                      pokemon.name
                                                    }" data-peso="${
        pokemon.weight
      }" data-altura='${
        pokemon.height
      }' data-tipo="${aux}" >Ver Detalles</button>
                                              </div>
                                          </div>
                                      `;
      pokedexContainer.appendChild(pokemonCard);
    });
    document.querySelectorAll(".btn-detail").forEach((x) => {
      x.addEventListener("click", (e) => {
        console.log(x);
        const nombre = x.dataset.name;
        console.log(nombre);
        const peso = x.dataset.peso;
        console.log(peso);
        const altura = x.dataset.altura;
        console.log(altura);
        let tipo = x.dataset.tipo;
        tipo = tipo.replace(/'/g, '"');
        tipo = JSON.parse(tipo);

        const content = `
                  <p>Nombre: ${nombre}</p>
                  <p>Peso: ${peso} kg</p>
                  <p>Altura: ${altura} cm</p>
                  <p>Tipo(s): ${
                    tipo
                      ? tipo.map((type) => type.type.name).join(", ")
                      : "Sin tipo"
                  }</p>
                `;
        detalles.innerHTML = content;
        myModal.show();
      });
    });
  } else {
    pokedexContainer.innerHTML = "";
  }
}
