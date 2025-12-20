import React, { useState } from 'react';
import { registerApi } from "../api/authApi.js";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

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

        if(password !== password2) {
            setError("Passwords don't match");
            return;
        }

        try {
            setLoading(true);
            const data = await registerApi({
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
        <div>
            <header>
                <h3>Register now to order and enjoy hot dishes!</h3>
            </header>

            <main className="wrap">
                <div>
                    <h1>Register form</h1>

                    <form id="form-signup" onSubmit={onSubmit}>
                        <label htmlFor="fullname">Full name</label>
                        <input
                            id="fullname"
                            type="text"
                            required
                            placeholder="Enter your full name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />

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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <label htmlFor="confirm">Password confirmation</label>
                        <input
                            id="confirm"
                            type="password"
                            required
                            minLength="6"
                            placeholder="Enter your password again"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                        />

                        {error && <p style={{ color: "crimson" }}>{error}</p>}

                        <button id="btn-signup" type="submit" disabled={loading}>
                            {loading ? "Trying to register..." : "Register"}
                        </button>

                    </form>
                </div>

            </main>

            <footer>
                <p>
                    Already have an account?
                    <Link to="/login">Login now</Link>
                </p>
            </footer>
        </div>
    );
}
