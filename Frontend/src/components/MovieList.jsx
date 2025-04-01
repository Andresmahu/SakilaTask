import React, { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import '../styles/module_movie_list.css'

// Retrieve the backend host from environment variables.
const backend = import.meta.env.VITE_BACKEND_HOST;

const MovieList = () => {
  // State variables for search term, movies, loading state, and errors.
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hook for programmatic navigation.
  const navigate = useNavigate();

  // Function to handle the movie search.
  const handleSearch = async () => {
    // Return early if the search term is empty.
    if (!searchTerm) return;

    // Set loading to true and clear any previous errors.
    setLoading(true);
    setError(null);

    try {
      // Send a POST request to the backend search endpoint.
      const response = await axios.post(`${backend}/films/filmSearch`, {
        search_req: searchTerm,
      });

      // Update the movies state with the search results.
      setMovies(response.data);
    } catch (err) {
      // Set an error message if the search fails.
      setError("Error al obtener las películas"); // Error getting movies
    } finally {
      // Set loading to false regardless of success or failure.
      setLoading(false);
    }
  };

  // Function to handle logout.
  const handleLogout = () => {
    // Clear all items from local storage.
    localStorage.clear();

    // Redirect to the login page.
    navigate("/");
  };

  return (
    <div className="movie-catalog">
      <div className="top-bar">
        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button> {/* Logout */}
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar película..." // Search movie...
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>

      {loading && <p className="loading">Cargando...</p>} {/* Loading... */}
      {error && <p className="error">{error}</p>}

      <div className="movie-list">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.film_id}`} key={movie.film_id} className="movie-card">
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;