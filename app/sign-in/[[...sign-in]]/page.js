"use client";
import {
  AppBar,
  Container,
  Toolbar,
  Button,
  Typography,
  Box,
  Link,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { SignIn } from "@clerk/nextjs";
import { raleway } from "@/app/fonts";

const fontTheme = createTheme({
  typography: {
    fontFamily: raleway.style.fontFamily,
  },
});

export default function SignInPage() {
  return (
    <ThemeProvider theme={fontTheme}>
      <Box sx={{ backgroundColor: "#0A082B", height: "100vh" }}>
        <AppBar position="static" sx={{ backgroundColor: "#00004d" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              W
            </Typography>
            <Button color="inherit">
              <Link href="/sign-up" underline="none" sx={{ color: "white" }}>
                Sign Up
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ textAlign: "center", my: 4 }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign In to Your Account
          </Typography>
          <SignIn />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
