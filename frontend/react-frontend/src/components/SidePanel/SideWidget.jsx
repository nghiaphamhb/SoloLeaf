import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SideFeatures from "./SideFeatures";
import SideUser from "./SideUser";
import {useNavigate} from "react-router-dom";
import {apiRequest} from "../../apis/request/apiRequest.js";

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
                const { data } = await apiRequest("/api/user/me", {
                    method: "GET"
                });

                // Your backend shape: { status, description, data, true }
                if (!cancelled) {
                    setUser(data ?? null);
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
