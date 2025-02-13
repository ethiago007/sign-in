import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { auth } from "../firebase";
import { signOut, updateProfile, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DummyPage = () => {
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [typingFinished, setTypingFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "Mysterious Player");
        setPhotoURL(user.photoURL || "");
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeUsername = () => {
    setAnchorEl(null);
    setOpenDialog(true);
  };

  const handleSaveUsername = async () => {
    try {
      if (auth.currentUser && newUsername.trim()) {
        await updateProfile(auth.currentUser, { displayName: newUsername });
        setUsername(newUsername);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const text = `Hiii, ${username || "Mysterious Player"}! 🌚 Congrats! You’ve successfully signed up for Squid Game! 🦑🏆`;
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#e0f7fa",
        padding: 4,
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Avatar at the top-right corner */}
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <Avatar
          src={photoURL}
          alt={username}
          sx={{ width: 50, height: 50, bgcolor: "#3f51b5", color: "white", cursor: "pointer" }}
          onClick={handleAvatarClick}
        >
          {!photoURL && (username ? username.charAt(0).toUpperCase() : "M")}
        </Avatar>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleChangeUsername}>Change Username</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Typing animation using motion.span */}
      <Typography variant="h4" component="div">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onAnimationComplete={() => index === text.length - 1 && setTypingFinished(true)}
          >
            {char}
          </motion.span>
        ))}
      </Typography>

      {/* Fade-in text after typing animation */}
      {typingFinished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Typography variant="body1" sx={{ display: "block", marginBottom: 2 }}>
            …Just kidding! 😂 (Or are we? 👀)
          </Typography>
          <Typography variant="body1" sx={{ display: "block", marginBottom: 2 }}>
            Welcome to this completely pointless page! 🙃 But hey, at least you made it this far.
          </Typography>
          <Typography variant="body1" sx={{ display: "block", marginBottom: 1 }}>
            Also, just a little reminder:
          </Typography>
          <Typography variant="body1" sx={{ display: "block" }}>
            ✨ You’re doing great, even if it doesn’t feel like it.
          </Typography>
          <Typography variant="body1" sx={{ display: "block" }}>
            ✨ If today’s been rough, you’ll pull through—I believe in you!
          </Typography>
          <Typography variant="body1" sx={{ display: "block", marginBottom: 3 }}>
            ✨ And let’s be honest, you’re looking amazing today. (No, seriously.)
          </Typography>
          <Typography variant="body1" sx={{ display: "block", marginBottom: 3 }}>
            Now make sure you have a nice day ❤️
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </motion.div>
      )}

      {/* Change Username Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Change Username</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Username"
            fullWidth
            variant="outlined"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUsername} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DummyPage;
