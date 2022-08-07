import React from "react";
import clsx from "clsx";

import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import HomeDropdownMenu from "./HomeDropdownMenu";

import "./BackgroundImage.css";

const useStyles = makeStyles((theme) => ({
  root: {},
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
}));

export default function Home({ drawerOpen, handleDrawerOpen, darkMode }) {
  const classes = useStyles();

  return (
    <>
      {!darkMode ? (
        <div className="lightBg">
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, drawerOpen && classes.hide)}
            >
              <MenuIcon style={{ fill: "white" }} fontSize="large" />
            </IconButton>
          </Toolbar>
          <div>
            <HomeDropdownMenu />
          </div>
        </div>
      ) : (
        <div className="darkBg">
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, drawerOpen && classes.hide)}
            >
              <MenuIcon style={{ fill: "white" }} fontSize="large" />
            </IconButton>
          </Toolbar>
          <div>
            <HomeDropdownMenu />
          </div>
        </div>
      )}
    </>
  );
}
