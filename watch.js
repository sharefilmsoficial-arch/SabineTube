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

// ⭐ Cambiar título de la pestaña
document.title = `${serie.title} Ep.${episodio.n} — SabineTube`;

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

  // 🎬 Player
  player.src = movie.movie;

  // 📝 Info
  titleEl.textContent = movie.title;
  imgEl.src = movie.post || movie.image;
  descEl.textContent = movie.description || "";

  // ⭐ Cambiar título de la pestaña
document.title = `${movie.title} — SabineTube`;

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
      window.location.href = `results.html?query=${encodeURIComponent(value)}`;
    }
  }
});



/* =========================
   📤 COMPARTIR
========================= */

const shareBtn = document.getElementById("shareBtn");

// URL actual
const currentUrl = window.location.href;

// Título actual
const currentTitle = document.title;

shareBtn.addEventListener("click", async () => {

  // 📱 Compartir nativo (móviles y navegadores compatibles)
  if (navigator.share) {
    try {
      await navigator.share({
        title: currentTitle,
        text: `Mira esto en SabineTube: ${currentTitle}`,
        url: currentUrl
      });

      console.log("Contenido compartido");

    } catch (err) {
      console.log("Compartir cancelado");
    }
  }

  // 💻 Si no existe navigator.share → abrir modal
  else {
    openShareMenu();
  }

});


/* =========================
   📦 MODAL SHARE
========================= */

const shareModal = document.getElementById("shareModal");

function openShareMenu() {

  shareModal.style.display = "flex";

  // WhatsApp
  document.getElementById("shareWhatsapp").href =
    `https://wa.me/?text=${encodeURIComponent(currentTitle + " " + currentUrl)}`;

  // Facebook
  document.getElementById("shareFacebook").href =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
}

function closeShareMenu() {
  shareModal.style.display = "none";
}


/* =========================
   📋 COPIAR LINK
========================= */

document.getElementById("copyLink").addEventListener("click", async () => {

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
