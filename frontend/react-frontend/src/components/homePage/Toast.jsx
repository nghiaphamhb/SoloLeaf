import React from "react";
import {
  Snackbar,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export function Toast({
  showOrderToast,
  setShowOrderToast,
  orderToastText,

  showPushPrompt,
  onDismissPush,
  onEnablePush,

  pushLoading = false,
  pushError = "",
}) {
  return (
    <>
      {/* --- Toast after order success --- */}
      <Snackbar
        open={showOrderToast}
        autoHideDuration={3500}
        onClose={() => setShowOrderToast(false)}
      >
        <Alert
          onClose={() => setShowOrderToast(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {orderToastText}
        </Alert>
      </Snackbar>

      {/* --- Prompt enable push --- */}
      <Dialog open={showPushPrompt} onClose={onDismissPush} maxWidth="xs" fullWidth>
        <DialogTitle>Track orders with notifications?</DialogTitle>

        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            Do you want to enable notifications to track order status?
          </Typography>

          {pushError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {pushError}
            </Alert>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button onClick={onDismissPush} disabled={pushLoading}>
            Later
          </Button>

          <Button onClick={onEnablePush} variant="contained" disabled={pushLoading}>
            {pushLoading ? "Enabling..." : "Enable"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
