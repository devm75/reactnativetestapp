import { ChangeEvent, useState } from "react";
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

  const checkForError = (value: string): void => {
    if (value.length < 2) {
      setError("Please Enter a valid Password");
    } else {
      setError("");
    }
  };

  const handleChange = (value: string) => {
    checkForError(value);
    setSearchString(value);
  };

  const handleSubmit = async () => {
    if (!searchString || error) {
      return;
    }
    try {
      setLoading(true);
      let response = await fetch(`${BASE_URL}&s=${searchString}`);
      setLoading(false);
      const finalResponse = await response.json();
      setMovies(finalResponse?.Search);
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search Movies</Text>
      <TextInput
        style={styles.inputField}
        value={searchString}
        onChangeText={handleChange}
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
        keyExtractor={(item) => item.Title}
        renderItem={({ item }) => <MoviesCard props={{ ...item }} />}
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
