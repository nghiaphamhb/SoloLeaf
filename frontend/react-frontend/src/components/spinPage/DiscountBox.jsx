import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { apiRequest } from "../../apis/request/apiRequest.js";

export default function DiscountBox({ copyText, formatTime }) {
  const [discounts, setDiscounts] = useState([]);

  const hasDiscounts = discounts.length > 0;

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await apiRequest("/api/promo");
        const promos = Array.isArray(res?.data) ? res.data : [];

        const mapped = promos.map((p) => ({
          id: p.id,
          code: p.code,
          percent: p.percent,
          startDate: p.startDate,
          endDate: p.endDate,
          resId: p.resId,
          restaurantName: p.resTitle, // map backend → UI
        }));
        if (alive) setDiscounts(mapped);
      } catch {
        // apiRequest already notifies Bugsnag
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <Card className="lucky-discount__card">
      <Box className="lucky-discount__rightHeader">
        <Typography variant="h6">My unused codes</Typography>
      </Box>

      <Divider className="lucky-discount__divider" />

      {!hasDiscounts ? (
        <Typography className="lucky-discount__empty">
          No discounts saved yet. Spin to get one 🙂
        </Typography>
      ) : (
        <Box className="lucky-discount__tableWrap">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Restaurant</TableCell>
                <TableCell align="right">%</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell align="right">Copy</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {discounts.map((d) => (
                <TableRow key={d.code}>
                  <TableCell>
                    <Typography className="lucky-discount__mono">{d.code}</Typography>
                  </TableCell>

                  <TableCell>{d.restaurantName ?? `Restaurant #${d.resId}`}</TableCell>

                  <TableCell align="right">{d.percent}</TableCell>

                  <TableCell>{formatTime(d.endDate)}</TableCell>

                  <TableCell align="right">
                    <Tooltip title="Copy code">
                      <IconButton size="small" onClick={() => copyText(d.code)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Card>
  );
}
