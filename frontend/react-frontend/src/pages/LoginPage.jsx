import React, { useState } from 'react';
import { loginApi } from "../apis/authApi.js";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import {Box, Container, TextField, Typography, Alert , Button} from "@mui/material";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            const data = await loginApi({email, password});

            const token = data?.data; /* token saved in res.?data */
            if (!token) {
                throw new Error("No token returned from server");
            }
            localStorage.setItem("token", token);

            navigate("/home");
        } catch (err) {
            if (err?.status === 404) setError("Account does not exist");
            else setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {/* header */}
            <Box component="header" className="auth-header">
                <Typography className="auth-title">
                    Log in now to order and enjoy hot dishes!
                </Typography>
            </Box>
            <Container className="auth-wrap">
                <Box className="auth-card">
                    <Typography variant="h4" className="auth-form-title">Login form</Typography>
                    <Box component="form" onSubmit={onSubmit} className="auth-form">
                        <TextField
                            className="auth-field"
                            label="Email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            className="auth-field"
                            label="Password"
                            type="password"
                            required
                            minLength="6"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error &&
                            <Alert severity="error">
                                {error}
                            </Alert>}

                        <Button
                            className="auth-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Trying to login..." : "Login"}
                        </Button>
                    </Box>
                </Box>
            </Container>
            <Box className="auth-footer">
                No account yet?
                <Link to="/register"> Register now </Link>
            </Box>
            <Box className="auth-footer"><Link to="/">Go back</Link></Box>
        </Box>
    );
}
