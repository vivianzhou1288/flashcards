"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Tooltip,
  createTheme,
  ThemeProvider,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { raleway } from "../fonts";
import { useClerk } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";

const fontTheme = createTheme({
  typography: {
    fontFamily: raleway.style.fontFamily,
  },
});

const NavBar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
  };

  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={fontTheme}>
      <AppBar
        position="static"
        sx={{ bgcolor: "#0A082B", pt: 1 }}
        elevation={0}
      >
        <Toolbar>
          <Button onClick={() => router.push("/")}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "white" }}>
              W
            </Typography>
          </Button>
          <Box sx={{ flexGrow: 1 }} />

          {/* Add Icon */}
          <Box>
            <Tooltip title="Create flashcard set">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="add"
                sx={{
                  mr: 2,
                  bgcolor: "#3D56F0",
                  color: "#fff",
                  borderRadius: 2,
                }}
                onClick={() => {
                  router.push("/generate");
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Profile Picture" src={user.imageUrl} />
            </IconButton>
            <Menu
              sx={{
                mt: "45px",
                "& .MuiPaper-root": {
                  backgroundColor: "#303754",
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                <Typography
                  textAlign="center"
                  sx={{ color: "white" }}
                  onClick={() => {
                    router.push("/flashcardset");
                  }}
                >
                  My Flashcard Sets
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center" sx={{ color: "white" }}>
                  Log Out
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default NavBar;
