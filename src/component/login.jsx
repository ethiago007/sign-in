import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Link } from "@mui/material";
import { signInWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Username or Email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const isEmail = (input) => /\S+@\S+\.\S+/.test(input); // Check if input is an email

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    let email = identifier; // Assume user entered an email
    let username = ""; // Placeholder for username

    if (!isEmail(identifier)) {
      // If input is not an email, treat it as a username and fetch email
      try {
        const usersRef = collection(db, "users"); // Firestore collection
        const q = query(usersRef, where("username", "==", identifier));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          email = querySnapshot.docs[0].data().email; // Get email associated with username
          username = identifier; // Keep the username
        } else {
          setError("Username not found.");
          return;
        }
      } catch (err) {
        setError("Error fetching user details.");
        return;
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setUnverified(true);
        setError("Please verify your email before logging in.");
        return;
      }

      // Get username from Firestore if login was via email
      if (!username) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          username = querySnapshot.docs[0].data().username;
        }
      }

      navigate("/dummy", { state: { username } }); // Pass username to dummy page
    } catch (err) {
      setError("Invalid email, username, or password. Please try again.");
    }
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setSuccessMessage("Verification email sent! Please check your inbox.");
      }
    } catch (err) {
      setError("Error sending verification email. Try again later.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      let username = user.displayName || "User"; // Use Google display name if available

      // Fetch username from Firestore if needed
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        username = querySnapshot.docs[0].data().username;
      }

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setSuccessMessage("A verification email has been sent to your Google account.");
      }

      navigate("/dummy", { state: { username } }); // Pass username to dummy page
    } catch (err) {
      setError("Google login failed. Try again later.");
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
      {error && <Alert severity={unverified ? "warning" : "error"} sx={{ mb: 2 }}>
        {error}
      </Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      
      <Box component="form" onSubmit={handleLogin} sx={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Username or Email"
          fullWidth
          required
          variant="outlined"
          margin="normal"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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

        {unverified && (
          <Button
            onClick={handleResendVerification}
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
          >
            Resend Verification Email
          </Button>
        )}
      </Box>

      <Typography sx={{ mt: 2 }}>
        <Link href="/forgot-password" underline="hover" sx={{ cursor: "pointer" }}>
          Forgot Password?
        </Link>
      </Typography>

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
