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

// Comprobar si un contenido tiene tráiler
function tieneTrailer(video) {
  if (Array.isArray(video)) {
    return video.length > 0;
  }

  return typeof video === "string" && video.trim() !== "";
}

/* ===========================
   CARDS (SEGURAS CONTRA XSS)
=========================== */

function buildBaseCard(movie, options) {

  const {
    isShort,
    badgeText,
    targetPage,
    imgSrc,
    subInfo,
    onClick
  } = options;

  const card = createElement("div", isShort ? "card short" : "card");

  // Contenedor de imagen
  const thumb = createElement("div", "thumb");

  const img = document.createElement("img");

  img.src = imgSrc || FALLBACK_IMG;
  img.alt = movie.title || movie.name || "Sin título";
  img.loading = "lazy";

  img.onerror = () => {
    img.onerror = null;
    img.src = FALLBACK_IMG;
  };

  const badge = createElement("span", "time", badgeText);

  thumb.append(img, badge);

  // Contenedor de información
  const info = createElement("div", "info");

  const title = createElement(
    "h3",
    "",
    movie.title || movie.name || "Sin título"
  );

  const channel = createElement(
    "p",
    "channel",
    movie.genres?.join(" · ") ?? ""
  );

  const details = createElement("p", "", subInfo);

  info.append(title, channel, details);
  card.append(thumb, info);

  // Navegación
  card.addEventListener("click", () => {

    if (onClick) {
      onClick();
      return;
    }

    if (targetPage) {
      window.location.href =
        `${targetPage}?id=${encodeURIComponent(movie.id)}`;
    }

  });

  return card;
}

// ===========================
// TARJETA DE PELÍCULA
// ===========================

function createMovieCard(movie) {

  const meta = [movie.year, movie.rating]
    .filter(Boolean)
    .join(" · ");

  return buildBaseCard(movie, {
    isShort: false,
    badgeText: movie.duration ?? "",
    targetPage: "watch.html",
    imgSrc: movie.post || movie.image,
    subInfo: meta
  });

}

// ===========================
// TARJETA DE TRÁILER
// ===========================

function createShortCard(movie) {

  const subInfo = movie.contentType === "episode"
    ? `Episodio ${movie.n}: ${movie.name}`
    : movie.year ?? "";

  return buildBaseCard(movie, {

    isShort: true,
    badgeText: "CLIP",
    targetPage: null,

    imgSrc: movie.image || movie.thumb || movie.post,

    subInfo: subInfo,

    onClick: () => {

      if (movie.contentType === "episode") {

        window.location.href =
          `trailer.html?id=${encodeURIComponent(movie.serieId)}&type=series&ep=${encodeURIComponent(movie.n)}`;

      } else {

        window.location.href =
          `trailer.html?id=${encodeURIComponent(movie.id)}`;

      }

    }

  });

}

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

  // 1. PRIMERAS 8 PELÍCULAS

  shuffledMovies.slice(0, 8).forEach(movie => {
    fragment.appendChild(createMovieCard(movie));
  });

  // 2. TRÁILERS DE PELÍCULAS

  const movieTrailers = MOVIES
    .filter(m => tieneTrailer(m.trailerUrl))
    .map(m => ({
      ...m,
      contentType: "movie"
    }));

  // 3. TRÁILERS GENERALES DE SERIES

  const seriesTrailers = (
    typeof SERIES !== "undefined" && Array.isArray(SERIES)
      ? SERIES.filter(s => tieneTrailer(s.video))
      : []
  ).map(s => ({
    ...s,
    contentType: "series"
  }));

  // 4. TRÁILERS DE EPISODIOS

  const episodeTrailers = (
    typeof SERIES !== "undefined" && Array.isArray(SERIES)
      ? SERIES.flatMap(s =>
          (s.episodes || [])
            .filter(ep => tieneTrailer(ep.video))
            .map(ep => ({
              ...ep,
              id: `${s.id}__episode_${ep.n}`,
              serieId: s.id,
              title: s.title,
              genres: s.genres,
              image: ep.thumb || s.image || s.post,
              contentType: "episode"
            }))
        )
      : []
  );

  // 5. PRIMERAS DOS TARJETAS

  const firstTrailers = [];

  const availableSeries = shuffle([...seriesTrailers]);
  const availableEpisodes = shuffle([...episodeTrailers]);

  // Probabilidad de 3/8 de incluir un episodio
  const includeEpisode =
    availableEpisodes.length > 0 &&
    Math.random() < (3 / 8);

  if (includeEpisode) {

    // Seleccionar un episodio aleatorio
    const selectedEpisode = availableEpisodes.shift();

    firstTrailers.push(selectedEpisode);

    // Seleccionar una serie diferente
    const otherSeries = availableSeries.find(
      s => s.id !== selectedEpisode.serieId
    );

    if (otherSeries) {
      firstTrailers.push(otherSeries);
    }

  } else {

    // Dos series aleatorias
    firstTrailers.push(
      ...availableSeries.slice(0, 2)
    );

  }

  // Mezclar las primeras dos posiciones
  const firstTwoTrailers = shuffle(firstTrailers);

  // 6. IDENTIFICAR LAS SERIES YA REPRESENTADAS

  const usedSeriesIds = firstTwoTrailers.map(item =>
    item.contentType === "episode"
      ? item.serieId
      : item.id
  );

  // 7. EXCLUIR SERIES Y EPISODIOS YA REPRESENTADOS

  const remainingSeries = seriesTrailers.filter(
    s => !usedSeriesIds.includes(s.id)
  );

  const remainingEpisodes = episodeTrailers.filter(
    ep => !usedSeriesIds.includes(ep.serieId)
  );

  // 8. OTRAS CUATRO TARJETAS

  const remainingTrailers = shuffle([
    ...movieTrailers,
    ...remainingSeries,
    ...remainingEpisodes
  ]).slice(0, 4);

  // 9. UNIR LAS SEIS TARJETAS

  const allTrailers = [
    ...firstTwoTrailers,
    ...remainingTrailers
  ];

  // 10. ELIMINAR DUPLICADOS POR ID

  const uniqueTrailers = [
    ...new Map(
      allTrailers.map(item => [item.id, item])
    ).values()
  ];

  // 11. CREAR LA FILA DE TRÁILERS

  if (uniqueTrailers.length > 0) {

    const shortsRow = createElement("div", "shorts-row");

    uniqueTrailers.forEach(item => {
      shortsRow.appendChild(createShortCard(item));
    });

    fragment.appendChild(shortsRow);

  }

  // 12. SIGUIENTES 8 PELÍCULAS

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

        window.location.href =
          `results.html?search_query=${encodeURIComponent(value)}`;

      }

    }

  });

}
