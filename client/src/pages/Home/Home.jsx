import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import api from "../../services/api.js";
import "./Home.css";

const SEARCH_SUGGESTIONS = [
  "Search for movies...",
  "Search \"Action\"...",
  "Search \"Comedy\"...",
  "Search \"Sci-Fi\"...",
  "Search your next favorite...",
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();

    if (!heroSearch.trim()) return;

    navigate(`/movies?search=${encodeURIComponent(heroSearch.trim())}`);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies?limit=30");

        const data = response.data.movies || response.data || [];

        setMovies(data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const trendingMovies = movies.slice(0, 8);

  const popularMovies = [...movies]
    .sort(
      (a, b) =>
        Number(b.imdbRating || 0) -
        Number(a.imdbRating || 0)
    )
    .slice(0, 8);

  const topRatedMovies = [...movies]
    .sort(
      (a, b) =>
        Number(b.imdbRating || 0) -
        Number(a.imdbRating || 0)
    )
    .slice(0, 8);

  const heroMovie = movies[0];

  if (loading) {
    return (
      <div className="home-loading">
        <Loader />
      </div>
    );
  }

  return (
    <main className="cg-home">

      {/* STANDALONE SEARCH HEADER - always visible regardless of data */}
      <section className="cg-home-search-section">
        <div className="cg-home-search-inner">
          <h1 className="cg-home-search-title">
            Find your next <span>favorite</span>
          </h1>
          <p className="cg-home-search-subtitle">
            Unlimited movies, TV shows, and more.
          </p>

          <form className="hero-search cg-home-search" onSubmit={handleHeroSearch}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder={SEARCH_SUGGESTIONS[placeholderIndex]}
              key={placeholderIndex}
              aria-label="Search movies and shows"
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      {/* HERO */}
      {heroMovie && (
        <section
          className="cg-hero"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(3,5,10,1) 0%,
                rgba(3,5,10,0.94) 28%,
                rgba(3,5,10,0.55) 55%,
                rgba(3,5,10,0.15) 100%
              ),
              linear-gradient(
                0deg,
                #03050a 0%,
                transparent 35%
              ),
              url(${heroMovie.backdrop || heroMovie.poster})
            `,
          }}
        >

          <div className="hero-content">

            <div className="hero-badge">
              FEATURED MOVIE
            </div>

            <h1 className="hero-title">
              {heroMovie.title}
            </h1>

            <div className="hero-meta">

              <span className="rating">
                <i className="bi bi-star-fill"></i>
                {heroMovie.imdbRating || "N/A"}
              </span>

              <span>
                {heroMovie.releaseYear || "2024"}
              </span>

              <span>
                {heroMovie.duration || "2h 10m"}
              </span>

              <span>
                {heroMovie.genre || "Drama"}
              </span>

            </div>

            <p className="hero-description">
              {heroMovie.story ||
                heroMovie.description ||
                heroMovie.overview ||
                "Discover an unforgettable cinematic experience with CineGalaxy."}
            </p>

            <div className="hero-buttons">

              <Link
                to={`/movie/${heroMovie._id}`}
                className="watch-button"
              >
                <i className="bi bi-play-fill"></i>
                Watch Now
              </Link>

              <button className="my-list-button">
                <i className="bi bi-plus-lg"></i>
                My List
              </button>

            </div>

          </div>

          <div className="hero-age">
            U/A 13+
          </div>

          <div className="hero-arrows">

            <button>
              <i className="bi bi-chevron-left"></i>
            </button>

            <button>
              <i className="bi bi-chevron-right"></i>
            </button>

          </div>

          <div className="hero-dots">
            <span className="active"></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

        </section>
      )}

      {/* MOVIE SECTIONS */}

      <div className={`cg-content${!heroMovie ? " no-hero" : ""}`}>

        {movies.length === 0 ? (
          <div className="cg-home-empty">
            <i className="bi bi-film"></i>
            <h3>No movies to show yet</h3>
            <p>We couldn't load the catalog. Check that your backend/API is running, or try searching above.</p>
          </div>
        ) : (
          <>
            <MovieSection
              title="Trending Now"
              icon="bi-fire"
              movies={trendingMovies}
            />

            <MovieSection
              title="Popular Movies"
              icon="bi-star-fill"
              movies={popularMovies}
            />

            <MovieSection
              title="Top Rated"
              icon="bi-trophy-fill"
              movies={topRatedMovies}
            />
          </>
        )}

      </div>

    </main>
  );
}

function MovieSection({ title, icon, movies }) {
  if (!movies.length) return null;

  return (
    <section className="movie-section">

      <div className="section-header">

        <div className="section-heading">
          <span className="section-line"></span>

          <h2>
            <i className={`bi ${icon}`}></i>
            {title}
          </h2>
        </div>

        <Link to="/movies" className="view-all">
          View All
          <i className="bi bi-arrow-right"></i>
        </Link>

      </div>

      <div className="movie-row">

        {movies.map((movie) => (
          <div className="movie-item" key={movie._id}>
            <MovieCard movie={movie} />
          </div>
        ))}

        <button className="row-next">
          <i className="bi bi-chevron-right"></i>
        </button>

      </div>

    </section>
  );
}

export default Home;