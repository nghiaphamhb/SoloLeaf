import { Container } from "@mui/material";
import "../../styles/profile.css";
import AvatarBox from "./AvatarBox.jsx";
import EditBox from "./EditBox.jsx";
import {useEffect, useState} from "react";
import {apiRequest} from "../../apis/request/apiRequest.js";

export default function ProfilePageContent() {
    const [userInfo, setUserInfo] = useState({
        imageUrl: "",
        fullname: "No personal profile",
        email: "@gmail.com",
        roleName: "No role"
    });

    useEffect( () => {
        async function fetchProfile() {
            const res = await apiRequest("/api/user/me", {
                method: "GET",
            })
            const data = res?.data;
            setUserInfo({
                imageUrl: data.imageUrl,
                fullname: data.fullname,
                email: data.email,
                roleName: data.roleName,
            });
        };

        fetchProfile();
    }, []);

    // immediately see the change
    const handleUploaded = (url) => {
        setUserInfo((prev) => ({ ...prev, imageUrl: url }));
    };

    return (
        <div className="profile-page">
            <Container maxWidth="lg">
                <div className="profile-grid">
                    <AvatarBox userInfo={userInfo} onUploaded={handleUploaded}/>
                    <EditBox userInfo={userInfo} setUserInfo={setUserInfo} />
                </div>
            </Container>
        </div>
    );
}
