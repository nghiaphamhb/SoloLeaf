import React from "react";
import { Paper, InputBase, IconButton, Divider, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-bar">
      <Tooltip title="Search">
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
      </Tooltip>

      <InputBase
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search foods (burger, pizza, spicy...)"
        inputProps={{ "aria-label": "search foods" }}
      />

      <Tooltip title="Clear">
        <IconButton aria-label="clear" onClick={onClear}>
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
