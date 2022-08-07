import React from "react";

import { Dialog, DialogTitle, DialogActions } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import { Card, CardMedia } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  useTheme,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import placesKista from "../../assets/placesKista.json";
import placesSodertalje from "../../assets/placesSodertalje.json";
import placesFlemingsberg from "../../assets/placesFlemingsberg.json";

import EventSeatIcon from "@material-ui/icons/EventSeat";
import DomainIcon from "@material-ui/icons/Domain";
import WebAssetIcon from "@material-ui/icons/WebAsset";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import Cookies from "js-cookie";

import { createBooking, isBooked } from "../../firebase";

import marks from "./marks";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip
      open={open}
      enterTouchDelay={0}
      placement="bottom-left"
      title={value}
    >
      {children}
    </Tooltip>
  );
}

export default function BookingDialogView({
  onClose,
  open,
  roomId,
  floor,
  campusName,
  // book,
  model,
  changeSVG,
  haveBooked,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const overrideTheme = createMuiTheme({
    overrides: {
      MuiSlider: {
        root: {
          color: theme.palette.text.primary,
        },
        markLabel: {
          color: "rgba(0,0,0,0)",
          userSelect: "none",
        },
        mark: {
          scrollMarginInlineEnd: "",
        },
        markLabelActive: {
          color: "rgba(0,0,0,0)",
          userSelect: "none",
        },
        track: {
          color: "rgba(0,255,0,0.3)",
        },
      },
      MuiTooltip: {
        tooltip: {
          padding: "10px 10px 10px 10px",
          opacity: "1",
          fontSize: "1.5em",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
        },
      },
    },
  });

  const [openError, setOpenError] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    // Close alerts
    setOpenError(false);
    setOpenSuccess(false);
  };

  // Ignore warnings about Date.prototype (DO NOT REMOVE; NOT A COMMENT)
  /*eslint no-extend-native: ["error", { "exceptions": ["Date"] }]*/

  // Gets the dates hours, adds leading zero when less than 10
  // eslint-disable-next-line
  Date.prototype.getHoursZero = function () {
    let hours = this.getHours();
    if (hours < 10) hours = `0${hours}`;
    return hours;
  };

  // Gets the dates minutes, adds leading zero when less then 10
  // eslint-disable-next-line
  Date.prototype.getMinutesZero = function () {
    let minutes = this.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;
    return minutes;
  };

  const getValue = (date) => {
    for (let index = 0; index < marks.length; index++) {
      if (
        date.getHoursZero() + ":" + date.getMinutesZero() ===
        marks[index].label
      )
        return index;
    }
    return 0;
  };

  // Initaial values
  const [value, setValue] = React.useState([
    getValue(model.getStartTime()) === 0 ? 0 : getValue(model.getStartTime()),
    getValue(model.getEndTime()) === 0 ? 21 : getValue(model.getEndTime()),
  ]);

  // Update values when model changes
  React.useEffect(() => {
    function obs() {
      setValue([
        getValue(model.getStartTime()) === 0
          ? 0
          : getValue(model.getStartTime()),
        getValue(model.getEndTime()) === 0 ? 21 : getValue(model.getEndTime()),
      ]);
    }
    model.addObserver(obs);
    return function () {
      model.removeObserver(obs);
    };
  }, [model]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Gets values from slider, books room.
  // TO DO: stop user from booking multiple rooms
  async function handleBooking() {
    // Close any alerts still open
    setOpenError(false);
    setOpenSuccess(false);

    if (haveBooked) {
      setErrorMessage("You have already booked a room.");
      setOpenError(true);
      return;
    }

    // Get times from slider
    let startTimes = marks[value[0]].label.split(":");
    let endTimes = marks[value[1]].label.split(":");
    let date = model.getStartTime();
    let start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(startTimes[0], 10),
      parseInt(startTimes[1], 10),
      0,
      0
    );
    let end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(endTimes[0], 10),
      parseInt(endTimes[1], 10),
      0,
      0
    );

    // Logic to stop user from booking invalid times
    let diff = Math.abs(start - end); // Broken
    diff = diff / (1000 * 60 * 60);
    if (diff < 1) {
      setErrorMessage("Cannot book period smaller than 1 hour!");
      setOpenError(true);
      return;
    } else if (diff > 2) {
      setErrorMessage("Cannot book period greater than 2 hours!");
      setOpenError(true);
      return;
    }

    // Logic to stop user from booking taken time
    let b = await isBooked(campusName, roomId, start, end, model.getDate());
    if (b) {
      // Room is taken
      setErrorMessage("Room is already booked!");
      setOpenError(true);
    } else {
      // Book room
      setOpenSuccess(true);
      createBooking(
        model.getCampus(),
        roomId,
        "test",
        start,
        end,
        model.getDate()
      );
      model.setHaveBookedRoom(true);
      Cookies.set("haveBooked", true);
      changeSVG(document.getElementById("test"));
    }
  }

  let hasWhiteboard;
  let seats;
  let roomImage;
  let api;
  if (campusName === "Kista") api = placesKista;
  else if (campusName === "Sodertalje") api = placesSodertalje;
  else api = placesFlemingsberg;

  for (let index = 0; index < api.length; index++) {
    if (roomId === api[index].roomDisplayName) {
      if (api[index].equipment != null) hasWhiteboard = true;
      else hasWhiteboard = false;

      seats = api[index].numSeats;
      if (api[index].imageUrls[0] != null)
        roomImage = api[index].imageUrls[0].url;
      else
        roomImage = "https://demechanica.com/sv/files/2018/07/placeholder.png";
    }
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        onClose={() => onClose()}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <Grid
          container
          alignItems="center"
          alignContent="center"
          style={{ overflow: "hidden" }}
        >
          <Grid item xs={6}>
            <DialogTitle id="simple-dialog-title">
              <Typography
                variant="h5"
                style={{ color: theme.palette.text.primary }}
              >
                Book room <br />
                {roomId}
              </Typography>
            </DialogTitle>
          </Grid>
          <Grid item xs={6}>
            <Grid container alignItems="center" style={{ paddingTop: "4vh" }}>
              <Grid item xs={6}>
                <Chip
                  icon={<DomainIcon />}
                  label={"Floor " + floor}
                  color="primary"
                />
              </Grid>
              <Grid item xs={6}>
                <Chip
                  label={seats + " Seats"}
                  color="primary"
                  icon={<EventSeatIcon />}
                />
              </Grid>
              <Grid item xs={6}>
                <Chip
                  label={"Whiteboard"}
                  icon={
                    hasWhiteboard ? (
                      <WebAssetIcon />
                    ) : (
                      <CancelPresentationIcon />
                    )
                  }
                  color="primary"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4} style={{ paddingTop: "1vh" }}>
            <Typography
              align="center"
              style={{ color: theme.palette.text.primary }}
              variant="h6"
            >
              {" "}
              {marks[value[0]].label + "-" + marks[value[1]].label}
            </Typography>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <ThemeProvider theme={overrideTheme}>
              <Slider
                value={value}
                onChange={handleChange}
                min={
                  getValue(model.getStartTime()) === 0
                    ? 0
                    : getValue(model.getStartTime())
                }
                max={
                  getValue(model.getEndTime()) === 0
                    ? 21
                    : getValue(model.getEndTime())
                }
                marks={marks}
                ValueLabelComponent={ValueLabelComponent}
                valueLabelDisplay="auto"
                valueLabelFormat={() => {
                  return [marks[value[0]].label, "-", marks[value[1]].label];
                }}
              />
            </ThemeProvider>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={4}></Grid>
          <Grid style={{ marginBottom: "2rem" }} align="center" item xs={4}>
            <Button
              value={value}
              onClick={handleBooking}
              variant="contained"
              color="secondary"
              size="large"
            >
              Book
            </Button>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={12}>
            <Card>
              <CardMedia
                style={{ paddingTop: "50%" }}
                image={roomImage}
                title="Grupprum"
              />
            </Card>
          </Grid>
        </Grid>

        <DialogActions>
          <Button onClick={() => onClose()} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          The room was booked!
        </Alert>
      </Snackbar>
    </>
  );
}
