import React from "react";
import BookingDialogPresenter from "./booking/BookingDialogPresenter";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Tab, Tabs, Typography } from "@material-ui/core";
import DomainIcon from "@material-ui/icons/Domain";
import AppBarPresenter from "./AppBarPresenter";
import { getBookings, removeBooking } from "../firebase";
import Fab from "@material-ui/core/Fab";
import BookIcon from "@material-ui/icons/Book";
import { Dialog, DialogTitle, DialogActions } from "@material-ui/core";
import Cookies from "js-cookie";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DeleteIcon from "@material-ui/icons/Delete";

// CSS for BuildingWiewer
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
  svg: {
    minWidth: "100%",
    maxWidth: "100%",
    marginTop: "72px",
    minHeight: "95vh",
    maxHeight: "100vh",
  },
  gridItem: {
    width: "150px",
    minWidth: "150px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
  tabs: {
    backgroundColor: theme.palette.text.primary,
    paddingTop: "68px",
  },
  tab: {
    fontSize: "20px",
  },
  textTab: {
    fontSize: "12px",
    width: "40px",
  },
  fab: {
    position: "fixed",
    bottom: "40px",
    right: "40px",
  },
}));

export default function BuildingView(props) {
  // Unrolls prompts
  let {
    drawerOpen,
    handleDrawerOpen,
    campusName,
    svgArray,
    roomId,
    openDialog,
    floor,
    handleFloorChange,
    floors,
    floorIndex,
    setRoomId,
    setOpenDialog,
    handleOpenDialog,
    model,
    force,
    darkMode,
  } = props;

  // Use custom CSS
  const classes = useStyles();
  const theme = useTheme();
  model.setCampus(campusName);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  async function changeSVG(file) {
    // Get group rooms
    let groupRooms = Array.from(
      file.contentDocument.getElementsByClassName("GroupRoom")
    ); // Make in to a array
    //console.log(model.getStartTime());

    let bookings = await getBookings(
      campusName,
      model.getStartTime(),
      model.getEndTime(),
      model.getDate()
    );

    //console.log(bookings);
    // Room color code
    groupRooms.forEach((room) => {
      room.setAttribute("style", "stroke-width: 0.1; fill: green;");
      if (bookings) {
        bookings.forEach((booked) => {
          //    console.log(booked.roomId + "   " + room.id)
          if (booked.roomId === room.id) {
            room.setAttribute("style", "stroke-width: 0.1; fill: red;");
          }
        });
      }
    });

    // Room event detection
    groupRooms.forEach((room) => {
      // Adds on mouseover events
      room.addEventListener(
        "mouseover",
        () => {
          setRoomId(room.getAttribute("id"));
          let temp = room.getAttribute("style");
          temp = temp.split(";");
          temp = `stroke-width: 0.4; ${temp[1]}; stroke: #00a8e8;`;
          room.setAttribute("style", temp);
        },
        false
      );

      // Adds on mouseout events
      room.addEventListener(
        "mouseout",
        () => {
          let temp = room.getAttribute("style");
          temp = temp.split(";");
          temp = `stroke-width: 0.1; ${temp[1]};`;
          room.setAttribute("style", temp);
        },
        false
      );

      // Adds on click events
      room.addEventListener(
        "click",
        () => {
          handleOpenDialog();
        },
        false
      );
    });
  }

  const [checkBookingDialog, setCheckBookingDialog] = React.useState(false);

  //FOOK WARNING DONT LOOK 🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿
  if (force) {
    changeSVG(document.getElementById("test"));
  }
  //FOOK WARNING OVER ALL GOOD 🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿🗿

  return (
    <>
      <Container maxWidth="sm">
        <AppBarPresenter
          handleDrawerOpen={handleDrawerOpen}
          drawerOpen={drawerOpen}
          model={model}
          darkMode={darkMode}
          campusName={campusName}
          changeSVG={changeSVG}
        />
      </Container>
      <div className={classes.root}>
        <Tabs
          TabIndicatorProps={{
            style: {
              background: "rgba(50, 72, 168,1)",
              padding: "0.5vh",
              borderRadius: "5px 5px 0px 0px",
            },
          }}
          className={classes.tabs}
          aria-label="floor tabs"
          centered
          value={floor}
        >
          <Tab
            className={classes.textTab}
            icon={<DomainIcon />}
            disabled={true}
            label="Select floor"
          />
          {floors.map((item) => (
            <Tab
              key={item.floor}
              className={classes.tab}
              onClick={() => handleFloorChange(item)}
              label={`${item.floor}`}
              value={item.floor}
            />
          ))}
        </Tabs>
        <object
          className={classes.svg}
          type="image/svg+xml"
          id="test"
          data={svgArray[floorIndex]}
          aria-label="SVG"
          onLoad={() => {
            changeSVG(document.getElementById("test"));
          }}
        />
        {Cookies.get("bookingData") && (
          <Fab
            size="large"
            className={classes.fab}
            color="secondary"
            onClick={() => setCheckBookingDialog(true)}
          >
            <BookIcon />
          </Fab>
        )}
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          maxWidth="sm"
          open={checkBookingDialog}
          onClose={() => setCheckBookingDialog(false)}
        >
          <DialogTitle id="simple-dialog-title">
            <Typography
              variant="h5"
              style={{ color: theme.palette.text.primary }}
            >
              You have booked room: {Cookies.get("bookingData")}
            </Typography>
          </DialogTitle>
          <DialogActions>
            <Button
              startIcon={<DeleteIcon />}
              style={{
                backgroundColor: "rgba(242, 4, 0, 0.8)",
                color: theme.palette.text.primary,
                position: "absolute",
                bottom: "5px",
                right: "100px",
              }}
              variant="contained"
              onClick={() => {
                removeBooking();
                setCheckBookingDialog(false);
                model.setHaveBookedRoom(false);
              }}
            >
              Remove booking
            </Button>
            <Button
              style={{
                position: "absolute",
                bottom: "5px",
              }}
              onClick={() => setCheckBookingDialog(false)}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <BookingDialogPresenter
          floor={floor}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          roomId={roomId}
          campusName={campusName}
          model={model}
          changeSVG={changeSVG}
        />
      </div>
    </>
  );
}
