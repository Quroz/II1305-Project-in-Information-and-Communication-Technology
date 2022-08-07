import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import placesKista from "../../assets/placesKista.json";
import placesSodertalje from "../../assets/placesSodertalje.json";
import placesFlemingsberg from "../../assets/placesFlemingsberg.json";

import { createBooking } from "../../firebase";

import Cookies from "js-cookie";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function createData(roomId, floor, seats, model) {
  let startTime = new Date(model.getStartTime().toString());
  let startTime2 = new Date(startTime.toString()).addHours(2);
  return {
    roomId,
    floor,
    seats,
    times: [
      {
        showStart: startTime.getNormalTime(),
        showEnd: startTime2.getNormalTime(),
        showDate: startTime.toNormalString(),
        start: startTime,
        end: startTime2,
        date: startTime,
        campusName: model.getCampus(),
        roomId: roomId,
      },
    ],
  };
}

// Gets values from slider, books room.
// TO DO: stop user from booking multiple rooms
const handleBooking = (timesRow, model, setOpenError, setOpenSuccess) => {
  let hasBooked = Cookies.get("haveBooked");
  if (hasBooked === "true") hasBooked = true;
  else hasBooked = false;
  if (hasBooked) {
    setOpenError(true);
    return;
  }

  model.setHaveBookedRoom(true);
  Cookies.set("haveBooked", true, {
    expires: timesRow.end,
  });

  setOpenSuccess(true);
  createBooking(
    timesRow.campusName,
    timesRow.roomId,
    "test",
    timesRow.start,
    timesRow.end,
    timesRow.start
  );
};

function Row(props) {
  const {
    row,
    setOpen,
    setOpenSuccess,
    changeSVG,
    setOpenError,
    model,
  } = props;
  const [openTable, setOpenTable] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root} hover="true">
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenTable(!openTable)}
          >
            {openTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.roomId}
        </TableCell>
        <TableCell align="right">{row.floor}</TableCell>
        <TableCell align="right">{row.seats}</TableCell>
      </TableRow>
      <TableRow hover="true">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openTable} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.times.map((timesRow) => (
                    <TableRow key={timesRow.date}>
                      <TableCell component="th" scope="row">
                        {timesRow.showDate}
                      </TableCell>
                      <TableCell>{timesRow.showStart}</TableCell>
                      <TableCell>{timesRow.showEnd}</TableCell>
                      <TableCell align="right">
                        <Button
                          //value={value}
                          onClick={() => {
                            handleBooking(
                              timesRow,
                              model,
                              setOpenError,
                              setOpenSuccess
                            );
                            setOpen(false);
                            changeSVG(document.getElementById("test"));
                          }}
                          variant="contained"
                          color="secondary"
                          size="small"
                        >
                          Book
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    roomId: PropTypes.string.isRequired,
    floor: PropTypes.number.isRequired,
    seats: PropTypes.number.isRequired,
    times: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
};

// Function that returns array with all grouprooms in one campus
// format: [{roomId, floor, seats}, ...]
const getRooms = (campusName) => {
  let api;
  let initalLetters;
  if (campusName === "Kista") {
    api = placesKista;
    initalLetters = "Ka";
  } else if (campusName === "Sodertalje") {
    api = placesSodertalje;
    initalLetters = "Sö";
  } else {
    api = placesFlemingsberg;
    initalLetters = "Fl";
  }

  let rooms = [];
  for (let index = 0; index < api.length; index++) {
    if (api[index].roomDisplayName.split("-")[0] === initalLetters)
      rooms.push({
        roomId: api[index].roomDisplayName,
        floor: api[index].floor,
        seats: api[index].numSeats,
      });
  }
  return rooms;
};

// Gets the dates hours, adds leading zero when less than 10
// eslint-disable-next-line
Date.prototype.getNormalTime = function () {
  let hours = this.getHours();
  if (hours < 10) hours = `0${hours}`;
  let minutes = this.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;
  return `${hours}:${minutes}`;
};

// sluttid är alltid 2 timmar före starttid när man öppnar sidan
// eslint-disable-next-line
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

// Converts date to a string in the DD-MM-YYYY format
// eslint-disable-next-line
Date.prototype.toNormalString = function () {
  return (
    this.getFullYear() + "-" + this.getMonthZero() + "-" + this.getDateZero()
  );
};

// Gets the dates month++, adds leading zero when less than 10
// eslint-disable-next-line
Date.prototype.getMonthZero = function () {
  let month = this.getMonth() + 1;
  if (month < 10) month = `0${month}`;
  return month;
};

// Gets the dates date, adds leading zero when less than 10
// eslint-disable-next-line
Date.prototype.getDateZero = function () {
  let date = this.getDate();
  if (date < 10) date = `0${date}`;
  return date;
};

export default function CollapsibleTable({
  model,
  campusName,
  tableRooms,
  setOpenSuccess,
  setOpenError,
  setOpen,
  changeSVG,
}) {
  // create rows here

  let rows = [];

  let rooms = getRooms(campusName);
  rooms.forEach((room) => {
    let isNotBooked = true;
    tableRooms.forEach((tableRoom) => {
      if (tableRoom.roomId === room.roomId) {
        isNotBooked = false;
      }
    });
    if (isNotBooked) {
      rows.push(createData(room.roomId, room.floor, room.seats, model));
    }
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Room ID</TableCell>
              <TableCell align="right">Floor</TableCell>
              <TableCell align="right">Seats</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.roomId}
                row={row}
                setOpen={setOpen}
                setOpenSuccess={setOpenSuccess}
                changeSVG={changeSVG}
                setOpenError={setOpenError}
                model={model}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
