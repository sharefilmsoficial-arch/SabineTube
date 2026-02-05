// 🔀 Mezclar aleatoriamente
function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const params = new URLSearchParams(window.location.search);

const player = document.getElementById("moviePlayer");
const titleEl = document.getElementById("movieTitle");
const imgEl = document.getElementById("movieImage");
const descEl = document.getElementById("movieDescription");
const sidebar = document.getElementById("relatedMovies");

/* =========================
   📺 SERIES
========================= */
if (params.has("serie")) {

  const serieId = params.get("serie");
  const epNum = parseInt(params.get("ep"));

  const serie = SERIES.find(s => s.id === serieId);

  if (!serie) {
    document.body.innerHTML = "<h2>Serie no encontrada</h2>";
    throw new Error("Serie no encontrada");
  }

  const episodio = serie.episodes.find(e => e.n === epNum);

  if (!episodio) {
    document.body.innerHTML = "<h2>Episodio no encontrado</h2>";
    throw new Error("Episodio no encontrado");
  }

  // 🎬 Player
  player.src = episodio.drive;

  // 📝 Info
  titleEl.textContent = `${serie.title} — Episodio ${episodio.n}`;
  imgEl.src = episodio.image || serie.image;
  descEl.textContent = episodio.name;

  // ▶️ Episodios relacionados (misma serie)
  serie.episodes.forEach(ep => {
    const card = document.createElement("div");
    card.className = "related-card";

    card.innerHTML = `
      <img src="${ep.image || serie.image}">
      <div>
        <h4>Episodio ${ep.n}</h4>
        <span>${ep.name}</span>
      </div>
    `;

    
if (ep.n === epNum) {
  card.classList.add("active-episode");
}
card.onclick = () => {
  location.href = `watch.html?serie=${serie.id}&ep=${ep.n}`;
};
    sidebar.appendChild(card);
  });

}

/* =========================
   🎬 MOVIES
========================= */
else if (params.has("id")) {

  const movieId = params.get("id");
  const movie = MOVIES.find(m => m.id === movieId);

  if (!movie) {
    document.body.innerHTML = "<h2>Película no encontrada</h2>";
    throw new Error("Película no encontrada");
  }

  // 🎬 Player
  player.src = movie.movie;

  // 📝 Info
  titleEl.textContent = movie.title;
  imgEl.src = movie.post || movie.image;
  descEl.textContent = movie.description || "";

  // 🎞️ Relacionadas
  const related = shuffle(
    MOVIES.filter(m => m.id !== movie.id)
  ).slice(0, 10);

  related.forEach(m => {
    const card = document.createElement("div");
    card.className = "related-card";

    card.innerHTML = `
      <img src="${m.post || m.image}">
      <div>
        <h4>${m.title}</h4>
        <span>${m.year}</span>
      </div>
    `;

    card.onclick = () => {
      location.href = `watch.html?id=${m.id}`;
    };

    sidebar.appendChild(card);
  });

}

/* =========================
   ❌ NADA VÁLIDO
========================= */
else {
  document.body.innerHTML = "<h2>Contenido no válido</h2>";
}

const searchInput = document.getElementById("search");
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const value = searchInput.value.trim();
    if (value) {
      window.location.href = `results.html?query=${encodeURIComponent(value)}`;
    }
  }
});