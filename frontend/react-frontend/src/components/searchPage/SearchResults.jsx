import React from "react";
import {
    Typography,
    Grid,
    IconButton,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import FoodResultCard from "./FoodResultCard.jsx";
import SearchEmptyState from "./SearchEmptyState.jsx";

export default function SearchResults({
                                          items = [],
                                          loading = false,
                                          page = 0,
                                          totalPages = 0,
                                          onPrev,
                                          onNext,
                                      }) {
    const hasResults = items.length > 0;
    const canPrev = page > 0;
    const canNext = totalPages > 0 && page < totalPages - 1;

    return (
        <div className="search-card">
            <div className="search-card__content">
                <div className="results__header">
                    <Typography variant="subtitle1" className="results__title">
                        Results
                    </Typography>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Typography variant="body2" color="text.secondary">
                            {totalPages > 0 ? `Page ${page + 1} / ${totalPages}` : "No pages"}
                        </Typography>

                        <Tooltip title="Previous page">
              <span>
                <IconButton onClick={onPrev} disabled={!canPrev || loading}>
                  <ChevronLeftRoundedIcon />
                </IconButton>
              </span>
                        </Tooltip>

                        <Tooltip title="Next page">
              <span>
                <IconButton onClick={onNext} disabled={!canNext || loading}>
                  <ChevronRightRoundedIcon />
                </IconButton>
              </span>
                        </Tooltip>
                    </div>
                </div>

                {loading && !hasResults ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                        <CircularProgress />
                    </div>
                ) : !hasResults ? (
                    <SearchEmptyState />
                ) : (
                    <Grid container spacing={2} className="results__grid">
                        {items.map((food) => (
                            <Grid item xs={12} sm={6} md={4} key={food.id}>
                                <FoodResultCard food={food} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </div>
        </div>
    );
}
