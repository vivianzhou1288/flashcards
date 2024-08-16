"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";

const Flashcard = ({ question, answer, flipped, onFlip }) => {
  return (
    <Box
      onClick={onFlip}
      sx={{
        width: "100%",
        height: 350,
        perspective: 1000,
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.6s",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
        }}
      >
        {/* Front Side */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            backgroundColor: "#303754",
            color: "white",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant="h5">{question}</Typography>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundColor: "#303754",
            color: "white",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant="h5">{answer}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Flashcard;
