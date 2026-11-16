/* =========================
   📜 SHAREFILMS HISTORIAL
========================= */

const HISTORY_KEY = "sharefilms_watch_history";

function getHistory() {
  try {
    const history = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );

    return Array.isArray(history)
      ? history
      : [];
  } catch {
    return [];
  }
}

function formatDate(dateString) {
  try {
    return new Date(dateString)
      .toLocaleString();
  } catch {
    return dateString || "";
  }
}

function renderHistory() {

  const container =
    document.getElementById("historyList");

  if (!container) return;

  const history = getHistory();

  container.innerHTML = "";

  if (history.length === 0) {

    container.innerHTML = `
      <div class="empty">
        <h3>No hay contenido en tu historial</h3>
        <p>
          Empieza a ver películas y series
          para que aparezcan aquí.
        </p>
      </div>
    `;

    return;
  }

  history.forEach(item => {

    const card = document.createElement("div");
    card.className = "card";

    let subtitle = "";

    if (item.type === "episode") {
      subtitle =
        `Episodio ${item.episodeNumber}: ${item.episodeName}`;
    } else {
      subtitle = item.year || "Película";
    }

    card.innerHTML = `
      <div class="thumb">
        <img
          src="${item.image || ""}"
          alt="${item.title}"
          loading="lazy">
      </div>

      <div class="info">
        <h3>${item.title}</h3>

        <p class="channel">
          ${subtitle}
        </p>

        <p>
          Visto: ${formatDate(item.watchedAt)}
        </p>

        <button
          class="remove-btn"
          data-url="${item.url}">
          Eliminar
        </button>
      </div>
    `;

    card.addEventListener("click", e => {

      if (
        e.target.classList.contains(
          "remove-btn"
        )
      ) {
        return;
      }

      if (item.url) {
        window.location.href = item.url;
      }
    });

    container.appendChild(card);
  });

  setupDeleteButtons();
}

function setupDeleteButtons() {

  document
    .querySelectorAll(".remove-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        e => {

          e.preventDefault();
          e.stopPropagation();

          const url =
            button.dataset.url;

          let history =
            getHistory();

          history =
            history.filter(
              item =>
                item.url !== url
            );

          localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(history)
          );

          renderHistory();
        }
      );
    });
}

function clearHistory() {

  if (
    !confirm(
      "¿Borrar todo el historial?"
    )
  ) {
    return;
  }

  localStorage.removeItem(
    HISTORY_KEY
  );

  renderHistory();
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderHistory();

    const refreshBtn =
      document.getElementById(
        "refreshHistory"
      );

    const clearBtn =
      document.getElementById(
        "clearHistory"
      );

    if (refreshBtn) {
      refreshBtn.addEventListener(
        "click",
        renderHistory
      );
    }

    if (clearBtn) {
      clearBtn.addEventListener(
        "click",
        clearHistory
      );
    }
  }
);