// Стартовая адаптация AddFilmPage под Chakra UI с сохранением оригинальных CSS классов и структуры
import React, { useState } from "react";
import {
  Box,
  Text,
  Input,
  Textarea,
  Button,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import defaultFilms from "../data/films";
import "../styles/add_style.css";

const genres = ["Боевик", "Триллер", "Комедия", "Драма"];

const getStoredFilms = () => {
  const stored = localStorage.getItem("films");
  return stored ? JSON.parse(stored) : defaultFilms;
};

const saveFilmsToStorage = (films) => {
  localStorage.setItem("films", JSON.stringify(films));
};

const AddFilmPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    description: "",
    genre: {},
    img: "",
    imgPreview: "",
  });

  const [error, setError] = useState("");

  const toggleGenre = (genre) => {
    setFormData((prev) => ({
      ...prev,
      genre: { [genre]: true },
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      setError("Пожалуйста, введите название фильма.");
      return;
    }

    if (!Object.values(formData.genre).includes(true)) {
      setError("Пожалуйста, выберите жанр.");
      return;
    }

    const films = getStoredFilms();
    const newFilm = {
      title: formData.title.trim(),
      duration: formData.duration,
      description: formData.description,
      genre: Object.keys(formData.genre).find((g) => formData.genre[g]),
      img: formData.img,
    };

    saveFilmsToStorage([...films, newFilm]);
    navigate("/");
  };

  return (
    <Box className="add-div-wrapper">
      <Box className="add-div">
        <Flex className="add-frame">
          <Text className="add-text-wrapper-15" onClick={() => navigate("/")}>
            Все фильмы
          </Text>
          <Text
            className="add-text-wrapper-15"
            onClick={() => navigate("/favorites")}
          >
            Избранное
          </Text>
          <Text
            className="add-text-wrapper-15-add"
            onClick={() => navigate("/add")}
          >
            Добавить фильм
          </Text>
        </Flex>

        <Box className="add-overlap">
          <Text className="add-text-wrapper-2">Добавить фильм</Text>

          {error && (
            <Text color="red" mb={3}>
              {error}
            </Text>
          )}

          <Flex className="add-form-row">
            <Text className="add-label">Название</Text>
            <Input
              className="add-input"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Flex>

          <Flex className="add-form-row">
            <Text className="add-label">Жанр</Text>
            <Flex className="add-horizontal-filters">
              {genres.map((genre) => (
                <Box
                  key={genre}
                  className={`add-genre-filter add-genre-filter-${genre.toLowerCase()}`}
                  onClick={() => toggleGenre(genre)}
                >
                  <Box
                    className={`add-circle ${
                      formData.genre[genre] ? "add-active" : ""
                    }`}
                  >
                    {formData.genre[genre] && (
                      <Box className="add-checkmark">✓</Box>
                    )}
                  </Box>
                  <Text className="add-genre-label">{genre}</Text>
                </Box>
              ))}
            </Flex>
          </Flex>

          <Flex className="add-form-row">
            <Text className="add-label">Длительность</Text>
            <Input
              className="add-input"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />
          </Flex>

          <Flex className="add-form-row">
            <Text className="add-label">Описание</Text>
            <Textarea
              className="add-textarea"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Flex>

          <Flex className="add-form-row">
            <Text className="add-label">Загрузить фото</Text>
            <Flex className="add-file-block">
              <label htmlFor="file-upload" className="add-button">
                Выбрать файл
              </label>
              <input
                id="file-upload"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setFormData((prev) => ({
                        ...prev,
                        img: reader.result,
                        imgPreview: reader.result,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {formData.imgPreview && (
                <Image
                  src={formData.imgPreview}
                  alt="preview"
                  className="add-image-preview"
                />
              )}
            </Flex>
          </Flex>

          <Box as="button" className="add-button-2" onClick={handleSave}>
            Добавить фильм
          </Box>
        </Box>

        <Box className="add-group-3">
          <Text className="add-text-wrapper-5">Фильмограф</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default AddFilmPage;
