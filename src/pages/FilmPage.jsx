import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Image, Button, IconButton } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import { getFilmsFromStorage, saveFilmsToStorage } from "../utils/localFilms";
import "../styles/film_style.css";

const FilmPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);

  const [film, setFilm] = useState(null);

  useEffect(() => {
    const storedFilms = getFilmsFromStorage();
    const found = storedFilms.find((f) => f.title === decodedTitle);
    setFilm(found);

    const preload = (src) => {
      const img = new window.Image();
      img.src = src;
    };
    preload("/img/star-icon.webp");
    preload("/img/star-outline.png");
  }, [decodedTitle]);

  const handleDelete = () => {
    const films = getFilmsFromStorage();
    const updated = films.filter((f) => f.title !== decodedTitle);
    saveFilmsToStorage(updated);

    if (favorites.includes(decodedTitle)) {
      toggleFavorite(decodedTitle);
    }

    navigate("/");
  };

  if (!film) {
    return (
      <Box p="8">
        <Text fontSize="xl">Фильм не найден</Text>
        <Button mt="4" onClick={() => navigate("/")}>
          На главную
        </Button>
      </Box>
    );
  }

  return (
    <Box className="film-main-page">
      <Box className="film-content">
        <Box className="film-top-nav">
          <Text className="film-nav-item" onClick={() => navigate("/")}>
            Все фильмы
          </Text>
          <Text
            className="film-nav-item"
            onClick={() => navigate("/favorites")}
          >
            Избранное
          </Text>
          <Text className="film-nav-item" onClick={() => navigate("/add")}>
            Добавить фильм
          </Text>
        </Box>

        <Flex
          className="film-content-row"
          gap="32px"
          mt="32px"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Image
            className="film-image"
            src={
              film.img.startsWith("data:image") ? film.img : `/img/${film.img}`
            }
            alt={film.title}
            borderRadius="16px"
            objectFit="cover"
            width="300px"
            height="300px"
          />

          <Box flex="1">
            <Flex justify="space-between" align="center" mb="4">
              <Text fontSize="3xl" fontWeight="bold">
                {film.title}
              </Text>
              <IconButton
                aria-label="Избранное"
                icon={<StarIcon />}
                variant="ghost"
                color={
                  favorites.includes(film.title) ? "yellow.400" : "gray.300"
                }
                onClick={() => toggleFavorite(film.title)}
                _hover={{ color: "yellow.400" }}
              />
            </Flex>

            <Flex gap="100px" align="flex-start">
              <Box
                px="3"
                py="1"
                borderRadius="24px"
                bg="#fcf2ec"
                fontWeight="500"
                fontSize="14px"
                color="orange.500"
              >
                {film.genre}
              </Box>

              <Flex align="center" gap="2">
                <Image
                  src="/img/clock-icon.jpg"
                  alt="clock"
                  width="18px"
                  height="18px"
                />
                <Text fontSize="14px" color="#333">
                  {film.duration} минут
                </Text>
              </Flex>
            </Flex>

            <Box mt="6">
              <Text fontSize="16px" lineHeight="26px" whiteSpace="pre-wrap">
                {film.description}
              </Text>
            </Box>

            <Flex className="film-actions" gap="4" mt="6">
              <Button
                onClick={handleDelete}
                variant="outline"
                colorScheme="red"
              >
                Удалить
              </Button>
              <Button
                onClick={() =>
                  navigate(`/edit/${encodeURIComponent(film.title)}`)
                }
                variant="outline"
                colorScheme="blue"
              >
                Редактировать
              </Button>
            </Flex>
          </Box>
        </Flex>

        <Box className="film-group-3">
          <Box className="film-text-wrapper-5">Фильмограф</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FilmPage;
