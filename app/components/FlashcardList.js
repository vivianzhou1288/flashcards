"use client";
import { useState } from "react";
import {
  Container,
  Box,
  IconButton,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import Flashcard from "./Flashcard";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { raleway } from "../fonts";

const fontTheme = createTheme({
  typography: {
    fontFamily: raleway.style.fontFamily,
  },
});

const FlashcardList = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <ThemeProvider theme={fontTheme}>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 4,
        }}
      >
        <Flashcard
          question={flashcards[currentIndex].question}
          answer={flashcards[currentIndex].answer}
          flipped={flipped}
          onFlip={handleFlip}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            width: "100%",
          }}
        >
          <IconButton onClick={handlePrevious} sx={{ color: "white" }}>
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton onClick={handleNext} sx={{ color: "white" }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default FlashcardList;
