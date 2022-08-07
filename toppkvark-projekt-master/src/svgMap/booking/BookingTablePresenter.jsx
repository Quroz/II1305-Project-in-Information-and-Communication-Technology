import React from "react";
import BookingTableView from "./BookingTableView";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { getBookings } from "../../firebase";
import WeekendIcon from "@material-ui/icons/Weekend";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

export default function BookingDialogPresenter({
  model,
  campusName,
  changeSVG,
}) {
  const [open, setOpen] = React.useState(false);

  const [tableRooms, setTableRooms] = React.useState([]);

  async function getRoomsForTable() {
    console.log(campusName);
    let bookings = await getBookings(
      campusName,
      model.getStartTime(),
      model.getEndTime(),
      model.getDate()
    );
    setTableRooms(bookings);
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    // Close alerts
    setOpenError(false);
    setOpenSuccess(false);
  };

  return (
    <div>
      <Button
        startIcon={<WeekendIcon />}
        variant="filled"
        color="primary"
        onClick={() => {
          setOpen(true);
          getRoomsForTable();
        }}
      >
        Rooms
      </Button>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Rooms"}</DialogTitle>
        <DialogContent>
          <BookingTableView
            setOpen={setOpen}
            model={model}
            campusName={campusName}
            tableRooms={tableRooms}
            setOpenSuccess={setOpenSuccess}
            setOpenError={setOpenError}
            changeSVG={changeSVG}
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => setOpen(false)}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          The room was booked!
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          You have already booked a room.
        </Alert>
      </Snackbar>
    </div>
  );
}
