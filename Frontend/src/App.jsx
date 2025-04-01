import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import MovieList from "./components/MovieList";
import MovieDetail from "./components/MovieDetail";
import RentalMovie from "./components/RentMovie"


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the login page. */}
        <Route path="/" element={<Login />} />

        {/* Route for the movie catalog page. */}
        <Route path="/movieList" element={<MovieList />} />

        {/* Route for individual movie detail pages, with film_id as a parameter. */}
        <Route path="/movie/:film_id" element={<MovieDetail />} />

        {/* Route for the rental form page. */}
        <Route path="/rental" element={<RentalMovie/>} />
      </Routes>
    </Router>
  );
};

export default App;