import React from 'react';
import {Box, Button, Typography} from "@mui/material";

export default function UserPanel() {
    return (
        <Box>
            <Box className="user-panel" >
                <Box className="user-info">
                    <Typography className="fullname">
                        💠 Anonymous
                    </Typography>
                    <Typography className="email">
                        anonymous@email.com
                    </Typography>

                </Box>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <Button className="logout-btn" title="Logout">Logout</Button>
                </Box>
            </Box>
        </Box>
    );
}