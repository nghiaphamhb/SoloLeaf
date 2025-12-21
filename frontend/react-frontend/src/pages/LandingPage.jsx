import React from 'react';
import leaf from '/leaf.png';
import "../styles/landingPage.css";
import { Link } from "react-router-dom";
import {Box, Button, Container, Stack, Typography} from "@mui/material";

export default function LandingPage() {
    return (
        // <div>
        //     <header>
        //         <h1>Welcome to the SoloLeaf app</h1>
        //         <p>Order and enjoy great hot food from every restaurant you want!</p>
        //     </header>
        //
        //     <main>
        //         <img
        //             src={leaf}
        //             alt="SoloLeaf logo"
        //             style={{maxWidth: '40%', height: "auto"}}
        //         />
        //
        //         <section className="buttons">
        //             <Link to="/login">Login</Link>
        //             <Link to="/register">Register</Link>
        //         </section>
        //
        //         <footer>
        //             <p>© 2025 SoloLeaf application - the fastest food delivery service of all time</p>
        //         </footer>
        //     </main>
        // </div>
        <Box>
            {/* header */}
            <Box className="landing-header">
                <Typography variant="h1">
                    Welcome to the SoloLeaf app
                </Typography>
                <Typography>
                    Order and enjoy great hot food from every restaurant you want!
                </Typography>
            </Box>

            <Container className="landing-main">
                <Box
                    component="img"
                    src={leaf}
                    alt="SoloLeaf logo"
                    sx={{
                        width: "100%",
                        maxWidth: 360,
                        mb: 4,
                        borderRadius: 2,
                    }}
                />

                <Stack className="buttons" direction="row">
                    <Button
                        component={Link}
                        to="/login"
                        className="landing-btn"
                    >
                        Login
                    </Button>

                    <Button
                        component={Link}
                        to="/register"
                        className="landing-btn"
                    >
                        Register
                    </Button>
                </Stack>

                {/* footer */}
                <Typography className="landing-footer">
                    © 2025 SoloLeaf application - the fastest food delivery service of all time
                </Typography>
            </Container>
        </Box>
    );
}