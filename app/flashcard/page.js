"use client";
import React, { useState, useEffect } from "react";
import FlashcardList from "../components/FlashcardList";
import {
  Grid,
  Container,
  Typography,
  Divider,
  Button,
  Box,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { AppAuth } from "../context/AppContext";
import { db } from "../../firebase.js";
import SaveDialog from "../components/Dialog";
import { useUser } from "@clerk/nextjs";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  writeBatch,
  query,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { raleway } from "../fonts";

const fontTheme = createTheme({
  typography: {
    fontFamily: raleway.style.fontFamily,
  },
});

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { flashcards, setFlashcards } = AppAuth();
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  console.log(flashcards);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const searchParams = useSearchParams();
  const setId = searchParams.get("id");
  console.log(setId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function getFlashcards() {
      try {
        if (setId) {
          const flashcardSetDocRef = doc(
            db,
            "users",
            user.id,
            "flashcardSets",
            setId
          );

          const flashcardSetDocSnap = await getDoc(flashcardSetDocRef);
          if (flashcardSetDocSnap.exists()) {
            const data = flashcardSetDocSnap.data();
            console.log("Document Data:", data);

            const flashcardsArray = data.flashcards || [];
            setFlashcards(flashcardsArray);
          } else {
            console.log("No such document!");
            setError("Flashcard set not found.");
          }
        } else {
          // Use generated flashcards if no setId is provided
          setFlashcards(flashcards);
        }
      } catch (err) {
        console.error("Error fetching flashcards:", err);
        setError("An error occurred while fetching flashcards.");
      } finally {
        setLoading(false);
      }
    }

    getFlashcards();
  }, [user, setId, flashcards, setFlashcards]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setSetName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={fontTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          backgroundColor: "#0A082B",
          margin: 0,
          alignItems: "center",
        }}
      >
        <NavBar />
        <FlashcardList flashcards={flashcards} />
        <Box sx={{ textAlign: "center" }}>
          {!setId ? (
            <Button variant="contained" onClick={handleOpenDialog}>
              Save Flashcards
            </Button>
          ) : null}
        </Box>
        <SaveDialog
          dialogOpen={dialogOpen}
          handleCloseDialog={handleCloseDialog}
          setName={setName}
          setSetName={setSetName}
          saveFlashcards={saveFlashcards}
        />
        <Container sx={{ mt: 4, paddingBottom: "50px", flexGrow: 1 }}>
          {flashcards.map((flashcard, index) => (
            <Grid
              container
              key={index}
              alignItems="center"
              direction="row"
              sx={{
                mb: 2,
                padding: 2,
                backgroundColor: "#303754",
                borderRadius: 2,
                color: "white",
              }}
            >
              <Grid item xs={5}>
                <Typography variant="h7" sx={{ color: "#fff" }}>
                  {flashcard.question}
                </Typography>
              </Grid>
              <Grid
                item
                xs={1}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Divider
                  flexItem
                  orientation="vertical"
                  sx={{ bgcolor: "#666", height: "100%" }}
                />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h7" sx={{ color: "#fff" }}>
                  {flashcard.answer}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
