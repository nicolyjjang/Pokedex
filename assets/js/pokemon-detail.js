document.addEventListener("DOMContentLoaded", () => {
    const max_pokemons = 151;
    const pokemonId = new URLSearchParams(window.location.search).get("id");
    

    if (!pokemonId || pokemonId < 1 || pokemonId > max_pokemons) {
        window.location.href = "./index.html";
        return;
    }

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => response.json())
        .then(pokemonData => {

            const pokemon = {
                number: pokemonData.id,
                name: pokemonData.name,
                photo: pokemonData.sprites.other["official-artwork"].front_default,
                types: pokemonData.types.map(typeSlot => typeSlot.type.name), 
                height: pokemonData.height / 10,
                weight: pokemonData.weight / 10,
                abilities: pokemonData.abilities.map(abilitySlot => abilitySlot.ability.name).join(", "),
                species: pokemonData.species.url,
                stats: {
                    hp: pokemonData.stats[0].base_stat,
                    atk: pokemonData.stats[1].base_stat,
                    def: pokemonData.stats[2].base_stat,
                    satk: pokemonData.stats[3].base_stat,
                    sdef: pokemonData.stats[4].base_stat,
                    spd: pokemonData.stats[5].base_stat
                }
            }
            const primaryType = pokemon.types[0].toLowerCase(); 
            document.body.classList.add(primaryType);

            document.querySelector(".name").textContent = pokemon.name;
            document.querySelector(".pokemon-number p").textContent = `#${pokemon.number}`;
            document.querySelector(".power-wrapper p").innerHTML = `${pokemon.types.map((type) => `<span class="type ${type}">${type}</span>`).join(' ')}`;

            const details = document.querySelectorAll(".pokemon-detail-wrapper .pokemon-detail-wrap p.detail-name");
            if (details.length >= 4) {
                details[1].textContent += `: ${pokemon.height}m`;
                details[2].textContent += `: ${pokemon.weight}kg`;
                details[3].textContent += `: ${pokemon.abilities}`;
            }

            const imgElement = document.createElement("img");
            imgElement.src = pokemon.photo;
            imgElement.alt = `Imagem de ${pokemon.name}`;
            imgElement.classList.add("pokemon-image");
            document.querySelector(".header-wrapper").appendChild(imgElement);

            document.querySelectorAll(".stats-wrap").forEach(statWrap => {
                const statKey = statWrap.dataset.stat;
                const statValue = pokemon.stats[statKey] || 0;
                statWrap.querySelector("p.text3:nth-child(2)").textContent = statValue;
                statWrap.querySelector("progress").value = statValue;
            });

            fetch(pokemon.species)
                .then(response => response.json())
                .then(speciesData => {
                    document.querySelector(".pokemon-detail-wrapper .pokemon-detail-wrap p.detail-name:first-of-type").textContent = `Species: ${speciesData.name}`;

                    const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
                    document.querySelector(".pokemon-description").textContent = description ? description.flavor_text : "No description available.";
                })
                .catch(error => console.error("Erro ao carregar species e descrição: ", error));
        })
        .catch(error => console.error("Erro ao carregar Pokémon: ", error));
});
