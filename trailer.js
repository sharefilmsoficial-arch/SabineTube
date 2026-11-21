
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

let content = null;
let videoUrl = "";

// ===========================
// SELECCIONAR TRÁILER ALEATORIO
// ===========================

function seleccionarTrailer(trailers) {

    if (Array.isArray(trailers)) {

        if (trailers.length === 0) return null;

        return trailers[
            Math.floor(Math.random() * trailers.length)
        ];

    }

    if (typeof trailers === "string" && trailers.trim() !== "") {
        return trailers;
    }

    return null;
}

// ===========================
// IDENTIFICAR CONTENIDO
// ===========================

if (type === "movie") {

    content = window.MOVIES?.find(m => m.id === id);

} else if (type === "series") {

    content = window.SERIES?.find(s => s.id === id);

} else {

    // Si no hay type, buscar primero en SERIES
    content = window.SERIES?.find(s => s.id === id);

    if (!content) {
        content = window.MOVIES?.find(m => m.id === id);
    }

}

// ===========================
// OBTENER TRÁILER
// ===========================

if (content) {

    const trailers = content.trailerUrl ?? content.video;

    videoUrl = seleccionarTrailer(trailers);

}

// ===========================
// CARGAR TRAILER
// ===========================

if (!content || !videoUrl) {

    document.body.innerHTML = "<h2>Tráiler no encontrado</h2>";

} else {

    const video = document.getElementById("trailerVideo");
    const title = document.getElementById("title");
    const subtitle = document.getElementById("subtitle");

    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.volume = 1;

    title.textContent = content.title;
    subtitle.textContent = content.subtitle || "";

    video.play().catch(() => {});

    let sonidoActivado = false;

    video.addEventListener("click", () => {

        if (!sonidoActivado) {

            video.muted = false;
            video.volume = 1;
            sonidoActivado = true;

            if (video.paused) {
                video.play();
            }

            return;
        }

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }

    });

}

// ===========================
// GENERAR ENLACE PARA COMPARTIR
// ===========================

function getShareUrl() {

    const url = new URL("watch.html", window.location.href);

    const isSeries = type === "series" ||
        (!type && window.SERIES?.some(s => s.id === id));

    if (isSeries) {

        url.searchParams.set("serie", id);
        url.searchParams.set("ep", "1");

    } else {

        url.searchParams.set("id", id);

    }

    return url.href;
}

// ===========================
// BOTÓN COMPARTIR
// ===========================

const shareBtn = document.getElementById("shareBtn");
const shareModal = document.getElementById("shareModal");

if (shareBtn) {

    shareBtn.addEventListener("click", async () => {

        if (!content) return;

        const shareUrl = getShareUrl();
        const shareTitle = content.title;

        // Compartir nativo
        if (navigator.share) {

            try {

                await navigator.share({
                    title: shareTitle,
                    text: `Mira esto en SabineTube: ${shareTitle}`,
                    url: shareUrl
                });

            } catch (err) {
                console.log("Compartir cancelado");
            }

        }

        // Navegadores sin compartir nativo
        else {

            openShareMenu(shareUrl, shareTitle);

        }

    });

}

// ===========================
// MODAL SHARE
// ===========================

function openShareMenu(shareUrl, shareTitle) {

    if (!shareModal) return;

    shareModal.style.display = "flex";

    // WhatsApp
    document.getElementById("shareWhatsapp").href =
        `https://wa.me/?text=${encodeURIComponent(
            `Mira esto en SabineTube: ${shareTitle} ${shareUrl}`
        )}`;

    // Facebook
    document.getElementById("shareFacebook").href =
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
        )}`;

}

// ===========================
// CERRAR MODAL
// ===========================

function closeShareMenu() {

    if (shareModal) {
        shareModal.style.display = "none";
    }

}

// ===========================
// COPIAR LINK
// ===========================

const copyLink = document.getElementById("copyLink");

if (copyLink) {

    copyLink.addEventListener("click", async () => {

        const currentUrl = getShareUrl();

        try {

            await navigator.clipboard.writeText(currentUrl);

            alert("¡Enlace copiado!");
            closeShareMenu();

        } catch {

            prompt("Copia este enlace:", currentUrl);

        }

    });

}

// ===========================
// CERRAR AL HACER CLICK FUERA
// ===========================

if (shareModal) {

    window.addEventListener("click", e => {

        if (e.target === shareModal) {
            closeShareMenu();
        }

    });

}

// ===========================
// BUSCADOR
// ===========================

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
