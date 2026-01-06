import React from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import SearchBar from "./SearchBar.jsx";

export default function SearchHeader({
  q,
  setQ,
  suggestion, // string | null
  error, // string | undefined
  onApplySuggestion, // optional callback
}) {
  const showSuggestion =
    Boolean(suggestion) &&
    typeof suggestion === "string" &&
    suggestion.trim().length > 0 &&
    suggestion !== q;

  return (
    <Box>
      <Typography variant="h5" className="search-header__title">
        Search
      </Typography>

      <Box sx={{ mt: 1.25 }}>
        <SearchBar value={q} onChange={setQ} onClear={() => setQ("")} />
      </Box>

      {/* API error */}
      {error ? (
        <Box className="search-header__hint">
          <Typography variant="body2" className="search-header__hintText">
            {error}
          </Typography>
        </Box>
      ) : null}

      {/* Did you mean */}
      {showSuggestion ? (
        <Box className="search-header__hint search-header__didyoumean">
          <Typography variant="body2" className="search-header__didyoumeanText">
            Did you mean
          </Typography>

          <Chip
            size="small"
            label={suggestion}
            className="search-header__didyoumeanChip"
            onClick={() => {
              setQ(suggestion);
              onApplySuggestion?.(suggestion);
            }}
          />

          <Button
            size="small"
            variant="text"
            className="search-header__didyoumeanBtn"
            onClick={() => setQ(suggestion)}
          >
            Apply
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}
