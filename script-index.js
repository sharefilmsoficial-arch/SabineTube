const grid = document.getElementById("moviesGrid");
const FALLBACK_IMG = "iconos/image-loading.gif";

/* ===========================
   UTILIDADES
=========================== */
// Algoritmo Fisher-Yates para mezcla uniforme
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Helper seguro para construir elementos
function createElement(tag, className, text = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

/* ===========================
   CARDS (SEGURAS CONTRA XSS)
=========================== */
function buildBaseCard(movie, options) {
  const { isShort, badgeText, targetPage, imgSrc, subInfo } = options;

  const card = createElement("div", isShort ? "card short" : "card");

  // Contenedor de imagen
  const thumb = createElement("div", "thumb");
  const img = document.createElement("img");
  img.src = imgSrc || FALLBACK_IMG;
  img.alt = movie.title || "Sin título";
  img.loading = "lazy";
  img.onerror = () => {
    img.onerror = null; // Evita bucles infinitos si falla el fallback
    img.src = FALLBACK_IMG;
  };

  const badge = createElement("span", "time", badgeText);
  thumb.append(img, badge);

  // Contenedor de información
  const info = createElement("div", "info");
  const title = createElement("h3", "", movie.title);
  const channel = createElement("p", "channel", movie.genres?.join(" · ") ?? "");
  const details = createElement("p", "", subInfo);

  info.append(title, channel, details);
  card.append(thumb, info);

  card.addEventListener("click", () => {
    window.location.href = `${targetPage}?id=${encodeURIComponent(movie.id)}`;
  });

  return card;
}

function createMovieCard(movie) {
  const meta = [movie.year, movie.rating].filter(Boolean).join(" · ");
  return buildBaseCard(movie, {
    isShort: false,
    badgeText: movie.duration ?? "",
    targetPage: "watch.html",
    imgSrc: movie.post || movie.image,
    subInfo: meta
  });
}

function createShortCard(movie) {
  return buildBaseCard(movie, {
    isShort: true,
    badgeText: "CLIP",
    targetPage: "trailer.html",
    imgSrc: movie.image || movie.post,
    subInfo: movie.year ?? ""
  });
}

/* ===========================
/* ===========================
   RENDERIZADO EFICIENTE
=========================== */

if (
  grid &&
  Array.isArray(MOVIES) &&
  MOVIES.length > 0
) {
  const fragment = document.createDocumentFragment();

  const shuffledMovies = shuffle(MOVIES);

  // 1. Primeras 8 películas
  shuffledMovies.slice(0, 8).forEach(movie => {
    fragment.appendChild(createMovieCard(movie));
  });

    // 2. Trailers de películas y series

  const movieTrailers = MOVIES
    .filter(m => m.trailerUrl)
    .map(m => ({
      ...m,
      contentType: "movie"
    }));

  const seriesTrailers = (
    typeof SERIES !== "undefined" && Array.isArray(SERIES)
      ? SERIES.filter(s => s.video)
      : []
  ).map(s => ({
    ...s,
    trailerUrl: s.video,
    contentType: "series"
  }));

  // Primeras dos tarjetas: series aleatorias
  const firstSeries = shuffle(seriesTrailers).slice(0, 2);

  // Evitar repetir las series seleccionadas
  const remainingSeries = seriesTrailers.filter(
    s => !firstSeries.some(selected => selected.id === s.id)
  );

  // Las otras cuatro: películas y series aleatorias
  const remainingTrailers = shuffle([
    ...movieTrailers,
    ...remainingSeries
  ]).slice(0, 4);

  // Unir las seis tarjetas
  const allTrailers = [
    ...firstSeries,
    ...remainingTrailers
  ];

  if (allTrailers.length > 0) {
    const shortsRow = createElement("div", "shorts-row");

    allTrailers.forEach(item => {
      shortsRow.appendChild(createShortCard(item));
    });

    fragment.appendChild(shortsRow);
  }

  // 3. Siguientes 8 películas
  shuffledMovies.slice(8, 16).forEach(movie => {
    fragment.appendChild(createMovieCard(movie));
  });

  grid.appendChild(fragment);
}

/* ===========================
   BUSCADOR
=========================== */
const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const value = searchInput.value.trim();
      if (value) {
        window.location.href = `results.html?search_query=${encodeURIComponent(value)}`;
      }
    }
  });
}
