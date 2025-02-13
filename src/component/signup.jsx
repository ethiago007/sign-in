import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, Link } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      navigate("/dummy"); // Redirect to dummy page
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      let googleUsername = userCredential.user.displayName || ""; // Get Google account name if available

      // Prompt user to confirm or enter a new username
      let userEnteredUsername = prompt(
        `Your Google name is "${googleUsername}". Enter a username you want to use:`,
        googleUsername
      );

      if (userEnteredUsername && userEnteredUsername !== googleUsername) {
        await updateProfile(userCredential.user, { displayName: userEnteredUsername });
      }

      navigate("/dummy");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        padding: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSignUp} sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Username"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>
        <Button
          onClick={handleGoogleSignUp}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up with Google
        </Button>
      </Box>

      {/* New "Already have an account? Login" link */}
      <Typography sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link href="/login" underline="hover" sx={{ cursor: "pointer" }}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUp;
