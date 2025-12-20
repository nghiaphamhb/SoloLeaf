import React, { useState } from 'react';
import { loginApi } from "../api/authApi.js";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

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

            if(data?.token) {
                localStorage.setItem("token", data.token);
            }

            navigate("/home");
        } catch (err) {
            setError("Login failed");
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <header>
                <h3>Log in now to order and enjoy hot dishes!</h3>
            </header>
            <main className="wrap">
                <div>
                    <h1>Login form</h1>
                    <form id="form-signin" onSubmit={onSubmit}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength="6"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && <p style={{ color: "crimson"}}>{error}</p>}

                        <button id="btn-signin" type="submit" disabled={loading}>
                            {loading ? "Trying to login..." : "Login"}
                        </button>
                    </form>
                </div>
            </main>
            <footer>
                <p>
                    No account yet? <Link to="/register">Register now</Link>
                </p>
            </footer>
        </div>
    );
}
