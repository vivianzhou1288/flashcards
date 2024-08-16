"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const SaveDialog = ({
  dialogOpen,
  handleCloseDialog,
  setName,
  setSetName,
  saveFlashcards,
}) => {
  return (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Save Flashcard Set</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for your flashcard set.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Set Name"
          type="text"
          fullWidth
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={saveFlashcards} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDialog;
