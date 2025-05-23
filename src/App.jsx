import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { FavoriteProvider } from "./context/FavoriteContext";

import MainPage from "./pages/MainPage";
import FavoritesPage from "./pages/FavoritesPage";
import FilmPage from "./pages/FilmPage";
import EditFilmPage from "./pages/EditFilmPage";
import AddFilmPage from "./pages/AddFilmPage";

function App() {
  return (
    <ChakraProvider>
      <FavoriteProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/edit/:title" element={<EditFilmPage />} />
            <Route path="/add" element={<AddFilmPage />} />
            <Route path="/film/:title" element={<FilmPage />} />
          </Routes>
        </Router>
      </FavoriteProvider>
    </ChakraProvider>
  );
}

export default App;
