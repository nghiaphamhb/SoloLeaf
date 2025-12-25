import React, { useMemo } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Box, Fab, Badge } from "@mui/material";

export default function CartButton({ count = 0, onOpen }) {
  const badgeContent = useMemo(() => {
    if (count > 99) return "99+";
    return count;
  }, [count]);

  return (
    <Box className="cart-fab">
      <Badge badgeContent={badgeContent} color="error" overlap="circular" invisible={!count}>
        <Fab onClick={onOpen} aria-label="Open cart">
          <ShoppingCartOutlinedIcon />
        </Fab>
      </Badge>
    </Box>
  );
}
