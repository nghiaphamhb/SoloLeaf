import React, { useRef } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "../../styles/profile.css";

export default function AvatarBox({ userInfo, onUploaded }) {
  const fileInputRef = useRef(null);

  const onClickUpload = () => {
    fileInputRef.current?.click(); // click on DOM element, which it ref to
  };

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const form = new FormData();
      form.append("file", file); // <-- backend expects @RequestParam MultipartFile file

      const token = localStorage.getItem("token");
      const res = await fetch("/api/file", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form, // browser will set multipart/form-data boundary automatically
      });

      // backend: ResponseData { success: true, data: "<url>" }
      const data = await res.json(); // ResponseData
      const url = data?.data || null;

      if (url && onUploaded) onUploaded(url);
    } finally {
      // reset input so re-upload same file still triggers change
      e.target.value = "";
    }
  };

  return (
    <div className="profile-card profile-card--avatar">
      <Avatar className="profile-avatar" src={userInfo?.imageUrl || ""} />

      <Typography className="profile-name">{userInfo?.fullname}</Typography>
      <Typography className="profile-email">{userInfo?.email}</Typography>

      <div className="profile-actions">
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onPickFile} />

        <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={onClickUpload}>
          Upload
        </Button>
      </div>
    </div>
  );
}
