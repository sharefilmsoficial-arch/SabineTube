const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");
const ep = params.get("ep");

let content = null;
let videoUrl = "";
let episodioIndividual = false;

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

    content = window.SERIES?.find(s => s.id === id);

    if (!content) {
        content = window.MOVIES?.find(m => m.id === id);
    }

}

// ===========================
// IDENTIFICAR EPISODIO
// ===========================

if (content && ep && type === "series") {

    const episodio = content.episodes?.find(e =>
        String(e.n) === String(ep)
    );

    if (episodio) {
        content = episodio;
        episodioIndividual = true;
    }

}

// ===========================
// OBTENER TRÁILER
// ===========================

if (content) {

    const trailers = episodioIndividual
        ? content.video
        : content.trailerUrl ?? content.video;

    videoUrl = seleccionarTrailer(trailers);

}

// ===========================
// MOSTRAR ERROR
// ===========================

function mostrarError() {

    document.body.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #181818;
            color: white;
            text-align: center;
            font-family: Arial, sans-serif;
            padding: 20px;
            box-sizing: border-box;
        ">

            <img
                src="iconos/error.png"
                alt="Error"
                style="
                    width: 300px;
                    max-width: 80%;
                    margin-bottom: 20px;
                "
            >

            <h2>😅 Tráiler no disponible</h2>

            <p>
                Lo sentimos, todavía no hay un tráiler
                para este contenido.
            </p>

            <a href="index.html" style="
                color: white;
                margin-top: 15px;
            ">
                Volver al inicio
            </a>

        </div>
    `;

}

// ===========================
// CARGAR TRÁILER
// ===========================

if (!content || !videoUrl) {

    mostrarError();

} else {

    const video = document.getElementById("trailerVideo");
    const title = document.getElementById("title");
    const subtitle = document.getElementById("subtitle");

    video.src = videoUrl;
    video.loop = true;
    video.muted = true;
    video.volume = 1;

    title.textContent = content.title || content.name;

    if (episodioIndividual) {

        subtitle.textContent = `Episodio ${content.n}: ${content.name}`;

    } else {

        const descripcion = content.subtitle || content.description || "";
        const limite = 120;
        let expandido = false;

        function actualizarDescripcion() {

            if (descripcion.length <= limite) {
                subtitle.textContent = descripcion;
                return;
            }

            if (expandido) {

                subtitle.innerHTML = "";

                subtitle.append(
                    descripcion,
                    " "
                );

                const boton = document.createElement("span");
                boton.textContent = "Ver menos";
                boton.className = "ver-menos";

                subtitle.appendChild(boton);

            } else {

                subtitle.innerHTML = "";

                subtitle.append(
                    descripcion.substring(0, limite) + "... ",
                );

                const boton = document.createElement("span");
                boton.textContent = "Ver más";
                boton.className = "ver-mas";

                subtitle.appendChild(boton);

            }

        }

        subtitle.addEventListener("click", () => {

            if (descripcion.length <= limite) return;

            expandido = !expandido;
            actualizarDescripcion();

        });

        actualizarDescripcion();

    }

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

        if (episodioIndividual) {
            url.searchParams.set("ep", ep);
        } else {
            url.searchParams.set("ep", "1");
        }

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
        const shareTitle = content.title || content.name;

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

        } else {

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

    document.getElementById("shareWhatsapp").href =
        `https://wa.me/?text=${encodeURIComponent(
            `Mira esto en SabineTube: ${shareTitle} ${shareUrl}`
        )}`;

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

// ===========================
// BOTÓN VER
// ===========================

const watchBtn = document.getElementById("watchBtn");

if (watchBtn) {

    watchBtn.addEventListener("click", () => {

        if (!content) return;

        window.location.href = getShareUrl();

    });

}
