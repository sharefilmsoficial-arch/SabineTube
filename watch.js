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
const favicon = document.getElementById("dynamic-favicon");


/* =========================
   📜 HISTORIAL SHAREFILMS
========================= */

const HISTORY_KEY = "sharefilms_watch_history";

function saveToHistory(item) {
  let history = [];

  try {
    history = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );

    if (!Array.isArray(history)) history = [];

  } catch {
    history = [];
  }

  // Evitar duplicados
  history = history.filter(old =>
    !(old.type === item.type &&
      old.id === item.id &&
      old.episodeNumber === item.episodeNumber)
  );

  // Guardar al principio del historial
  history.unshift({
    ...item,
    watchedAt: new Date().toISOString()
  });

  // Máximo 100 registros
  history = history.slice(0, 100);

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history)
  );
}

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

  // 📜 Guardar episodio en el historial
  saveToHistory({
    type: "episode",
    id: serie.id,
    title: serie.title,
    episodeNumber: episodio.n,
    episodeName: episodio.name,
    image: episodio.image || serie.image,
    url: `watch.html?serie=${serie.id}&ep=${episodio.n}`
  });


  // 🎬 Player
  player.src = episodio.drive;

  // 📝 Info
  titleEl.textContent = `${serie.title} — Episodio ${episodio.n}: ${episodio.name} `;
  imgEl.src = episodio.image || serie.image;
  descEl.textContent = episodio.description;

// ⭐ Cambiar título de la pestaña
document.title = `${serie.title} Ep.${episodio.n} — ShareFilms`;

  // ⭐ FAVICON DINÁMICO
  favicon.href = episodio.image || serie.image;

  // ▶️ Episodios relacionados
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


  // 📜 Guardar película en el historial
  saveToHistory({
    type: "movie",
    id: movie.id,
    title: movie.title,
    image: movie.post || movie.image,
    url: `watch.html?id=${movie.id}`
  });

  // 🎬 Player
  player.src = movie.movie;

  // 📝 Info
  titleEl.textContent = movie.title;
  imgEl.src = movie.post || movie.image;
  descEl.textContent = movie.description || "";

  // ⭐ Cambiar título de la pestaña
document.title = `${movie.title} — ShareFilms`;

  // ⭐ FAVICON DINÁMICO
  favicon.href = movie.post || movie.image;

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

/* =========================
   🔍 BUSCADOR
========================= */
const searchInput = document.getElementById("search");

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const value = searchInput.value.trim();
    if (value) {
      window.location.href = `results.html?search_query=${encodeURIComponent(value)}`;
    }
  }
});

/* =========================
   📤 COMPARTIR
========================= */

const shareBtn = document.getElementById("shareBtn");
const shareModal = document.getElementById("shareModal");

shareBtn.addEventListener("click", async () => {

  // Obtener datos actuales
  const currentUrl = window.location.href;
  const currentTitle = document.title;

  // 📱 Compartir nativo
  if (navigator.share) {
    try {

      await navigator.share({
        title: currentTitle,
        text: `Mira esto en *SabineTube* : *${currentTitle}*`,
        url: currentUrl
      });

      console.log("Contenido compartido");

    } catch (err) {
      console.log("Compartir cancelado");
    }
  }

  // 💻 Navegadores sin navigator.share
  else {
    openShareMenu();
  }

});


/* =========================
   📦 MODAL SHARE
========================= */

function openShareMenu() {

  shareModal.style.display = "flex";

  const currentUrl = window.location.href;
  const currentTitle = document.title;

  // WhatsApp
  document.getElementById("shareWhatsapp").href =
    `https://wa.me/?text=${encodeURIComponent(
      "*Mira esto en SabineTube* : " + "*" + currentTitle + "*" + " " + currentUrl
    )}`;

  // Facebook
  document.getElementById("shareFacebook").href =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`;
}


function closeShareMenu() {
  shareModal.style.display = "none";
}


/* =========================
   📋 COPIAR LINK
========================= */

document.getElementById("copyLink").addEventListener("click", async () => {

  const currentUrl = window.location.href;

  try {

    await navigator.clipboard.writeText(currentUrl);

    alert("Link copiado");

    closeShareMenu();

  } catch {

    alert("No se pudo copiar");

  }

});


/* =========================
   ❌ CERRAR AL HACER CLICK FUERA
========================= */

window.addEventListener("click", e => {

  if (e.target === shareModal) {
    closeShareMenu();
  }

});
