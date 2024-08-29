import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type MovieCardProps = {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
};

export const MoviesCard = ({ props }: { props: MovieCardProps }) => {
  const { Title, Poster } = props;
  console.log(Title);
  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>{Title}</Text>
      <Image source={{ uri: Poster }} style={styles.imageStyles} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyles: {
    width: 300,
    height: 300,
    margin: "auto",
    borderRadius: 10,
  },
  title: {
    textAlign: "center",
    padding: 5,
    margin: 10,
    fontSize: 16,
    fontWeight: "semibold",
  },
  outerContainer: {
    // borderWidth: 2,
    borderColor: "gray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
});
