import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from "@mui/material";
import { auth } from "../firebase";
import { signOut, updateProfile, onAuthStateChanged, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DummyPage = () => {
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUsernameDialog, setOpenUsernameDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [typingFinished, setTypingFinished] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setOpenUsernameDialog(true);
  };

  const handleSaveUsername = async () => {
    try {
      if (auth.currentUser && newUsername.trim()) {
        await updateProfile(auth.currentUser, { displayName: newUsername });
        setUsername(newUsername);
        setSuccess("Username updated successfully!");
      }
      setOpenUsernameDialog(false);
    } catch (error) {
      setError("Error updating username.");
    }
  };

  const handleChangePassword = () => {
    setAnchorEl(null);
    setOpenPasswordDialog(true);
  };

  const handleSavePassword = async () => {
    try {
      if (auth.currentUser && newPassword.trim().length >= 6) {
        await updatePassword(auth.currentUser, newPassword);
        setSuccess("Password updated successfully!");
      } else {
        setError("Password must be at least 6 characters long.");
      }
      setOpenPasswordDialog(false);
    } catch (error) {
      setError("Error updating password. Please try again.");
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
          <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Error & Success Messages */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

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
          <Typography variant="body1" sx={{ display: "block", marginBottom: 3 }}>
            Now make sure you have a nice day ❤️
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </motion.div>
      )}

      {/* Change Username Dialog */}
      <Dialog open={openUsernameDialog} onClose={() => setOpenUsernameDialog(false)}>
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
          <Button onClick={() => setOpenUsernameDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUsername} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePassword} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DummyPage;
