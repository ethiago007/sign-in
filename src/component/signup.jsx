import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Link } from "@mui/material";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name for authentication
      await updateProfile(user, { displayName: username });

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
      });

      // Send verification email
      await sendEmailVerification(user);
      setMessage("Verification email sent! Please check your inbox.");

      // Redirect to login page after signup
      setTimeout(() => {
        navigate("/login");
      }, 5000); // Redirect after 5 seconds

    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Store user in Firestore if it's their first time signing up
      if (userCredential.additionalUserInfo.isNewUser) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          email: user.email,
        });
      }

      // Send email verification if needed
      if (!user.emailVerified) {
        await sendEmailVerification(user);
      }

      navigate("/dummy"); // Redirect after successful signup
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
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      
      <Box component="form" onSubmit={handleSignup} sx={{ width: "100%", maxWidth: 400 }}>
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
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Sign Up
        </Button>

        <Button
          onClick={handleGoogleSignup}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up with Google
        </Button>
      </Box>

      <Typography sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link href="/login" underline="hover" sx={{ cursor: "pointer" }}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default Signup;
