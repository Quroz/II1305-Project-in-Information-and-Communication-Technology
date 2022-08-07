import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";

import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import TimePickerPresenter from "../subcomponents/TimePickerPresenter";
import { useLocation } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core";
import BookingTablePresenter from "./booking/BookingTablePresenter";

const useStyles = makeStyles((theme) => ({
  root: {},
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.down("sm")]: {},
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${300}px)`,
      marginLeft: 300,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
}));

export default function AppBarPresenter({
  drawerOpen,
  handleDrawerOpen,
  model,
  darkMode,
  campusName,
  changeSVG,
}) {
  let location = useLocation();
  const classes = useStyles();
  const theme = useTheme();

  if (location.pathname.endsWith("/")) {
    return null;
  } else {
    return (
      <div>
        <CssBaseline />
        <AppBar
          color="secondary"
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: drawerOpen,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, drawerOpen && classes.hide)}
            >
              <MenuIcon style={{ color: theme.palette.text.primary }} />
            </IconButton>
            <TimePickerPresenter model={model} darkMode={darkMode} />
            <BookingTablePresenter
              model={model}
              campusName={campusName}
              changeSVG={changeSVG}
            />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
