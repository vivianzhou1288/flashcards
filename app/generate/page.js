"use client";
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  createTheme,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { AppAuth } from "../context/AppContext";
import { useUser } from "@clerk/nextjs";
import { raleway } from "../fonts";
import LoadingPage from "../components/LoadingPage";

const fontTheme = createTheme({
  typography: {
    fontFamily: raleway.style.fontFamily,
  },
});

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const { setFlashcards } = AppAuth();
  const [text, setText] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      console.log(data);
      if (Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
        setLoading(false);
        router.push("/flashcard");
      } else {
        setLoading(false);
        throw new Error("Unexpected format for flashcards");
      }
      // router.push("/flashcard");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  const handleClose = () => {
    router.push("/flashcardset");
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <ThemeProvider theme={fontTheme}>
      <Container
        maxWidth="xl"
        sx={{
          height: "100vh",
          backgroundColor: "#0A082B",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          position: "relative",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: "white",
          }}
        >
          <Close />
        </IconButton>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: "#303754",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                "& input": {
                  color: "white",
                },
                "& textarea": {
                  color: "white",
                },
              },
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "white",
              },
            }}
            InputProps={{
              style: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Generate Flashcards
          </Button>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
