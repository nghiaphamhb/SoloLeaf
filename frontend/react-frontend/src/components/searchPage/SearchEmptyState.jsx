import React from "react";
import { Stack, Typography } from "@mui/material";

export default function SearchEmptyState() {
  return (
    <Stack className="search-empty" spacing={0.5} sx={{ py: 4 }} alignItems="center">
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        No results
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        Try a different keyword or adjust filters.
      </Typography>
    </Stack>
  );
}
