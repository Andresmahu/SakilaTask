import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/module_rental_form.css";

// Retrieve the backend host from environment variables.
const backend = import.meta.env.VITE_BACKEND_HOST;

const RentalMovie = () => {
  // Hook for programmatic navigation.
  const navigate = useNavigate();

  // Hook for accessing the current location and state.
  const location = useLocation();

  // Extract movie details passed from the previous page.
  const { inventory_id, customer_id, staff_id } = location.state || {};

  // State variables for rental date, return date, loading state, and errors.
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve user information from local storage.
  const user = JSON.parse(localStorage.getItem("loginResponse"));

  // Function to handle the rental process.
  const handleRent = async () => {
    // Check if both rental and return dates are selected.
    if (!rentalDate || !returnDate) {
      setError("Selecciona ambas fechas."); // Select both dates.
      return;
    }

    // Set loading to true and clear any previous errors.
    setLoading(true);
    setError(null);

    try {
      // Send a POST request to the backend to create a rental.
      await axios.post(`${backend}/rentals/createRental`, {
        rental_date: new Date(rentalDate).toISOString(),
        inventory_id: 1, // Using 1 as inventory ID based on the original code.
        customer_id: parseInt(user.customer_id),
        return_date: new Date(returnDate).toISOString(),
        staff_id: 1, // Using 1 as staff ID based on the original code.
      });

      // Display a success message and navigate back two pages.
      alert("Película rentada con éxito."); // Movie rented successfully.
      navigate(-2); // Navigate back to MovieDetail
    } catch (err) {
      // Log the dates in ISO format for debugging.
      console.log(new Date(rentalDate).toISOString());
      console.log(new Date(returnDate).toISOString());

      // Set an error message if the rental process fails.
      setError("Error al procesar la renta."); // Error processing rental.
    } finally {
      // Set loading to false regardless of success or failure.
      setLoading(false);
    }
  };

  return (
    <div className="rental-form">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="back-button">⬅ Volver</button> {/* ⬅ Back */}

      <h2>Selecciona las fechas de renta</h2> {/* Select rental dates */}

      <label>Fecha de renta:</label> {/* Rental date */}
      <input type="date" value={rentalDate} onChange={(e) => setRentalDate(e.target.value)} />

      <label>Fecha de devolución:</label> {/* Return date */}
      <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />

      {error && <p className="error">{error}</p>}

      <div className="buttons">
        <button onClick={handleRent} disabled={loading}>
          {loading ? "Procesando..." : "Confirmar Renta"} {/* Processing... : Confirm Rental */}
        </button>
      </div>
    </div>
  );
};

export default RentalMovie;