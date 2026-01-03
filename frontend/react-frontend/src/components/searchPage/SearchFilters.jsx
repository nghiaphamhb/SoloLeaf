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

export default function SearchFilters() {
  return (
    <div className="search-card">
      <Accordion className="search-card" elevation={0} disableGutters defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className="filters__summary">
            <TuneIcon />
            <Typography className="filters__title">Filters</Typography>

            {/* Placeholder chips (sau này bind theo state) */}
            <div className="filters__chips">
              <Chip size="small" label="Sort: Relevance" />
              <Chip size="small" label="Free ship: Any" />
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
                inputProps={{ min: 0 }}
              />
              <TextField
                className="filters__field"
                label="Max price"
                type="number"
                inputProps={{ min: 0 }}
              />

              <FormControl className="filters__field" sx={{ minWidth: 220 }}>
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select labelId="sort-label" label="Sort" defaultValue="relevance">
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="priceAsc">Price: Low → High</MenuItem>
                  <MenuItem value="priceDesc">Price: High → Low</MenuItem>
                  <MenuItem value="idAsc">Newest</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel control={<Checkbox />} label="Free shipping only" />

              <div className="filters__actions">
                <Button variant="outlined">Reset</Button>
                <Button variant="contained">Apply</Button>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
