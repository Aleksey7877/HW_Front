import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
  Image,
  HStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import defaultFilms from "../data/films";
import "../styles/red_style.css";

const genres = ["Боевик", "Триллер", "Комедия", "Драма"];

const getStoredFilms = () => {
  const stored = localStorage.getItem("films");
  return stored ? JSON.parse(stored) : defaultFilms;
};

const saveFilmsToStorage = (films) => {
  localStorage.setItem("films", JSON.stringify(films));
};

const EditFilmPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const films = getStoredFilms();
    const film = films.find((f) => f.title === decodedTitle);
    if (film) {
      setFormData({
        title: film.title,
        originalTitle: film.title,
        duration: film.duration,
        description: film.description,
        genre: { [film.genre]: true },
        img: film.img,
        imgPreview: film.img.startsWith("data:image")
          ? film.img
          : `/img/${film.img}`,
      });
    }
  }, [decodedTitle]);

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
    const newTitle = formData.title;
    const updated = films.map((f) =>
      f.title === formData.originalTitle
        ? {
            ...f,
            title: newTitle,
            duration: formData.duration,
            description: formData.description,
            genre: Object.keys(formData.genre).find((g) => formData.genre[g]),
            img: formData.img,
          }
        : f
    );

    saveFilmsToStorage(updated);

    if (
      formData.originalTitle !== newTitle &&
      favorites.includes(formData.originalTitle)
    ) {
      toggleFavorite(formData.originalTitle);
      toggleFavorite(newTitle);
    }

    navigate(`/film/${encodeURIComponent(newTitle)}`);
  };

  if (!formData) return <Box p={10}>Фильм не найден</Box>;

  return (
    <Box className="red-div-wrapper">
      <Box className="red-container">
        <Flex className="red-frame">
          <Text className="red-text-wrapper-15" onClick={() => navigate("/")}>
            Все фильмы
          </Text>
          <Text
            className="red-text-wrapper-15"
            onClick={() => navigate("/favorites")}
          >
            Избранное
          </Text>
          <Text
            className="red-text-wrapper-15-add"
            onClick={() => navigate("/add")}
          >
            Добавить фильм
          </Text>
        </Flex>

        <Box className="red-wrapper-page">
          <Box className="red-overlap">
            <Heading className="red-text-wrapper-2">
              Редактировать фильм
            </Heading>

            {error && <Text color="red.500">{error}</Text>}

            <Box className="red-form-row">
              <Text className="red-label">Название</Text>
              <Input
                className="red-input"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Box>

            <Box className="red-form-row">
              <Text className="red-label">Жанр</Text>
              <HStack wrap="wrap" gap={4} className="red-horizontal-filters">
                {genres.map((genre) => (
                  <Box
                    key={genre}
                    className={`red-genre-filter red-genre-filter-${genre.toLowerCase()}`}
                    onClick={() => toggleGenre(genre)}
                  >
                    <Box
                      className={`red-circle ${
                        formData.genre[genre] ? "red-active" : ""
                      }`}
                    >
                      {formData.genre[genre] && (
                        <Box className="red-checkmark">✔</Box>
                      )}
                    </Box>
                    <Text className="red-genre-label">{genre}</Text>
                  </Box>
                ))}
              </HStack>
            </Box>

            <Box className="red-form-row">
              <Text className="red-label">Длительность</Text>
              <Input
                className="red-input"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </Box>

            <Box className="red-form-row">
              <Text className="red-label">Описание</Text>
              <Textarea
                className="red-textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Box>

            <Box className="red-file-block">
              <Text className="red-file-label">Фото</Text>
              <label htmlFor="file-upload">
                <Box as="span" className="red-button">
                  Выбрать файл
                </Box>
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
              <Image
                src={formData.imgPreview}
                alt="Превью"
                className="red-image-preview"
              />
            </Box>

            <Box as="button" onClick={handleSave} className="red-button-2">
              Сохранить изменения
            </Box>
          </Box>

          <Box className="red-group-3">
            <Text className="red-text-wrapper-5">Фильмограф</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditFilmPage;
