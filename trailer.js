const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

const movie = window.movies.find(m => m.id === id);

if (!movie) {
  document.body.innerHTML = "<h2>Tráiler no encontrado</h2>";
} else {
  const video = document.getElementById("trailerVideo");
  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");

  video.src = movie.video;
  video.loop = true;
  video.muted = true;
  video.play();

  title.textContent = movie.title;
  subtitle.textContent = movie.subtitle;
}