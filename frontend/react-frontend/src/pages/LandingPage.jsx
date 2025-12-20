import React from 'react';
import leaf from '/leaf.png';
import "../styles/landingPage.css";
import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div>
            <header>
                <h1>Welcome to the SoloLeaf app</h1>
                <p>Order and enjoy great hot food from every restaurant you want!</p>
            </header>

            <main>
                <img
                    src={leaf}
                    alt="SoloLeaf logo"
                    style={{maxWidth: '40%', height: "auto"}}
                />

                <section className="buttons">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </section>

                <footer>
                    <p>© 2025 SoloLeaf application - the fastest food delivery service of all time</p>
                </footer>
            </main>
        </div>
    );
}