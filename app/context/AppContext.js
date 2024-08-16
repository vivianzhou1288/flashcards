"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [currentUser, setCurrentUser] = useState(user);

  const [flashcards, setFlashcards] = useState(() => {
    // Check if we are in the browser environment
    if (typeof window !== "undefined") {
      const storedFlashcards = localStorage.getItem("flashcards");
      return storedFlashcards ? JSON.parse(storedFlashcards) : {};
    }
    return {}; // Default initial value if server-side
  });

  useEffect(() => {
    // Only run this effect if we are in the browser
    if (typeof window !== "undefined") {
      localStorage.setItem("flashcards", JSON.stringify(flashcards));
    }
  }, [flashcards]);

  return (
    <AppContext.Provider
      value={{
        flashcards,
        setFlashcards,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppAuth = () => useContext(AppContext);
