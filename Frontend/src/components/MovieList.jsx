import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import '../styles/module_movie_list.css'

const backend = import.meta.env.VITE_BACKEND_HOST;

const MovieList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState('1');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const storeOptions = [
    { id: '1', name: 'Tienda 1' },
    { id: '2', name: 'Tienda 2' },
  ];

  const handleSearch = async () => {
    if (!searchTerm || !selectedStoreId) {
        setMovies([]);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${backend}/films/filmSearch`, {
        search_req: searchTerm,
        store_id: selectedStoreId,
      });
      setMovies(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Error al obtener las películas para la tienda seleccionada.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="movie-catalog">
      <div className="top-bar">
        <input
          type="text"
          placeholder="Buscar película..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
        <button onClick={handleSearch} className="search-button">
          <FaSearch />
        </button>
        <select
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(e.target.value)}
          className="store-select"
        >
          {storeOptions.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      {loading && <p className="loading">Cargando...</p>}
      {error && <p className="error">{error}</p>}

      <div className="movie-list">
        {movies.map((movie) => (
          <Link
             to={`/movie/${movie.film_id}`}
             key={movie.film_id}
             className="movie-card"
             // 👇 Añade esta línea para pasar el state
             state={{ store_id: selectedStoreId }}
           >
            <h3>{movie.title}</h3>
            {movie.description && <p>{movie.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;