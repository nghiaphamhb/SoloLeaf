import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";

export default function SearchFilters({ filters, onChange, onApply, onReset }) {
  const setField = (key, value) => {
    onChange?.({ ...filters, [key]: value });
  };

  return (
    <div className="search-card">
      <Accordion className="search-card" elevation={0} disableGutters defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className="filters__summary">
            <TuneIcon />
            <Typography className="filters__title">Filters</Typography>

            <div className="filters__chips">
              <Chip size="small" label={`Sort: ${filters?.sort || "Default"}`} />
              <Chip size="small" label={`Free ship: ${filters?.freeShip ? "Yes" : "Any"}`} />
              {filters?.minPrice ? <Chip size="small" label={`Min: ${filters.minPrice}`} /> : null}
              {filters?.maxPrice ? <Chip size="small" label={`Max: ${filters.maxPrice}`} /> : null}
            </div>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          <div className="search-card__content">
            <div className="filters__row">
              <TextField
                className="filters__field"
                label="Min price"
                type="number"
                value={filters?.minPrice ?? ""}
                onChange={(e) => setField("minPrice", e.target.value)}
              />

              <TextField
                className="filters__field"
                label="Max price"
                type="number"
                value={filters?.maxPrice ?? ""}
                onChange={(e) => setField("maxPrice", e.target.value)}
              />

              <FormControl className="filters__field" sx={{ minWidth: 220 }}>
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select
                  labelId="sort-label"
                  label="Sort"
                  value={filters?.sort ?? "idAsc"}
                  onChange={(e) => setField("sort", e.target.value)}
                >
                  <MenuItem value="idAsc">Default: Id ascent</MenuItem>
                  <MenuItem value="priceAsc">Price: Low → High</MenuItem>
                  <MenuItem value="priceDesc">Price: High → Low</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!filters?.freeShip}
                    onChange={(e) => setField("freeShip", e.target.checked)}
                  />
                }
                label="Free shipping only"
              />

              <div className="filters__actions">
                <Button variant="outlined" onClick={onReset}>
                  Reset
                </Button>
                <Button variant="contained" onClick={onApply}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
