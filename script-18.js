const grid = document.getElementById("moviesGrid");
const searchInput = document.getElementById("search");

// 👉 Función para renderizar películas
function renderMovies(list) {
  grid.innerHTML = "";

  list.forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="thumb">
        <img 
          src="${movie.post || movie.image}" 
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

    card.onclick = () => {
      window.location.href = `watch-18.html?id=${movie.id}`;
    };

    grid.appendChild(card);
  });
}

// 🟢 Mostrar todas al cargar la página
renderMovies(MOVIES);

// 🔍 Buscador por TÍTULO
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = MOVIES.filter(movie =>
    movie.title.toLowerCase().includes(query)
  );

  renderMovies(filtered);
});