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
   🎬 MOVIES R-18
========================= */

if (params.has("id")) {

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
  document.title = `${movie.title} — ShareFilms`;

  // ⭐ FAVICON DINÁMICO
  favicon.href = movie.post || movie.image;

  // 🎞️ Películas relacionadas
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
      location.href = `watch-18.html?id=${m.id}`;
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

      window.location.href =
        `results.html?query=${encodeURIComponent(value)}`;

    }

  }

});


/* =========================
   📤 COMPARTIR
========================= */

const shareBtn = document.getElementById("shareBtn");
const shareModal = document.getElementById("shareModal");

shareBtn.addEventListener("click", async () => {

  const currentUrl = window.location.href;
  const currentTitle = document.title;

  // 📱 Compartir nativo
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

  // 🟢 WhatsApp
  document.getElementById("shareWhatsapp").href =
    `https://wa.me/?text=${encodeURIComponent(
      "Mira esto en SabineTube: " + currentTitle + " " + currentUrl
    )}`;

  // 🔵 Facebook
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
