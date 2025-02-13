import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Link } from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [input, setInput] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getEmailFromUsername = async (username) => {
    try {
      // Fetch sign-in methods to check if input is an email
      const signInMethods = await fetchSignInMethodsForEmail(auth, username);
      if (signInMethods.length > 0) {
        return username; // It's already an email
      }
    } catch {
      // Not an email, so we search for the username in Firebase
    }

    try {
      const usersRef = auth.currentUser;
      const userList = usersRef
        ? [{ email: usersRef.email, username: usersRef.displayName }]
        : [];

      const foundUser = userList.find((user) => user.username === username);
      return foundUser ? foundUser.email : null;
    } catch (err) {
      console.error("Error fetching users:", err);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let email = input;
      if (!input.includes("@")) {
        email = await getEmailFromUsername(input);
        if (!email) {
          setError("Username not found. Please check your input.");
          return;
        }
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dummy");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
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
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleLogin} sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Email or Username"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
          Login
        </Button>
        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login with Google
        </Button>
      </Box>

      <Typography sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link href="/signup" underline="hover" sx={{ cursor: "pointer" }}>
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
