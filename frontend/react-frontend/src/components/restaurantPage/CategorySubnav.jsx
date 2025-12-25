import React from "react";
import { Box, Tab, Tabs } from "@mui/material";

export default function CategorySubnav({ activeTab, onTabChange, categories }) {
  return (
    <Box className="menu-subnav">
      <Tabs
        value={activeTab}
        onChange={(e, v) => onTabChange?.(v)}
        variant="scrollable"
        scrollButtons="auto"
        className="menu-subnav__tabs"
      >
        {categories.map((c) => (
          <Tab key={c.id} label={c.name} className="menu-subnav__tab" />
        ))}
      </Tabs>
    </Box>
  );
}
