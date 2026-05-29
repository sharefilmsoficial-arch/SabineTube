const grid = document.getElementById("moviesGrid");
const title = document.getElementById("resultsTitle");
const searchInput = document.getElementById("search");

// 🔎 Normalizar texto
function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[^\w\s]/g, "") // quitar comas, puntos, etc
    .replace(/\s+/g, " ") // espacios dobles
    .trim();
}

// 📌 Parámetro ?query=
const params = new URLSearchParams(window.location.search);
const query = params.get("query") || "";

searchInput.value = query;

const normalizedQuery = normalize(query);

// 🔍 Función de coincidencia inteligente
function matchesSearch(text) {
  if (!text) return false;

  const normalizedText = normalize(text);

  // coincidencia completa
  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }

  // coincidencia por palabras
  const queryWords = normalizedQuery.split(" ");
  return queryWords.every(word =>
    normalizedText.includes(word)
  );
}

// 🎬 Buscar películas y series
const ALL_CONTENT = [...MOVIES, ...SERIES];

const results = [];

ALL_CONTENT.forEach(movie => {

  // 🎬 título principal
  const titleMatch = matchesSearch(movie.title);

  // 🏷 keywords
  const keywordMatch =
    movie.keywords?.some(keyword =>
      matchesSearch(keyword)
    );

  // 📺 episodios
  let matchedEpisode = null;

  if (movie.episodes) {

    matchedEpisode = movie.episodes.find(ep =>
      matchesSearch(ep.name) ||
      matchesSearch(
        `${movie.title} episodio ${ep.n} ${ep.name}`
      )
    );
  }

  // 📌 agregar episodio específico
  if (matchedEpisode) {

    results.push({
      type: "episode",
      series: movie,
      episode: matchedEpisode
    });

  }

  // 📌 agregar serie/película normal
  else if (titleMatch || keywordMatch) {

    results.push(movie);
  }
});

// 📝 Título
title.textContent = results.length
  ? `Resultados para "${query}"`
  : `No se encontraron resultados para "${query}"`;

// 🎨 Render
results.forEach(item => {

  const card = document.createElement("div");
  card.className = "card";

  // 🎬 SI ES EPISODIO
  if (item.type === "episode") {

    card.innerHTML = `
      <div class="thumb">
        <img src="${item.episode.image || item.series.image}"
             alt="${item.series.title}">
      </div>

      <div class="info">
        <h3>
          ${item.series.title} — Episodio ${item.episode.n}: ${item.episode.name}
        </h3>

        <p class="channel">
          ${item.series.genres?.join(" · ") ?? ""}
        </p>
      </div>
    `;

    card.onclick = () => {
      window.location.href =
        `watch.html?serie=${item.series.id}&ep=${item.episode.n}`;
    };

  }

  // 🎥 SI ES PELÍCULA O SERIE NORMAL
  else {

    card.innerHTML = `
      <div class="thumb">
        <img src="${item.post || item.image}" alt="${item.title}">
        <span class="time">${item.duration ?? ""}</span>
      </div>

      <div class="info">
        <h3>${item.title}</h3>
        <p class="channel">${item.genres?.join(" · ") ?? ""}</p>
        <p>${item.year ?? ""}</p>
      </div>
    `;

    card.onclick = () => {

      // 📺 series
      if (item.episodes) {
        window.location.href =
          `watch.html?serie=${item.id}`;
      }

      // 🎬 películas
      else {
        window.location.href =
          `watch.html?id=${item.id}`;
      }
    };
  }

  grid.appendChild(card);
});

// ⌨️ Buscar al presionar Enter
searchInput.addEventListener("keydown", e => {

  if (e.key === "Enter") {

    const value = searchInput.value.trim();

    if (value) {
      window.location.href =
        `results.html?query=${encodeURIComponent(value)}`;
    }
  }
});
