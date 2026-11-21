
const container = document.getElementById("maratonGrid");
const searchInput = document.getElementById("search");

// ===========================
// REDIRECCIÓN A WATCH
// ===========================

function goToWatch(id, type) {

  if (type === "serie") {
    window.location.href = `watch.html?serie=${id}&ep=1`;
  } else {
    window.location.href = `watch.html?id=${id}`;
  }

}

// ===========================
// COMPROBAR ESTRENO MARATÓN
// ===========================

function tieneMaraton(estreno) {

  if (Array.isArray(estreno)) {
    return estreno.some(valor =>
      String(valor).toLowerCase() === "maraton"
    );
  }

  return String(estreno || "").toLowerCase() === "maraton";

}

// ===========================
// RENDER PRINCIPAL
// ===========================

function renderMaraton(filter = "") {

  container.innerHTML = "";

  const busqueda = filter.toLowerCase();

  // 🎬 PELÍCULAS
  const maratonMovies = MOVIES.filter(movie =>
    tieneMaraton(movie.estreno) &&
    movie.title.toLowerCase().includes(busqueda)
  );

  // 📺 SERIES COMPLETAS
  const maratonSeries = SERIES.filter(serie =>
    tieneMaraton(serie.estreno) &&
    serie.title.toLowerCase().includes(busqueda)
  );

  // 📺 EPISODIOS INDIVIDUALES
  const maratonEpisodes = [];

  SERIES.forEach(serie => {

    // Evitar repetir episodios si toda la serie está en maratón
    if (tieneMaraton(serie.estreno)) return;

    serie.episodes?.forEach(episodio => {

      if (
        tieneMaraton(episodio.estreno) &&
        (
          serie.title.toLowerCase().includes(busqueda) ||
          String(episodio.name || "").toLowerCase().includes(busqueda)
        )
      ) {

        maratonEpisodes.push({
          serie,
          episodio
        });

      }

    });

  });

  // ===========================
  // SECCIÓN PELÍCULAS
  // ===========================

  const movieTitle = document.createElement("h2");
  movieTitle.className = "section-title";
  movieTitle.textContent = "Películas";

  container.appendChild(movieTitle);

  if (maratonMovies.length === 0) {

    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "No hay películas de maratón.";

    container.appendChild(empty);

  }

  maratonMovies.forEach(movie => {

    const card = document.createElement("div");
    card.className = "card";

    card.onclick = () => goToWatch(movie.id, "movie");

    card.innerHTML = `
      <div class="thumb">
        <img src="${movie.post}" alt="${movie.title}">
        <span class="time">${movie.duration || ""}</span>
      </div>

      <div class="info">
        <h3>${movie.title}</h3>
        <p>${movie.year || ""}</p>
      </div>
    `;

    container.appendChild(card);

  });

  // ===========================
  // SECCIÓN SERIES
  // ===========================

  const seriesTitle = document.createElement("h2");
  seriesTitle.className = "section-title";
  seriesTitle.textContent = "Series";

  container.appendChild(seriesTitle);

  // SERIES COMPLETAS
  maratonSeries.forEach(serie => {

    const card = document.createElement("div");
    card.className = "card";

    card.onclick = () => goToWatch(serie.id, "serie");

    card.innerHTML = `
      <div class="thumb">
        <img src="${serie.post}" alt="${serie.title}">
      </div>

      <div class="info">
        <h3>${serie.title}</h3>
        <p>${serie.year || ""}</p>
      </div>
    `;

    container.appendChild(card);

  });

  // EPISODIOS INDIVIDUALES
  maratonEpisodes.forEach(({ serie, episodio }) => {

    const card = document.createElement("div");
    card.className = "card";

    card.onclick = () => {
      window.location.href =
        `watch.html?serie=${serie.id}&ep=${episodio.n}`;
    };

    card.innerHTML = `
      <div class="thumb">
        <img src="${episodio.image || episodio.thumb}" alt="${episodio.name || serie.title}">
      </div>

      <div class="info">
        <h3>${serie.title} - Episodio ${episodio.n}</h3>
        <p>${episodio.name || ""}</p>
      </div>
    `;

    container.appendChild(card);

  });

  // MENSAJE SI NO HAY SERIES NI EPISODIOS
  if (maratonSeries.length === 0 && maratonEpisodes.length === 0) {

    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "No hay series ni episodios de maratón.";

    container.appendChild(empty);

  }

}

// ===========================
// BUSCADOR
// ===========================

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

// ===========================
// INICIALIZAR
// ===========================

renderMaraton();
