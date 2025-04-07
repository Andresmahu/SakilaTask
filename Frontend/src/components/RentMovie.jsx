import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/module_rental_form.css"; // Asegúrate que la ruta al CSS es correcta

const backend = import.meta.env.VITE_BACKEND_HOST;

const RentalMovie = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Extrae los datos necesarios pasados desde MovieDetail
  const { film_id, store_id, title } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [staffId, setStaffId] = useState(1);

  useEffect(() => {
    // Carga datos del usuario desde localStorage
    const storedUser = localStorage.getItem("loginResponse");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Valida que el usuario parseado y su ID existan
        if (parsedUser?.customer_id) {
          setUser(parsedUser);
        } else {
          setError("Datos del cliente inválidos en el almacenamiento local.");
        }
      } catch (parseError) {
        console.error("Error parsing user from localStorage:", parseError);
        setError("Error al leer los datos del usuario.");
        // Opcional: limpiar localStorage si está corrupto
        // localStorage.removeItem("loginResponse");
      }
    } else {
      setError("Usuario no autenticado. Por favor, inicie sesión.");
      // Opcional: redirigir a login si es necesario
      // navigate('/login');
    }

    // Valida que se recibieron film_id y store_id
    if (!film_id || !store_id) {
      setError("No se recibió la información necesaria de la película o tienda. Regrese e intente de nuevo.");
    }
  }, [film_id, store_id]); // Dependencias del useEffect

  const handleRent = async () => {
    // Validación final antes de enviar la solicitud
    if (!user?.customer_id || !film_id || !store_id || !staffId) {
      // Actualiza el error si aún no está establecido por el useEffect
      if (!error) {
        setError("Faltan datos esenciales para la renta (Usuario, Película, Tienda o Staff).");
      }
      return; // No continuar si faltan datos
    }

    setLoading(true);
    setError(null); // Limpiar errores previos antes de intentar

    // --- Define el payload que espera el backend ---
    const payload = {
      film_id: film_id,
      store_id: store_id,
      customer_id: parseInt(user.customer_id), // Asegurar que sea número
      staff_id: staffId, // Usar el ID de staff (actualmente placeholder 1)
      rental_date: new Date().toISOString(), // Añadir fecha actual requerida por el backend
      return_date: null // Enviar null explícitamente (coincide con Optional[datetime]=None)
    };

    console.log("Enviando payload a /createRental:", payload); // Log para depuración

    try {
      // Enviar la solicitud POST al backend
      const response = await axios.post(`${backend}/rentals/createRental/`, payload);

      // --- Manejo de respuesta exitosa ---
      // Usa el mensaje y rental_id que SÍ devuelve el backend
      alert(`${response.data.message}\nID de Renta: ${response.data.rental_id}`);
      // Navegar a la lista de películas (asegúrate que '/MovieList' es la ruta correcta)
      navigate('/MovieList');

    } catch (err) {
      // --- Manejo de errores ---
      console.error("Error al intentar rentar:", err);
      const status = err.response?.status;
      const detail = err.response?.data?.detail;
      let errorMessage = `Error ${status || ''}: No se pudo procesar la renta.`; // Mensaje por defecto

      if (typeof detail === "string") {
        // Si el backend envía un mensaje de error claro (ej. 404 de disponibilidad)
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
         // Si el backend envía errores de validación Pydantic (ej. 422)
        try {
             errorMessage = detail.map(e => `${e.loc?.[1] || 'Campo'}: ${e.msg}`).join('; ');
        } catch(e){ console.error("Error parsing detail array", e)}

      } else if (err.request) {
        // Si no hubo respuesta del servidor
        errorMessage = "No se pudo conectar con el servidor. Verifique su conexión.";
      } else {
         // Otro tipo de error
        errorMessage = err.message || "Ocurrió un error inesperado.";
      }
       setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Lógica para deshabilitar el botón
  const isRentDisabled = loading || !!error || !user?.customer_id || !film_id || !store_id || !staffId;

  return (
    <div className="rental-form">
      <button onClick={() => navigate(-1)} className="back-button" aria-label="Volver">
        ⬅ Volver
      </button>

      <h2>Confirmar Renta</h2>

      {/* Mostrar detalles para confirmación */}
      {title && <p className="confirmation-detail">Película: <strong>{title}</strong></p>}
      {store_id && <p className="confirmation-detail">Tienda ID: <strong>{store_id}</strong></p>}
      {user?.customer_id && <p className="confirmation-detail">Cliente ID: <strong>{user.customer_id}</strong></p>}
      {/* Podrías añadir el Staff ID si fuera relevante mostrarlo */}
      {/* {staffId && <p className="confirmation-detail">Staff ID: <strong>{staffId}</strong></p>} */}

      {/* Mostrar el mensaje de error */}
      {error && (
        <div className="error-message"> {/* Usa una clase para estilizar el error */}
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="buttons">
        <button onClick={handleRent} disabled={isRentDisabled}>
          {loading ? "Procesando..." : "Confirmar Renta"}
        </button>
      </div>


      {!error && !loading && !isRentDisabled && (
        <p className="info-text">Al confirmar, se registrará la renta con la fecha y hora actuales.</p>
      )}
    </div>
  );
};

export default RentalMovie;