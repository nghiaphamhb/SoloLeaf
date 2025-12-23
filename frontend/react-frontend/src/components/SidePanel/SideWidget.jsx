import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SideFeatures from "./SideFeatures";
import SideUser from "./SideUser";
import {useNavigate} from "react-router-dom";

export default function SideWidget() {
    const [ user, setUser] = useState(null);

    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        let cancelled = false;

        async function loadMe() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/user/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });

                // If unauthorized -> clear token (optional) and stop
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    return;
                }

                const json = await res.json();

                // Your backend shape: { status, description, data, true }
                if (!cancelled) {
                    setUser(json?.data ?? null);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) setUser(null);
            }
        }

        void (async () => {
            await loadMe();
        })();
        return () => {
            cancelled = true;
        };
    }, []);


    return (
        <Box className="sidebar">
            <SideFeatures />
            <Box>
                <SideUser user={user} onLogout={onLogout} />
            </Box>
        </Box>
    );
}
