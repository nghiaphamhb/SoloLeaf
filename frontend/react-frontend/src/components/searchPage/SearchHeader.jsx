import React from "react";
import { Typography } from "@mui/material";
import SearchBar from "./SearchBar.jsx";

export default function SearchHeader({ q, setQ }) {
  return (
    <div>
      <Typography variant="h5" className="search-header__title">
        Search
      </Typography>
      <div style={{ marginTop: 10 }}>
        <SearchBar value={q} onChange={setQ} onClear={() => setQ("")} />
      </div>
    </div>
  );
}
