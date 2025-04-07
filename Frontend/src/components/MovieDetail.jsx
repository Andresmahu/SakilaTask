import React, { useEffect, useState } from "react";
// Añade useLocation para leer el state pasado por navigate
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/module_movie_detail.css"; // Asegúrate que la ruta al CSS es correcta

// Retrieve the backend host from environment variables.
const backend = import.meta.env.VITE_BACKEND_HOST;

const MovieDetail = () => {
  // film_id de los parámetros de la URL
  const { film_id } = useParams();
  const navigate = useNavigate();
  // Hook para acceder al state pasado en la navegación
  const location = useLocation();

  // --- Obtener store_id pasado desde MovieList ---
  // ** IMPORTANTE: Asegúrate que MovieList.jsx envíe store_id en el state al navegar aquí **
  // Ejemplo en MovieList: navigate(`/movie/${movie.film_id}`, { state: { store_id: selectedStoreId } });
  const store_id = location.state?.store_id; // Acceso seguro al store_id

  // Estados del componente
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Estado para la info del usuario

  // Fetch movie details
  useEffect(() => {
    setLoading(true);
    setError(null); // Limpiar errores previos

    const fetchMovie = async () => {
      // Validar film_id antes de la llamada
      if (!film_id || isNaN(parseInt(film_id))) {
         setError("ID de película inválido.");
         setLoading(false);
         return;
      }
      try {
        const response = await axios.get(`${backend}/films/${film_id}`);
        setMovie(response.data);
      } catch (err) {
        console.error("Error al obtener detalles:", err);
        if (err.response && err.response.status === 404) {
            setError("Película no encontrada.");
        } else {
            setError("Error al obtener los detalles de la película.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [film_id]); // Dependencia: re-fetch si cambia film_id

  // Obtener datos del usuario del localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem("loginResponse");
    if (storedUser) {
      try {
          setUser(JSON.parse(storedUser));
      } catch (parseError) {
          console.error("Error parsing user from localStorage:", parseError);
          // Opcional: limpiar localStorage si está corrupto
          // localStorage.removeItem("loginResponse");
      }
    }
  }, []); // Se ejecuta solo una vez al montar

  // Función para manejar el clic en el botón de rentar
  const handleRentClick = () => {
    // Verificar si el usuario ha iniciado sesión
    if (!user || !user.customer_id) {
      alert("Debes iniciar sesión para rentar una película.");
      // Podrías redirigir al login: navigate('/login');
      return;
    }

    // --- Verificar si tenemos el store_id ---
    if (!store_id) {
        // Esto no debería pasar si MovieList lo envía correctamente
        console.error("Error: store_id no fue recibido desde la página anterior.");
        alert("Error: No se pudo identificar la tienda. Por favor, regrese a la lista de películas e intente de nuevo.");
        return;
    }

    // --- Navegar a la página de renta (/rental) ---
    // Pasando los datos CORRECTOS que RentalMovie espera:
    // film_id, store_id, customer_id, (opcional title), y staff_id (aún placeholder)
    navigate("/rental", {
      state: {
        film_id: parseInt(film_id), // Convertir a número por si acaso
        store_id: store_id,
        customer_id: user.customer_id,
        title: movie?.title, // Pasa el título para mostrar en la página de confirmación
        staff_id: 1, // Usando placeholder '1' por ahora.
      },
    });
  };

  // Función para volver atrás
  const handleGoBack = () => {
    // navigate("/MovieList"); // O ir específicamente al catálogo
    navigate(-1); // Opción más genérica: ir a la página anterior en el historial
  };

  // Renderizado condicional
  if (loading) return <p className="loading">Cargando...</p>;

  // Mostrar error si falló la carga o si no hay película después de cargar
  if (error || (!movie && !loading)) {
    return (
        <div className="movie-detail-error">
           <p className="error">{error || "No se encontraron detalles para esta película."}</p>
           <button className="back-button" onClick={handleGoBack}>⬅ Volver</button>
        </div>
    );
  }

  // Renderizado si la película se cargó correctamente
  return (
    <div className="movie-detail">
      <button className="back-button" onClick={handleGoBack}>⬅ Volver</button>

      <div className="movie-card">
        <h1>{movie.title}</h1>
        <p className="description">{movie.description}</p>
        <div className="movie-info">
          {/* Usa '??' para mostrar 'N/A' si algún dato falta */}
          <p><strong>Duración:</strong> {movie.length ?? 'N/A'} min</p>
          <p><strong>Año de salida:</strong> {movie.release_year ?? 'N/A'}</p>
          <p><strong>Clasificación:</strong> {movie.rating ?? 'N/A'}</p>
          <p><strong>Precio de renta:</strong> ${movie.rental_rate ?? 'N/A'}</p>
        </div>
        {/* Deshabilitar el botón si falta información esencial */}
        <button
            className="rent-button"
            onClick={handleRentClick}
            disabled={!user || !store_id} // Deshabilitado si no hay usuario o no se recibió store_id
            title={!user ? "Inicia sesión para rentar" : !store_id ? "Tienda no especificada" : `Rentar ${movie.title}`}
        >
            🎬 Rentar
        </button>
        {/* Mensaje de ayuda si falta store_id */}
        {!store_id && <p className="error-small">No se pudo determinar la tienda de origen.</p>}
      </div>
    </div>
  );
};

export default MovieDetail;