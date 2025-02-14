import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, Link } from "@mui/material";
import { signInWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Preloader from "./loader";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmail = (input) => /\S+@\S+\.\S+/.test(input);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    let email = identifier;
    let username = "";

    if (!isEmail(identifier)) {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", identifier));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          email = querySnapshot.docs[0].data().email;
          username = identifier;
        } else {
          setError("Username not found.");
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Error fetching user details.");
        setLoading(false);
        return;
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setUnverified(true);
        setError("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      if (!username) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          username = querySnapshot.docs[0].data().username;
        }
      }

      setLoading(false);
      navigate("/dummy", { state: { username } });
    } catch (err) {
      setError("Invalid email, username, or password. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      let username = user.displayName || "User";

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

      setLoading(false);
      navigate("/dummy", { state: { username } });
    } catch (err) {
      setError("Google login failed. Try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Preloader />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingLeft: 2,
          paddingRight: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: "white" }}>
          Login
        </Typography>
        {error && <Alert severity={unverified ? "warning" : "error"} sx={{ mb: 2 }}>{error}</Alert>}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#86B6F6" },
                "&:hover fieldset": { borderColor: "#86B6F6" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#86B6F6" }
            }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#86B6F6" },
                "&:hover fieldset": { borderColor: "#86B6F6" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#86B6F6" }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#0064E6",
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "#0064E6",
                border: "1px solid #0064E6",
              },
            }}
          >
            Login
          </Button>

          <Button
            onClick={handleGoogleLogin}
            variant="outlined"
            fullWidth
            sx={{
              mt: 2,
              color: "#0064E6",
              border: "2px solid #0064E6",
              "&:hover": {
                backgroundColor: "#0064E6",
                color: "white",
                border: "2px solid #0064E6",
              },
            }}
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

        <Typography sx={{ mt: 2, color: "white" }}>
          Don't have an account?{" "}
          <Link href="/signup" underline="hover" sx={{ cursor: "pointer" }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default Login;
