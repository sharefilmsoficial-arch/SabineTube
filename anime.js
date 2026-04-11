const container = document.getElementById("animeGrid");
const searchInput = document.getElementById("search");

// 🔥 Redirección inteligente
function goToWatch(id, type) {
  if (type === "serie") {
    window.location.href = `watch.html?serie=${id}&ep=1`;
  } else {
    window.location.href = `watch.html?id=${id}`;
  }
}

// 🎌 Render principal
function renderAnime(filter = "") {
  container.innerHTML = "";

  // 🎬 Películas anime
  const animeMovies = MOVIES.filter(m =>
    m.genres &&
    m.genres.includes("Anime") &&
    m.title.toLowerCase().includes(filter.toLowerCase())
  );

  // 📺 Series anime
  const animeSeries = SERIES.filter(s =>
    s.genres &&
    s.genres.includes("Anime") &&
    s.title.toLowerCase().includes(filter.toLowerCase())
  );

  // 🎬 Render películas
  animeMovies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => goToWatch(movie.id, "movie");

    card.innerHTML = `
      <div class="thumb">
        <img src="${movie.image}" alt="${movie.title}">
        <span class="time">${movie.duration || ""}</span>
      </div>
      <div class="info">
        <h3>${movie.title}</h3>
        <p>${movie.year}</p>
      </div>
    `;

    container.appendChild(card);
  });

  // 📺 Render series
  animeSeries.forEach(serie => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => goToWatch(serie.id, "serie");

    card.innerHTML = `
      <div class="thumb">
        <img src="${serie.image}" alt="${serie.title}">
      </div>
      <div class="info">
        <h3>${serie.title}</h3>
        <p>${serie.year}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// 🔍 Buscador
searchInput.addEventListener("input", e => {
  renderAnime(e.target.value);
});

// 🚀 Inicial
renderAnime();
