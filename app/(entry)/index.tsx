import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Image,
  Text,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Button,
} from "react-native";
import { MoviesCard } from "./moviesCard";

const BASE_URL = "https://www.omdbapi.com/?i=tt3896198&apikey=f293fea2";

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
  Type: "movie";
};

export default function HomePage() {
  const [searchString, setSearchString] = useState("");
  const [error, setError] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const checkForError = (value: string): void => {
    if (value.length < 2) {
      setError("Please Enter a valid Input");
    } else {
      setError("");
    }
  };

  const handleChange = (value: string) => {
    checkForError(value);
    setSearchString(value);
  };

  const fetchMovies = async (page: number, searchString: string) => {
    try {
      setLoading(true);
      let response = await fetch(`${BASE_URL}&s=${searchString}&page=${page}`);
      setLoading(false);
      const finalResponse = await response.json();

      if (finalResponse?.Response === "True") {
        let finalMovies = [...movies, ...finalResponse?.Search];
        const field = "imdbID";
        finalMovies = Array.from(
          new Set(finalMovies.map((ele) => ele[field]))
        ).map((value) => finalMovies.find((ele) => ele[field] == value));
        setMovies(finalMovies);
        setTotalResults(Number(finalResponse?.totalResults));
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleSubmit = async () => {
    if (!searchString || error) {
      return;
    }
    fetchMovies(page, searchString);
  };

  useEffect(() => {
    if (page > 1 && page * 10 <= totalResults) {
      fetchMovies(page, searchString);
    }
  }, [page]);

  console.log(page, "page");
  console.log(movies, "movies");
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search Movies</Text>
      <TextInput
        style={styles.inputField}
        value={searchString}
        onChangeText={handleChange}
        onKeyPress={(keyBoardEvent) => {
          if (keyBoardEvent.key === "Enter") {
            keyBoardEvent.preventDefault();
            handleSubmit();
          }
        }}
      />
      <View style={styles.btnContainer}>
        <Button
          onPress={handleSubmit}
          title={loading ? "Loading" : "Submit"}
        ></Button>
      </View>
      {error.length > 0 && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={movies}
        keyExtractor={(item, index) => item.Poster}
        renderItem={({ item }) => <MoviesCard props={{ ...item }} />}
        onEndReached={() => {
          setPage((prev) => prev + 1);
        }}
        onEndReachedThreshold={0.1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  label: {
    padding: 16,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputField: {
    padding: 5,
    margin: 10,
    borderBlockColor: "black",
    borderWidth: 1,
  },
  error: {
    color: "red",
    padding: 12,
    margin: 10,
  },

  submitButton: {
    padding: 5,
    margin: 5,
    width: 160,
    backgroundColor: "grey",
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
  btnContainer: {
    margin: 12,
  },
});
