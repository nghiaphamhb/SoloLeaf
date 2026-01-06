import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

export default function RestaurantTabs({ tabs = [], activeTab, onChange }) {
  return (
    <Box className="search-tabs">
      <Tabs
        value={activeTab}
        onChange={(e, v) => onChange?.(v)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab value="all" label="All" />
        {tabs.map((t) => (
          <Tab key={t.id} value={t.id} label={t.title} />
        ))}
      </Tabs>
    </Box>
  );
}
