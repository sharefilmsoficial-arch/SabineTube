const grid = document.getElementById("moviesGrid");

/* ===========================
   UTILIDADES
=========================== */

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

/* ===========================
   CARDS
=========================== */

// 🎬 Películas (POSTER)
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "card";

  // 👉 fallback correcto
  const poster =
    movie.post ||
    movie.image ||
    "iconos/image-loading.gif";

  card.innerHTML = `
    <div class="thumb">
      <img
        src="${poster}"
        alt="${movie.title}"
        loading="lazy"
      >
      <span class="time">${movie.duration ?? ""}</span>
    </div>

    <div class="info">
      <h3>${movie.title}</h3>
      <p class="channel">${movie.genres?.join(" · ") ?? ""}</p>
      <p>${movie.year} · ${movie.rating ?? ""}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `watch.html?id=${movie.id}`;
  });

  return card;
}

// 📱 Shorts / Trailers
function createShortCard(movie) {
  const card = document.createElement("div");
  card.className = "card short";

  // ⚠️ trailerUrl NO es imagen → NO usar
  const thumb =
    movie.image ||
    movie.post ||
    "iconos/image-loading.gif";

  card.innerHTML = `
    <div class="thumb">
      <img
        src="${thumb}"
        alt="${movie.title}"
        loading="lazy"
      >
      <span class="time">CLIP</span>
    </div>

    <div class="info">
      <h3>${movie.title}</h3>
      <p class="channel">${movie.genres?.join(" · ") ?? ""}</p>
      <p>${movie.year}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `trailer.html?id=${movie.id}`;
  });

  return card;
}

/* ===========================
   LÓGICA RANDOM
=========================== */

const shuffledMovies = shuffle(MOVIES);

// 1️⃣ primeras 8 películas
const firstMovies = shuffledMovies.slice(0, 8);

// 2️⃣ trailers (solo si tienen trailerUrl)
const shorts = shuffle(
  MOVIES.filter(m => m.trailerUrl)
).slice(0, 6);

// 3️⃣ otras 8 películas
const secondMovies = shuffledMovies.slice(8, 16);

/* ===========================
   RENDER
=========================== */

firstMovies.forEach(movie =>
  grid.appendChild(createMovieCard(movie))
);

const shortsRow = document.createElement("div");
shortsRow.className = "shorts-row";

shorts.forEach(movie =>
  shortsRow.appendChild(createShortCard(movie))
);

grid.appendChild(shortsRow);

secondMovies.forEach(movie =>
  grid.appendChild(createMovieCard(movie))
);
const searchInput = document.getElementById("search");
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const value = searchInput.value.trim();
    if (value) {
      window.location.href = `results.html?query=${encodeURIComponent(value)}`;
    }
  }
});