import { useEffect, useRef, useState } from "react";
import { Button, TextField } from "@mui/material";
import "../../styles/profile.css";
import { apiRequest } from "../../apis/request/apiRequest.js";
import Bugsnag from "../../bugsnag/bugsnag.js";

export default function EditBox({ userInfo }) {
  const [userEdit, setUserEdit] = useState({
    fullname: "",
    email: "",
    roleName: "",
  });

  const [notice, setNotice] = useState({ type: "", text: "" });
  const noticeTimerRef = useRef(null); // timeout

  useEffect(() => {
    // eslint-disable-next-line
    setUserEdit({
      fullname: userInfo?.fullname || "",
      email: userInfo?.email || "",
      roleName: userInfo?.roleName || "",
    });
  }, [userInfo]);

  const showNotice = (type, text) => {
    // no auto-hide
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice({ type, text });
  };

  // only if fail update
  const showNoticeAutoHide = (type, text, ms = 3000) => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice({ type, text });
    noticeTimerRef.current = setTimeout(() => {
      setNotice({ type: "", text: "" });
    }, ms);
  };

  const onChangeField = (key) => (e) => {
    const v = e.target.value;
    setUserEdit((prev) => ({
      ...prev,
      [key]: v,
    }));
  };

  const onSubmit = async () => {
    // clear old notice
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice({ type: "", text: "" }); // clear old notice

    const payload = { fullname: userEdit.fullname };

    try {
      const res = await apiRequest("/api/user/edit", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const success = res?.success ?? null;

      if (success) {
        showNotice("success", "Update successful. Please reload the page.");
      } else {
        showNoticeAutoHide("error", "Update failed. Please try again.", 3000);
      }
    } catch (e) {
      Bugsnag.notify("update profile failed:", e);
      showNoticeAutoHide("error", "Update failed. Please try again.", 3000);
    }
  };

  return (
    <div className="profile-card profile-card--edit">
      <div className="profile-form">
        <TextField
          className="profile-field"
          label="Full Name"
          value={userEdit.fullname}
          onChange={onChangeField("fullname")}
          fullWidth
        />

        <TextField className="profile-field" label="Email" value={userEdit.email} fullWidth />

        <TextField className="profile-field" label="Role" value={userEdit.roleName} fullWidth />

        <Button className="profile-save" variant="contained" onClick={onSubmit}>
          Save Changes
        </Button>

        {notice.text && (
          <div className={`profile-notice profile-notice--${notice.type}`}>{notice.text}</div>
        )}
      </div>
    </div>
  );
}
