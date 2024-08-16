"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { AppAuth } from "../context/AppContext";
import { useRouter } from "next/navigation";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { db } from "../../firebase.js";
import { raleway } from "../fonts";
import LoadingPage from "../components/LoadingPage";
import { CircularProgress } from "@mui/material";

const fontTheme = createTheme({
  typography: {
    fontFamily: raleway.style.fontFamily,
  },
});

const FlashcardSet = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  console.log(user);
  const [loading, setLoading] = useState(false);
  const { flashcards, setFlashcards } = AppAuth();
  const router = useRouter();
  const [flashcardSets, setFlashcardSets] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function getFlashcardSets() {
      setLoading(true);
      const userDocRef = collection(db, "users", user.id, "flashcardSets"); // Reference to flashcard sets collections
      const querySnapshot = await getDocs(userDocRef);

      const sets = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Set ID (name of the collection in Firebase)
        ...doc.data(), // Spread the data, including flashcards
      }));
      console.log(sets);
      setFlashcardSets(sets);
      setLoading(false);
    }

    getFlashcardSets();
  }, [user]);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  if (!isLoaded) {
    return <LoadingPage />;
  }

  return (
    <ThemeProvider theme={fontTheme}>
      <Box sx={{ backgroundColor: "#0A082B", height: "100vh" }}>
        <NavBar />
        <Box sx={{ paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 600 }}>
              My Flashcard Set
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                router.push("/generate");
              }}
            >
              Create a new set
            </Button>
          </Box>
          {!loading ? (
            <Grid container spacing={3}>
              {flashcardSets.map((set, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      backgroundColor: "#303754",
                      borderRadius: "15px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCardClick(set.id)}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: "#fff" }}>
                        {set.name || set.id}{" "}
                        {/* Display set name or fallback to the collection ID */}
                      </Typography>
                      {set.flashcards && (
                        <Chip
                          label={`${set.flashcards.length} terms`}
                          sx={{
                            marginTop: "10px",
                            backgroundColor: "#5962D9",
                            color: "#fff",
                            fontSize: "14px",
                            borderRadius: "10px",
                          }}
                        />
                      )}
                      {set.description && (
                        <Chip
                          label={`${set.terms} terms`}
                          sx={{
                            marginTop: "10px",
                            backgroundColor: "#5962D9",
                            color: "#fff",
                            fontSize: "14px",
                            borderRadius: "10px",
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "15px",
                        }}
                      >
                        <Avatar
                          sx={{ width: 24, height: 24 }}
                          src={user.imageUrl}
                        />
                        <Typography sx={{ color: "white", marginLeft: "10px" }}>
                          {user.fullName || user.email}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default FlashcardSet;
