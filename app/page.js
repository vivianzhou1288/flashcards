"use client";
import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  ThemeProvider,
  createTheme,
  Typography,
  AppBar,
  Toolbar,
  Button,
  useMediaQuery,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { raleway } from "./fonts";
import LandingPageCarousel from "./components/LandingPageCarousel";
import Head from "next/head";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import getStripe from "@/utils/get-stripe";
import { useUser } from "@clerk/nextjs";
import LoadingPage from "./components/LoadingPage";

const fontTheme = createTheme({
  typography: {
    fontFamily: raleway.style.fontFamily,
  },
});

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const matches = useMediaQuery("(min-width: 1024px)");
  const handleSubmitStripe = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    });
    const checkoutSessionJson = await checkoutSession.json();
    console.log(checkoutSessionJson);

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const handleSubmit = () => {
    window.open(
      "https://forms.gle/UChgbjWTjGT5YHwP6",
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <ThemeProvider theme={fontTheme}>
      <Box sx={{ height: "100vh", backgroundColor: "#0A082B", color: "white" }}>
        <Head>
          <title>Wizlet</title>
          <meta name="description" content="Create flashcard from your text" />
        </Head>

        <AppBar
          position="static"
          sx={{
            backgroundColor: "#00004d",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "700" }}>
              W
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>
        <Box sx={{ textAlign: "center", pt: 10 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Welcome to Wizlet
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            The easiest way to make flashcards from your queries.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ my: 2 }}
            onClick={() => {
              setLoading(true);
              user ? router.push("/flashcardset") : router.push("/sign-up");
            }}
          >
            Get Started
          </Button>
          <Box sx={{ mx: matches ? 20 : 0 }}>
            <LandingPageCarousel />
          </Box>
        </Box>
        <Box
          sx={{
            // my: 6,
            textAlign: "center",
            backgroundColor: "#0A082B",
            // backgroundColor: "#00004d",
            pt: 10,
            pb: 7,
          }}
        >
          <Typography variant="h4">Pricing</Typography>
          <Grid container>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "white",
                  borderRadius: 5,
                  mt: 3,
                  mx: 3,
                }}
              >
                <Typography variant="h5">Free Tier</Typography>
                <Typography variant="h6">Free</Typography>
                <Typography sx={{ my: 2 }}>
                  Acccess to basic flashcard features and limited storage
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    user
                      ? router.push("/flashcardset")
                      : router.push("/sign-up");
                  }}
                >
                  Choose Free
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "white",
                  borderRadius: 5,
                  mt: 3,
                  mx: 3,
                }}
              >
                <Typography variant="h5">Basic Plan</Typography>
                <Typography variant="h6">$5 / month</Typography>
                <Typography sx={{ my: 2 }}>
                  Access to more flashcard features and limited storage
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Choose Basic
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "white",
                  borderRadius: 5,
                  mt: 3,
                  mx: 3,
                }}
              >
                <Typography variant="h5">Pro</Typography>
                <Typography variant="h6">$10 / month</Typography>
                <Typography sx={{ my: 2 }}>
                  Access to all flashcard features and unlimited storage
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            backgroundColor: "#0A082B",
            py: 10,
            px: 5,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Wizlet
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Wizlet hopes to help students with their studies by generating
            flashcards based on queries from students using AI.
          </Typography>
          <Typography>© 2024 Wizlet</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
