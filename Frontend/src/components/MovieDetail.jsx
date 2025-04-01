import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/module_movie_detail.css";

// Retrieve the backend host from environment variables.
const backend = import.meta.env.VITE_BACKEND_HOST;

const MovieDetail = () => {
  // Extract film_id from URL parameters.
  const { film_id } = useParams();

  // Hook for programmatic navigation.
  const navigate = useNavigate();

  // State variables for movie details, loading state, and errors.
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie details on component mount or film_id change.
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Send a GET request to the backend to retrieve movie details.
        const response = await axios.get(`${backend}/films/${film_id}`);
        setMovie(response.data);
      } catch (err) {
        // Set an error message if fetching fails.
        setError("Error al obtener los detalles de la película"); // Error getting movie details
      } finally {
        // Set loading to false regardless of success or failure.
        setLoading(false);
      }
    };

    fetchMovie();
  }, [film_id]);

  // Retrieve user information from local storage.
  const user = JSON.parse(localStorage.getItem("loginResponse"));

  // Function to handle the rent button click.
  const handleRentClick = () => {
    // Check if the user is logged in.
    if (!user) {
      alert("Debes iniciar sesión para rentar una película."); // You must log in to rent a movie.
      return;
    }

    // Navigate to the rental page, passing movie details as state.
    navigate("/rental", {
      state: {
        inventory_id: movie.inventory_id,
        customer_id: user.customer_id,
        staff_id: 1,
      },
    });
  };

  // Function to handle the go back button click.
  const handleGoBack = () => {
    navigate("/MovieList"); // Navigate back to the movie catalog
  };

  // Render loading state while fetching data.
  if (loading) return <p className="loading">Cargando...</p>; // Loading...

  // Render error message if fetching fails.
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="movie-detail">
      {/* Back button */}
      <button className="back-button" onClick={handleGoBack}>⬅ Volver</button> {/* ⬅ Back */}

      {movie && (
        <div className="movie-card">
          <h1>{movie.title}</h1>
          <p className="description">{movie.description}</p>
          <div className="movie-info">
            <p><strong>Duración:</strong> {movie.length} min</p> {/* Duration */}
            <p><strong>Año de salida:</strong> {movie.release_year}</p> {/* Release year */}
            <p><strong>Clasificación:</strong> {movie.rating}</p> {/* Rating */}
            <p><strong>Precio de renta:</strong> ${movie.rental_rate}</p> {/* Rental price */}
          </div>
          <button className="rent-button" onClick={handleRentClick}>🎬 Rentar</button> {/* 🎬 Rent */}
        </div>
      )}
    </div>
  );
};

export default MovieDetail;