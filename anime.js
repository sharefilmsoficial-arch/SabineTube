const grid = document.getElementById("animeGrid");


/* =========================
   🔎 UTIL
========================= */
function isAnime(item) {
  if (Array.isArray(item.genres)) {
    return item.genres.includes("anime");
  }
  return item.genre === "anime";
}

/* =========================
   🎬 MOVIES (ANIME)
========================= */
MOVIES
  .filter(isAnime)
  .forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";

card.innerHTML = `
  <div class="thumb">
    <img src="${movie.post || movie.image}">
  </div>
  <div class="info">
    <h3>${movie.title}</h3>
  </div>
`;


    card.onclick = () => {
      location.href = `watch.html?id=${movie.id}`;
    };

    grid.appendChild(card);
  });

/* =========================
   📺 SERIES (ANIME)
========================= */
SERIES
  .filter(isAnime)
  .forEach(serie => {
    const card = document.createElement("div");
    card.className = "card";

card.innerHTML = `
  <div class="thumb">
    <img src="${serie.image}">
  </div>
  <div class="info">
    <h3>${serie.title}</h3>
    <p>Serie</p>
  </div>
`;


    card.onclick = () => {
      location.href = `series.html?id=${serie.id}`;
    };

    grid.appendChild(card);
  });const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const value = searchInput.value.trim();
      if (value) {
        window.location.href =
          `results.html?query=${encodeURIComponent(value)}`;
      }
    }
  });
}
