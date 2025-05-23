import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  Image,
  Text,
  Badge,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoriteContext";
import { getFilmsFromStorage, initFilmsIfEmpty } from "../utils/localFilms";
import { StarIcon } from "@chakra-ui/icons";

const genres = ["Боевик", "Триллер", "Комедия", "Драма"];

const MainPage = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(() =>
    Object.fromEntries(genres.map((g) => [g, true]))
  );
  const [films, setFilms] = useState([]);

  const toggleGenre = (genre) => {
    setFilters((prev) => ({ ...prev, [genre]: !prev[genre] }));
  };

  useEffect(() => {
    initFilmsIfEmpty();
    const stored = getFilmsFromStorage();
    setFilms(stored);
  }, []);

  return (
    <Box p={6} fontFamily="Montserrat, sans-serif" bg="white" minHeight="100vh">
      <Box maxW="960px" mx="auto">
        {/* Навигация */}
        <Flex gap={6} mb={6}>
          <Text
            fontWeight="bold"
            color="blue.600"
            cursor="pointer"
            onClick={() => navigate("/")}
          >
            Все фильмы
          </Text>
          <Text cursor="pointer" onClick={() => navigate("/favorites")}>
            Избранное
          </Text>
          <Text cursor="pointer" onClick={() => navigate("/add")}>
            Добавить фильм
          </Text>
        </Flex>

        {/* Заголовок и фильтры */}
        <Flex justify="space-between" align="center" wrap="wrap" mb={6}>
          <Text fontSize="3xl" fontWeight="bold">
            Фильмы
          </Text>
          <HStack spacing={4} wrap="wrap">
            {genres.map((genre) => (
              <HStack
                key={genre}
                cursor="pointer"
                onClick={() => toggleGenre(genre)}
              >
                <Box
                  boxSize={5}
                  border="2px solid"
                  borderColor="gray.400"
                  borderRadius="full"
                  bg={filters[genre] ? "blue.500" : "transparent"}
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {filters[genre] && <Text fontSize="xs">✓</Text>}
                </Box>
                <Text>{genre}</Text>
              </HStack>
            ))}
          </HStack>
        </Flex>

        {/* Сетка фильмов */}
        <Grid templateColumns="repeat(auto-fit, minmax(240px, 1fr))" gap={6}>
          {films
            .filter((film) => filters[film.genre])
            .map((film) => (
              <Box
                key={film.title}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                overflow="hidden"
                bg="white"
              >
                <Image
                  src={
                    film.img.startsWith("data:image")
                      ? film.img
                      : `/img/${film.img}`
                  }
                  alt={film.title}
                  objectFit="cover"
                  height="200px"
                  width="100%"
                  onClick={() =>
                    navigate(`/film/${encodeURIComponent(film.title)}`)
                  }
                  cursor="pointer"
                />
                <Box px={3} py={2}>
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    mb={2}
                    cursor="pointer"
                    onClick={() =>
                      navigate(`/film/${encodeURIComponent(film.title)}`)
                    }
                  >
                    {film.title}
                  </Text>

                  <Flex justify="space-between" align="center">
                    <Badge
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      bg={
                        film.genre === "Боевик"
                          ? "#e991621f"
                          : film.genre === "Триллер"
                          ? "#49b64e1f"
                          : film.genre === "Комедия"
                          ? "#8775d21f"
                          : "#958f8f1f"
                      }
                      color={
                        film.genre === "Боевик"
                          ? "#e2622c"
                          : film.genre === "Триллер"
                          ? "#49b64e"
                          : film.genre === "Комедия"
                          ? "#8775d2"
                          : "#958f8f"
                      }
                    >
                      {film.genre}
                    </Badge>

                    <HStack spacing={2}>
                      <Image src="/img/clock-icon.jpg" boxSize="18px" />
                      <Text fontSize="sm">{film.duration} мин.</Text>
                    </HStack>

                    <IconButton
                      aria-label="Избранное"
                      icon={<StarIcon />}
                      variant="ghost"
                      color={
                        favorites.includes(film.title)
                          ? "yellow.400"
                          : "gray.300"
                      }
                      onClick={() => toggleFavorite(film.title)}
                      _hover={{ color: "yellow.400" }}
                    />
                  </Flex>
                </Box>
              </Box>
            ))}
        </Grid>

        {/* Нижняя панель */}
        <Box mt={10} bg="black" py={4}>
          <Text color="white" pl={6} fontWeight="medium">
            Фильмограф
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;
