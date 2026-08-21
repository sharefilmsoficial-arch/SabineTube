const sampleTrailer = "https://www.w3schools.com/html/mov_bbb.mp4"; // Tráiler genérico temporal

const MOVIES = [
  {
    id: "the-ugly-stepsister",
    title: "La hermanastra Fea",
    year: 2025,
    duration: "1h 56min",
    rating: "R-18",
    genres: ["Terror","Drama","Oscuro","Elevado"],
    description: "Elvira sueña con amor del príncipe Julián y está dispuesta a hacer lo que sea necesario para ajustarse a los ideales de belleza del reino.",
    trailerUrl: sampleTrailer,
    image: "R-18/images/the-ugly-stepsister.webp",
    post: "https://sharefilmsoficial-arch.github.io/SabineClear.com/R-18/posters/the-ugly-stepsister.webp",
    movie: "https://drive.google.com/file/d/1x-44SfqShcU8_FamhccxsLxXZoJygCJ4/preview"
  },
  {
    id: "we're-the-millers",
    title: "¿Quién *&$%! son los Miller?",
    year: 2013,
    duration: "1h 50min",
    rating: "R-18",
    genres: ["Comedia","Aventura","Crimen"],
    description: "David, un distribuidor de marihuana de poca monta,aprende por las malas que ninguna buena acción queda sin castigo. Al intentar ayudar a unos jóvenes, es sorprendido por unos criminales, perdiendo su dinero y producto. David está endeudado con su proveedor y para solucionarlo, debe ir a México para recoger el nuevo cargamento. Para lograr la misión, David idea un plan infalible: reúne a una familia falsa y la sube a una casa rodante para dirigirse al sur durante un fin de semana salvaje.",
    trailerUrl: sampleTrailer,
    image: "R-18/images/quienes-son-los-millers.webp",
    post: "https://sharefilmsoficial-arch.github.io/SabineClear.com/R-18/posters/quienes-son-los-millers.webp",
    movie: ""
  },
  {
    id: "el-perfume_la-historia-de-un-asesino",
    title: "El Perfume - La Historia de un Asesino",
    year: 2006,
    duration: "2h 27min",
    rating: "R-18",
    genres: ["Suspenso","Fantasía"],
    description: "Con su increíble talento por discernir las esencias, Jean-Baptiste Grenouille se convierte en el aprendiz de un perfumista francés. Obsesionado con capturar un elusivo aroma, la esencia de una joven mujer, Baptiste se convierte en un asesino.",
    trailerUrl: sampleTrailer,
    image: "R-18/images/perfume.webp",
    post: "R-18/posters/perfume.webp",
    movie: "https://sharefilmsoficial-arch.github.io/SabineClear.com/R-18/posters/el-perfume_la-historia-de-un-asesino.webp"
  }
];

// (Opcional) Exponerlo globalmente
window.MOVIES = MOVIES;
