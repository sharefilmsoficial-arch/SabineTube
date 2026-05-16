const grid = document.getElementById("moviesGrid");
const title = document.getElementById("resultsTitle");
const searchInput = document.getElementById("search");


// función para quitar acentos
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
// leer parámetro ?q=
const params = new URLSearchParams(window.location.search);
const query = params.get("query")?.toLowerCase() || "";

searchInput.value = query;

// filtrar películas
const results = MOVIES.filter(movie => {

  // buscar en título
  const titleMatch =
    normalize(movie.title).includes(normalize(query));

  // buscar en keywords
  const keywordMatch =
    movie.keywords?.some(keyword =>
      normalize(keyword).includes(normalize(query))
    );

  return titleMatch || keywordMatch;
});

// título tipo YouTube
title.textContent = results.length
  ? `Resultados para "${query}"`
  : `No se encontraron resultados para "${query}"`;

// render
results.forEach(movie => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = ` 
    <div class="thumb">
      <img src="${movie.post || movie.image}" alt="${movie.title}">
      <span class="time">${movie.duration ?? ""}</span>
    </div>

    <div class="info">
      <h3>${movie.title}</h3>
      <p class="channel">${movie.genres?.join(" · ") ?? ""}</p>
      <p>${movie.year}</p>
    </div>
  `;

  card.onclick = () => {
    window.location.href = `watch.html?id=${movie.id}`;
  };

  grid.appendChild(card);
});
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const value = searchInput.value.trim();
    if (value) {
      window.location.href = `results.html?query=${encodeURIComponent(value)}`;
    }
  }
});
