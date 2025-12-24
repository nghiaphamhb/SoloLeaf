import React, { useState } from "react";
import { registerApi } from "../../apis/authApi.js";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      await registerApi({
        fullname,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError("Register failed");
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box component="header" className="auth-header">
        <Typography variant="h4" className="auth-title">
          Register now to order and enjoy hot dishes!
        </Typography>
      </Box>

      <Container className="auth-wrap">
        <Box className="auth-card">
          <Typography variant="h4" className="auth-form-title">
            Register form
          </Typography>

          <Box component="form" className="auth-form" onSubmit={onSubmit}>
            <TextField
              className="auth-field"
              type="text"
              required
              placeholder="Enter your full name"
              label="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />

            <TextField
              className="auth-field"
              type="email"
              required
              placeholder="Enter your email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              className="auth-field"
              type="password"
              required
              placeholder="Enter your password"
              minLength="6"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              className="auth-field"
              type="password"
              required
              placeholder="Confirm your password"
              minLength="6"
              label="Confirm password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Trying to register..." : "Register"}
            </Button>
          </Box>
        </Box>
      </Container>

      <Box className="auth-footer">
        Already have an account?
        <Link to="/login">Login now</Link>
      </Box>
      <Box className="auth-footer">
        <Link to="/">Go back</Link>
      </Box>
    </Box>
  );
}
